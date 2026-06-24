'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Check if banned
  if (data.user) {
    const { data: profile } = await supabase.from('profiles').select('status').eq('id', data.user.id).single()
    if (profile && profile.status === 'BANNED') {
      await supabase.auth.signOut()
      return { error: 'Your account has been suspended.' }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/profile')
}

export async function adminLogin(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  if (authData.user) {
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim()) : [];
    if (!adminEmails.includes(authData.user.email || '')) {
      await supabase.auth.signOut()
      return { error: 'Unauthorized access: Email not recognized as admin.' }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  // Explicitly create or update the profile row in case a DB trigger doesn't exist
  if (data.user) {
    await supabase.from('profiles').upsert([
      { 
        id: data.user.id, 
        name: name, 
        email: email,
        status: 'ACTIVE'
      }
    ], { onConflict: 'id' });
  }

  revalidatePath('/', 'layout')
  redirect('/profile')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}
