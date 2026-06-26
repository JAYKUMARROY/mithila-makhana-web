'use server'

import { createClient } from '@/utils/supabase/server'

export async function checkDuplicates() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('referral_code')
    
  if (error) return { error: error.message }
  
  const counts: Record<string, number> = {}
  data.forEach((row: any) => {
    if (row.referral_code) {
      counts[row.referral_code] = (counts[row.referral_code] || 0) + 1
    }
  })
  
  const duplicates = Object.entries(counts).filter(([code, count]) => count > 1)
  return { duplicates, total: data.length }
}
