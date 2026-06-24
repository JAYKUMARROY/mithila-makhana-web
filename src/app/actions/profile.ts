'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProfile() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Fetch the basic profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    id: user.id,
    email: user.email,
    name: profile?.name || user.user_metadata?.full_name || '',
    phone: profile?.phone || user.user_metadata?.phone || '',
    addresses: profile?.addresses || user.user_metadata?.addresses || []
  }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not logged in' }

  const name = formData.get('name') as string
  const phone = formData.get('phone') as string

  // Update user metadata
  const { error: authError } = await supabase.auth.updateUser({
    data: {
      full_name: name,
      phone
    }
  })

  if (authError) return { error: authError.message }

  // Update profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ name, phone })
    .eq('id', user.id)

  if (profileError) return { error: profileError.message }

  revalidatePath('/profile')
  return { success: true }
}

export async function manageAddress(action: 'add' | 'edit' | 'delete' | 'set_default', addressData: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not logged in' }

  // Fetch from profiles to get the latest addresses JSONB array
  const { data: profile } = await supabase.from('profiles').select('addresses').eq('id', user.id).single();
  
  // Fallback to user_metadata in case of migrating existing addresses
  let addresses = profile?.addresses || user.user_metadata?.addresses || [];

  if (action === 'add') {
    if (addresses.length >= 10) return { error: 'Maximum 10 addresses allowed' }
    const newAddress = {
      id: Math.random().toString(36).substr(2, 9),
      isDefault: addresses.length === 0, // First address is default
      ...addressData
    };
    if (newAddress.isDefault) {
      addresses = addresses.map((a: any) => ({ ...a, isDefault: false }));
    }
    addresses.push(newAddress);
  } 
  else if (action === 'edit') {
    addresses = addresses.map((a: any) => a.id === addressData.id ? { ...a, ...addressData } : a);
  } 
  else if (action === 'delete') {
    addresses = addresses.filter((a: any) => a.id !== addressData.id);
    // If we deleted the default, make the first one default
    if (addresses.length > 0 && !addresses.some((a: any) => a.isDefault)) {
      addresses[0].isDefault = true;
    }
  } 
  else if (action === 'set_default') {
    addresses = addresses.map((a: any) => ({ ...a, isDefault: a.id === addressData.id }));
  }

  // Save to public.profiles instead of updateUser (which saves to user_metadata)
  const { error } = await supabase.from('profiles').update({ addresses }).eq('id', user.id);

  if (error) return { error: error.message }
  
  revalidatePath('/profile')
  revalidatePath('/') // To update navbar
  return { success: true }
}
