'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

import { requireAdmin } from '@/lib/auth'

export async function getProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) return { data: [], error: error.message }
  return { data }
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) return { data: null, error: error.message }
  return { data }
}

export async function addProduct(product: {
  name: string
  slug: string
  short_description?: string
  description?: string
  price: number
  image_url?: string
  stock_quantity?: number
  is_active?: boolean
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
    .single()

  if (dbError) return { error: dbError.message }
  
  revalidatePath('/admin/products')
  revalidatePath('/admin/inventory')
  revalidatePath('/shop')
  return { data }
}

export async function updateProduct(id: string, updates: {
  name?: string;
  slug?: string;
  short_description?: string;
  description?: string;
  price?: number;
  image_url?: string;
  stock_quantity?: number;
  is_active?: boolean;
}) {
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

export async function deleteStorageImage(imageUrl: string) {
  const { error, supabase } = await requireAdmin()
  if (error) return { error }

  try {
    const parts = imageUrl.split('/product-images/');
    if (parts.length === 2) {
      const fileName = parts[1];
      await supabase.storage.from('product-images').remove([fileName]);
    }
  } catch(e) {
    console.error('Failed to delete image:', e);
  }
  return { data: true }
}

export async function deleteProduct(id: string) {
  const { error, supabase } = await requireAdmin()
  if (error) return { error }

  const { data: product } = await supabase.from('products').select('*').eq('id', id).single();
  
  if (product) {
    let images: string[] = [];
    if (product.image_url) images.push(product.image_url);
    try {
      const meta = JSON.parse(product.description || '{}');
      if (meta.images) {
        images = [...images, ...meta.images];
      }
    } catch(e) {}
    
    const uniqueImages = Array.from(new Set(images));
    for (const img of uniqueImages) {
      await deleteStorageImage(img);
    }
  }

  const { error: dbError } = await supabase.from('products').delete().eq('id', id)
  if (dbError) return { error: dbError.message }
  
  revalidatePath('/admin/products')
  revalidatePath('/admin/inventory')
  revalidatePath('/shop')
  return { data: true }
}
