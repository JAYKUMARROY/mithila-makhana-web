'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not logged in', supabase, user: null }
  const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim()) : [];
  if (!adminEmails.includes(user.email || '')) return { error: 'Unauthorized', supabase, user }
  return { error: null, supabase, user }
}

export async function getProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) return []
  return data
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) return null
  return data
}

export async function addProduct(product: {
  name: string
  slug: string
  description?: string
  price: number
  image_url?: string
  stock_quantity?: number
}) {
  const { error, supabase } = await requireAdmin()
  if (error) return { error }

  if (!product.name?.trim()) return { error: 'Name is required' }
  if (!product.slug?.trim()) return { error: 'Slug is required' }
  if (!product.price || product.price <= 0) return { error: 'Price must be positive' }

  const { data, error: dbError } = await supabase
    .from('products')
    .insert([product])
    .select()

  if (dbError) return { error: dbError.message }
  
  revalidatePath('/admin/products')
  revalidatePath('/admin/inventory')
  revalidatePath('/shop')
  return { data }
}

export async function updateProduct(id: string, updates: any) {
  const { error, supabase } = await requireAdmin()
  if (error) return { error }

  if (updates.price !== undefined && updates.price <= 0) return { error: 'Price must be positive' }

  const { data, error: dbError } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()

  if (dbError) return { error: dbError.message }
  
  revalidatePath('/admin/products')
  revalidatePath('/admin/inventory')
  revalidatePath('/shop')
  return { data }
}

export async function deleteProduct(id: string) {
  const { error, supabase } = await requireAdmin()
  if (error) return { error }

  const { error: dbError } = await supabase.from('products').delete().eq('id', id)
  if (dbError) return { error: dbError.message }
  
  revalidatePath('/admin/products')
  revalidatePath('/admin/inventory')
  revalidatePath('/shop')
  return { success: true }
}
