import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

const configuredUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const configuredAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export const isSupabaseConfigured = Boolean(configuredUrl && configuredAnonKey)

export const supabase = createClient<Database>(
  configuredUrl || 'http://127.0.0.1:54321',
  configuredAnonKey || 'public-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'lfh-auth',
    },
  },
)
