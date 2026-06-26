'use server'

import { createClient } from '@/utils/supabase/server'
import { requireAdmin } from '@/lib/auth'

export async function uploadProductImage(formData: FormData) {
  try {
    const { error: authError } = await requireAdmin()
    if (authError) return { error: authError }

    const file = formData.get('file') as File;
    if (!file) return { error: "No file provided" };

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) return { error: 'Invalid file type. Only JPG, PNG, WEBP allowed.' }
    if (file.size > 5 * 1024 * 1024) return { error: 'File size must be under 5MB' }

    const supabase = await createClient();
    
    // Check if bucket exists, create if not (optional, requires higher privileges, usually created in dashboard)
    // We assume the bucket "product-images" exists and is public.
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload Error:', error);
      return { error: error.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return { publicUrl };
  } catch (error: any) {
    console.error('Storage Error:', error);
    return { error: error.message };
  }
}
