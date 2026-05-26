import { createClient } from '@supabase/supabase-js'
import { getAuthConfigStatus } from '../auth/authActions'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const authConfigStatus = getAuthConfigStatus({
  VITE_SUPABASE_URL: supabaseUrl,
  VITE_SUPABASE_ANON_KEY: supabaseAnonKey,
})

export const supabase = createClient(
  authConfigStatus.configured ? supabaseUrl : 'https://example.supabase.co',
  authConfigStatus.configured ? supabaseAnonKey : 'missing-anon-key'
)
