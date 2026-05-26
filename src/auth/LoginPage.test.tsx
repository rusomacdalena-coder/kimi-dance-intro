import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import LoginPage from './LoginPage'
import type { AuthActions } from './authActions'

function actions(overrides: Partial<AuthActions> = {}): AuthActions {
  return {
    signInWithPassword: vi.fn().mockResolvedValue(undefined),
    sendEmailOtp: vi.fn().mockResolvedValue(undefined),
    signInWithOAuth: vi.fn().mockResolvedValue(undefined),
    signOut: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

describe('LoginPage', () => {
  it('renders a real login form instead of the design canvas', () => {
    render(<LoginPage actions={actions()} isSupabaseConfigured />)

    expect(screen.getByRole('heading', { name: '开始今天的拉片' })).toBeInTheDocument()
    expect(screen.getByLabelText('邮箱')).toBeInTheDocument()
    expect(screen.getByLabelText('密码')).toBeInTheDocument()
    expect(screen.queryByText('① 登录 · Login')).not.toBeInTheDocument()
    expect(screen.queryByText('案桌 · Dashboard')).not.toBeInTheDocument()
  })

  it('submits password login through Supabase auth actions', async () => {
    const user = userEvent.setup()
    const authActions = actions()
    render(<LoginPage actions={authActions} isSupabaseConfigured />)

    await user.type(screen.getByLabelText('邮箱'), 'user@example.com')
    await user.type(screen.getByLabelText('密码'), 'secret-password')
    await user.click(screen.getByRole('button', { name: '登录 →' }))

    expect(authActions.signInWithPassword).toHaveBeenCalledWith('user@example.com', 'secret-password')
  })

  it('switches to email code mode and sends an OTP', async () => {
    const user = userEvent.setup()
    const authActions = actions()
    render(<LoginPage actions={authActions} isSupabaseConfigured />)

    await user.type(screen.getByLabelText('邮箱'), 'user@example.com')
    await user.click(screen.getByRole('button', { name: '改用验证码' }))
    await user.click(screen.getByRole('button', { name: '发送验证码' }))

    expect(authActions.sendEmailOtp).toHaveBeenCalledWith('user@example.com')
  })

  it('warns when Supabase config is missing', () => {
    render(<LoginPage actions={actions()} isSupabaseConfigured={false} />)

    expect(screen.getByText('Supabase URL 和 anon key 尚未配置。')).toBeInTheDocument()
  })
})
