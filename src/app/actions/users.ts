'use server'

import { createClient } from '@/utils/supabase/server'

export async function getAllUsers() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim()) : [];
  if (!adminEmails.includes(user.email || '')) return []

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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not logged in' }

  const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim()) : [];
  if (!adminEmails.includes(user.email || '')) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', userId)

  if (error) return { error: error.message }
  return { success: true }
}
