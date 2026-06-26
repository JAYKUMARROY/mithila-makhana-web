'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

function generateRandomCode(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function generateReferralCode() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Check if already has a code
  const { data: profile } = await supabase
    .from('profiles')
    .select('referral_code')
    .eq('id', user.id)
    .single()

  if (profile?.referral_code) {
    return profile.referral_code
  }

  // Generate new unique code
  let newCode = ''
  let isUnique = false
  while (!isUnique) {
    newCode = generateRandomCode()
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('referral_code', newCode)
      .maybeSingle()
    if (!existing) isUnique = true
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ referral_code: newCode })
    .eq('id', user.id)

  if (updateError) {
    console.error('Failed to save referral code to DB:', updateError)
    // Return null so the frontend doesn't show a fake code that isn't saved
    return null
  }

  return newCode
}

export async function getReferralStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('referral_code, wallet_balance')
    .eq('id', user.id)
    .single()

  const { data: ledger, error } = await supabase
    .from('referral_ledger')
    .select('*, referred_profile:profiles!referral_ledger_referred_id_fkey(name)')
    .eq('referrer_id', user.id)
    .order('created_at', { ascending: false })

  let total = 0
  let successful = 0
  let pending = 0
  const history = []

  if (ledger && !error) {
    total = ledger.length
    for (const item of ledger) {
      if (item.status === 'COMPLETED') successful++
      else if (item.status === 'PENDING') pending++

      history.push({
        id: item.id,
        friendName: item.referred_profile?.name ? 
          item.referred_profile.name.charAt(0) + '***' + item.referred_profile.name.slice(-1) : 'Friend',
        status: item.status,
        date: item.created_at,
        reward: item.reward_credited ? 50 : 0
      })
    }
  }

  return {
    code: profile?.referral_code || null,
    walletBalance: profile?.wallet_balance || 0,
    total,
    successful,
    pending,
    history
  }
}

export async function validateReferralCode(code: string) {
  if (!code || code.length < 5) return { valid: false, error: 'Invalid code length' }

  const supabase = await createClient()
  
  // Find the referrer using RPC to bypass RLS
  const { data: referrers, error } = await supabase
    .rpc('get_referrer_by_code', { code_to_check: code.toUpperCase() })

  if (error) {
    console.error('Supabase error in validateReferralCode:', error);
    return { valid: false, error: 'Database error while validating code' }
  }

  if (!referrers || referrers.length === 0) {
    return { valid: false, error: 'Invalid referral code' }
  }

  if (referrers.length > 1) {
    return { valid: false, error: 'Configuration Error: This referral code is assigned to multiple users.' }
  }

  const referrer = referrers[0];

  const { data: { user } } = await supabase.auth.getUser()
  if (user && user.id === referrer.id) {
    return { valid: false, error: 'You cannot use your own referral code' }
  }

  // Check daily limit (max 3 per day) using RPC to bypass RLS
  const { data: limitExceeded } = await supabase
    .rpc('check_referral_limit_exceeded', { referrer_uuid: referrer.id })

  if (limitExceeded) {
    return { valid: false, error: 'This referral code has reached its daily limit' }
  }

  return { valid: true, referrerName: referrer.name }
}

export async function creditReferrerReward(orderId: string) {
  const supabase = await createClient()
  
  // 1. Get the order
  const { data: order } = await supabase
    .from('orders')
    .select('user_id, total_amount, created_at')
    .eq('id', orderId)
    .single()
    
  if (!order) return { success: false, error: 'Order not found' }
  if (order.total_amount < 349) return { success: false, error: 'Order total below minimum' }

  // 2. Check if user was referred and has a pending referral ledger entry
  const { data: ledger } = await supabase
    .from('referral_ledger')
    .select('*')
    .eq('referred_id', order.user_id)
    .eq('status', 'PENDING')
    .single()

  if (!ledger) return { success: false, error: 'No pending referral found for this user' }
  if (ledger.reward_credited) return { success: false, error: 'Reward already credited' }

  // 3. Ensure this is their FIRST delivered order >= 349
  const { data: previousOrders } = await supabase
    .from('orders')
    .select('id')
    .eq('user_id', order.user_id)
    .eq('status', 'DELIVERED')
    .gte('total_amount', 349)
    .neq('id', orderId)
    .limit(1)

  if (previousOrders && previousOrders.length > 0) {
    // Not their first qualifying order. Mark as expired/invalid.
    await supabase.from('referral_ledger').update({ status: 'EXPIRED' }).eq('id', ledger.id)
    return { success: false, error: 'Not the first qualifying order' }
  }

  // 4. Credit the referrer
  const rewardAmount = 50
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30) // Expires in 30 days

  // Get current referrer wallet balance
  const { data: referrerProfile } = await supabase
    .from('profiles')
    .select('wallet_balance')
    .eq('id', ledger.referrer_id)
    .single()

  const currentBalance = referrerProfile?.wallet_balance || 0
  const newBalance = currentBalance + rewardAmount

  // Insert wallet transaction
  const { error: txError } = await supabase
    .from('wallet_transactions')
    .insert({
      user_id: ledger.referrer_id,
      type: 'CREDIT',
      amount: rewardAmount,
      balance_after: newBalance,
      source: 'REFERRAL_REWARD',
      reference_id: ledger.id,
      description: 'Referral reward for successful first order',
      expires_at: expiresAt.toISOString(),
      remaining_amount: rewardAmount
    })

  if (txError) return { success: false, error: 'Failed to record transaction' }

  // Update referrer profile
  await supabase
    .from('profiles')
    .update({ wallet_balance: newBalance })
    .eq('id', ledger.referrer_id)

  // Update referral ledger
  await supabase
    .from('referral_ledger')
    .update({ 
      status: 'COMPLETED', 
      reward_credited: true,
      order_id: orderId
    })
    .eq('id', ledger.id)

  return { success: true }
}
