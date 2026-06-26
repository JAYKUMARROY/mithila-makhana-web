'use server'

import { requireAdmin } from '@/lib/auth'

export async function getAllUsers() {
  const { error, supabase } = await requireAdmin()
  if (error) return []

  // Fetch all profiles along with their non-cancelled orders to compute purchased products
  const { data } = await supabase
    .from('profiles')
    .select(`
      *,
      orders (
        status,
        order_items ( quantity )
      )
    `)
    .order('created_at', { ascending: false })

  return data || []
}

export async function updateUserStatus(userId: string, status: string) {
  const { error, supabase } = await requireAdmin()
  if (error) return { error }

  if (status !== 'ACTIVE' && status !== 'BANNED') return { error: 'Invalid status' }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', userId)

  if (updateError) return { error: updateError.message }
  return { data: true }
}
