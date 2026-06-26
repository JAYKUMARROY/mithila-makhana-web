import { createClient } from '@/utils/supabase/server'

export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not logged in', supabase, user: null }
  const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim()) : [];
  if (!adminEmails.includes(user.email || '')) return { error: 'Unauthorized', supabase, user }
  return { error: null, supabase, user }
}

export async function requireUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not logged in', supabase, user: null }
  return { error: null, supabase, user }
}
