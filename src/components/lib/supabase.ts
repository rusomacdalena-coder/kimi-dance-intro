import { createClient } from '@supabase/supabase-js'

// anon key 是设计上公开的客户端凭证（行级安全 RLS 保护数据），
// 与线上构建产物中的值一致。
const supabaseUrl = 'https://srnhhofbfhyvfdcstkwd.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybmhob2ZiZmh5dmZkY3N0a3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MjQwNDksImV4cCI6MjA5NDAwMDA0OX0.KRQ870a_VJ66xlM4-AhsdXFhKChTef6LBhoKpBc1FfM'

export const isSupabaseConfigured = true

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
