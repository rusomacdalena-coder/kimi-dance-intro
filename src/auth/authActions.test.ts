import { describe, expect, it, vi } from 'vitest'
import {
  createAuthActions,
  getAuthConfigStatus,
  type MinimalSupabaseClient,
} from './authActions'

function fakeClient(overrides: Partial<MinimalSupabaseClient['auth']> = {}): MinimalSupabaseClient {
  return {
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
      signInWithOtp: vi.fn().mockResolvedValue({ error: null }),
      signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      ...overrides,
    },
  }
}

describe('getAuthConfigStatus', () => {
  it('requires both Supabase URL and anon key', () => {
    expect(getAuthConfigStatus({ VITE_SUPABASE_URL: '', VITE_SUPABASE_ANON_KEY: '' })).toEqual({
      configured: false,
      message: 'Supabase URL 和 anon key 尚未配置。',
    })
  })

  it('accepts a real looking Supabase URL and key', () => {
    expect(
      getAuthConfigStatus({
        VITE_SUPABASE_URL: 'https://example.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'sb_publishable_123',
      }).configured
    ).toBe(true)
  })
})

describe('createAuthActions', () => {
  it('signs in with email and password', async () => {
    const client = fakeClient()
    const actions = createAuthActions(client)

    await actions.signInWithPassword('user@example.com', 'secret-password')

    expect(client.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'secret-password',
    })
  })

  it('sends an email otp with redirect back to the current origin', async () => {
    const client = fakeClient()
    const actions = createAuthActions(client, 'https://kimidance.com')

    await actions.sendEmailOtp('user@example.com')

    expect(client.auth.signInWithOtp).toHaveBeenCalledWith({
      email: 'user@example.com',
      options: {
        emailRedirectTo: 'https://kimidance.com/#/dashboard',
      },
    })
  })

  it('starts Google OAuth with the dashboard redirect', async () => {
    const client = fakeClient()
    const actions = createAuthActions(client, 'https://kimidance.com')

    await actions.signInWithOAuth('google')

    expect(client.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: 'https://kimidance.com/#/dashboard',
      },
    })
  })
})
