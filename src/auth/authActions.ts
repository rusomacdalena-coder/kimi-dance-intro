export type OAuthProvider = 'google' | 'github'

type AuthResult = Promise<{ error: { message: string } | null }>

export interface MinimalSupabaseClient {
  auth: {
    signInWithPassword(credentials: { email: string; password: string }): AuthResult
    signInWithOtp(options: { email: string; options: { emailRedirectTo: string } }): AuthResult
    signInWithOAuth(options: { provider: OAuthProvider; options: { redirectTo: string } }): AuthResult
    signOut(): AuthResult
  }
}

export interface AuthActions {
  signInWithPassword(email: string, password: string): Promise<void>
  sendEmailOtp(email: string): Promise<void>
  signInWithOAuth(provider: OAuthProvider): Promise<void>
  signOut(): Promise<void>
}

export interface AuthConfigStatus {
  configured: boolean
  message: string
}

interface AuthEnv {
  VITE_SUPABASE_URL?: string
  VITE_SUPABASE_ANON_KEY?: string
}

export function getAuthConfigStatus(env: AuthEnv): AuthConfigStatus {
  const url = (env.VITE_SUPABASE_URL ?? '').trim()
  const key = (env.VITE_SUPABASE_ANON_KEY ?? '').trim()

  if (!url || !key || key.includes('your-supabase') || key.includes('粘贴')) {
    return {
      configured: false,
      message: 'Supabase URL 和 anon key 尚未配置。',
    }
  }

  return {
    configured: true,
    message: '',
  }
}

function dashboardRedirect(origin: string) {
  return `${origin.replace(/\/$/, '')}/#/dashboard`
}

async function throwIfAuthError(result: Awaited<AuthResult>) {
  if (result.error) throw new Error(result.error.message)
}

export function createAuthActions(
  client: MinimalSupabaseClient,
  origin = typeof window === 'undefined' ? 'https://kimidance.com' : window.location.origin
): AuthActions {
  return {
    async signInWithPassword(email: string, password: string) {
      const result = await client.auth.signInWithPassword({ email, password })
      await throwIfAuthError(result)
    },

    async sendEmailOtp(email: string) {
      const result = await client.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: dashboardRedirect(origin),
        },
      })
      await throwIfAuthError(result)
    },

    async signInWithOAuth(provider: OAuthProvider) {
      const result = await client.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: dashboardRedirect(origin),
        },
      })
      await throwIfAuthError(result)
    },

    async signOut() {
      const result = await client.auth.signOut()
      await throwIfAuthError(result)
    },
  }
}
