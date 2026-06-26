'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getWalletBalance() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  // Run expiry check before returning balance
  await expireStaleCredits(user.id)

  const { data: profile } = await supabase
    .from('profiles')
    .select('wallet_balance')
    .eq('id', user.id)
    .single()

  return profile?.wallet_balance || 0
}

export async function getWalletTransactions(page: number = 1, limit: number = 20) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const offset = (page - 1) * limit

  const { data } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  return data || []
}

export async function useWalletBalance(amount: number, orderId: string, orderTotal: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not logged in' }

  if (orderTotal < 349) {
    return { success: false, error: 'Minimum order total of ₹349 required to use wallet' }
  }

  const maxWallet = Math.floor(orderTotal * 0.7)
  if (amount > maxWallet) {
    return { success: false, error: `Maximum ₹${maxWallet} (70%) can be used from wallet` }
  }

  const currentBalance = await getWalletBalance()
  if (amount > currentBalance) {
    return { success: false, error: 'Insufficient wallet balance' }
  }

  const actualAmount = Math.min(amount, maxWallet, currentBalance)
  if (actualAmount <= 0) return { success: false, error: 'Invalid amount' }

  // FIFO Deduction
  const { data: activeCredits } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', user.id)
    .eq('type', 'CREDIT')
    .gt('remaining_amount', 0)
    .order('created_at', { ascending: true }) // Oldest first

  if (!activeCredits || activeCredits.length === 0) {
    return { success: false, error: 'No active credits found' }
  }

  let amountToDeduct = actualAmount
  for (const credit of activeCredits) {
    if (amountToDeduct <= 0) break

    const deductFromThisCredit = Math.min(credit.remaining_amount, amountToDeduct)
    amountToDeduct -= deductFromThisCredit

    await supabase
      .from('wallet_transactions')
      .update({ remaining_amount: credit.remaining_amount - deductFromThisCredit })
      .eq('id', credit.id)
  }

  // Insert DEBIT transaction
  const { error: insertError } = await supabase
    .from('wallet_transactions')
    .insert({
      user_id: user.id,
      type: 'DEBIT',
      amount: actualAmount,
      balance_after: currentBalance - actualAmount,
      source: 'ORDER_DISCOUNT',
      reference_id: orderId,
      description: 'Used wallet balance for order'
    })

  if (insertError) return { success: false, error: 'Failed to record transaction' }

  // Update profile balance
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ wallet_balance: currentBalance - actualAmount })
    .eq('id', user.id)

  if (profileError) return { success: false, error: 'Failed to update balance' }

  revalidatePath('/wallet')
  revalidatePath('/profile')
  
  return { success: true, actualAmount }
}

export async function expireStaleCredits(userId?: string) {
  const supabase = await createClient()
  
  let userToCheck = userId
  if (!userToCheck) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    userToCheck = user.id
  }

  const now = new Date().toISOString()

  // Find expired credits with remaining amount
  const { data: expiredCredits } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', userToCheck)
    .eq('type', 'CREDIT')
    .gt('remaining_amount', 0)
    .lt('expires_at', now)

  if (!expiredCredits || expiredCredits.length === 0) return

  // Calculate total expired amount
  const totalExpired = expiredCredits.reduce((sum, c) => sum + c.remaining_amount, 0)
  
  // Get current balance to calculate balance_after
  const { data: profile } = await supabase
    .from('profiles')
    .select('wallet_balance')
    .eq('id', userToCheck)
    .single()
    
  let currentBalance = profile?.wallet_balance || 0

  // Process each expired credit
  for (const credit of expiredCredits) {
    const expiredAmt = credit.remaining_amount
    currentBalance -= expiredAmt
    
    // Insert EXPIRED transaction
    await supabase.from('wallet_transactions').insert({
      user_id: userToCheck,
      type: 'EXPIRED',
      amount: expiredAmt,
      balance_after: currentBalance,
      source: 'EXPIRY',
      reference_id: credit.id,
      description: 'Wallet credit expired (30 days)'
    })

    // Set remaining amount to 0
    await supabase
      .from('wallet_transactions')
      .update({ remaining_amount: 0 })
      .eq('id', credit.id)
  }

  // Update profile balance
  await supabase
    .from('profiles')
    .update({ wallet_balance: currentBalance })
    .eq('id', userToCheck)
    
  revalidatePath('/wallet')
}
