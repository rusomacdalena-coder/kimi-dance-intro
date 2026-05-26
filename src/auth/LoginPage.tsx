import { useState, type FormEvent } from 'react'
import logoUrl from '../../assets/logo-kimidance-cream.png'
import { createAuthActions, type AuthActions } from './authActions'
import { supabase, authConfigStatus } from '../lib/supabase'

type LoginMode = 'password' | 'otp'

interface LoginPageProps {
  actions?: AuthActions
  isSupabaseConfigured?: boolean
  configMessage?: string
}

const defaultActions = createAuthActions(supabase)

export default function LoginPage({
  actions = defaultActions,
  isSupabaseConfigured = authConfigStatus.configured,
  configMessage = authConfigStatus.message,
}: LoginPageProps) {
  const [mode, setMode] = useState<LoginMode>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function runAuth(action: () => Promise<void>, successMessage: string) {
    setError('')
    setMessage('')

    if (!isSupabaseConfigured) {
      setError(configMessage || 'Supabase URL 和 anon key 尚未配置。')
      return
    }

    setLoading(true)
    try {
      await action()
      setMessage(successMessage)
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请稍后再试。')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (mode === 'otp') {
      await runAuth(
        () => actions.sendEmailOtp(email),
        '验证码邮件已发送，请检查邮箱并完成登录。'
      )
      return
    }

    await runAuth(
      () => actions.signInWithPassword(email, password),
      '登录成功，正在进入工作台。'
    )
  }

  async function handleOAuth(provider: 'google' | 'github') {
    await runAuth(() => actions.signInWithOAuth(provider), '正在跳转到授权页面。')
  }

  return (
    <main className="login-shell">
      <section className="login-stage" aria-label="KimiDance 登录">
        <div className="brand-panel">
          <img className="logo" src={logoUrl} alt="KimiDance" />

          <div className="brand-copy">
            <div className="label">Private Beta · 2026</div>
            <h1 className="headline">
              稍等片刻
              <br />
              一部漫剧视频
              <br />
              变成可用的文学剧本
            </h1>
            <p className="lead">
              上传视频，自动拉片、识别角色、分析叙事。
              <br />
              一个午觉的时间，拿到一份可读的剧本。
            </p>

            <div className="metrics" aria-label="产品指标">
              <div className="metric">
                <strong>1/10</strong>
                <small>竞品成本</small>
              </div>
              <div className="metric-divider" aria-hidden="true" />
              <div className="metric">
                <strong>
                  2<small>GB</small>
                </strong>
                <small>单文件上限</small>
              </div>
              <div className="metric-divider" aria-hidden="true" />
              <div className="metric">
                <strong>
                  30<small>+</small>
                </strong>
                <small>内测已完成</small>
              </div>
            </div>
          </div>

          <div className="copyright">© 2026 kimidance</div>
        </div>

        <div className="form-panel">
          <div className="form-card">
            <div className="signup-link">
              没有账号？ <a href="mailto:hello@kimidance.com">申请内测 →</a>
            </div>

            <div className="label">登录</div>
            <h2 className="form-title">开始今天的拉片</h2>
            <p className="form-subtitle">邮箱 + 密码，或一次性验证码。</p>

            {!isSupabaseConfigured && (
              <div className="auth-alert" role="alert">
                {configMessage || 'Supabase URL 和 anon key 尚未配置。'}
              </div>
            )}

            <form className="form" onSubmit={handleSubmit}>
              <label className="field" htmlFor="email">
                <span className="label">邮箱</span>
                <input
                  id="email"
                  aria-label="邮箱"
                  className="input"
                  type="email"
                  placeholder="you@studio.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>

              {mode === 'password' && (
                <label className="field" htmlFor="password">
                  <span className="field-row">
                    <span className="label">密码</span>
                    <a href="mailto:hello@kimidance.com">忘记？</a>
                  </span>
                  <input
                    id="password"
                    aria-label="密码"
                    className="input"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </label>
              )}

              <label className="remember">
                <input type="checkbox" defaultChecked />
                <span className="checkbox" aria-hidden="true">
                  ✓
                </span>
                <span>30 天内保持登录</span>
              </label>

              <button className="button button-primary" type="submit" disabled={loading}>
                {loading ? '处理中...' : mode === 'password' ? '登录 →' : '发送验证码'}
              </button>

              <div className="secondary-actions">
                <button
                  className="button"
                  type="button"
                  onClick={() => {
                    setMode(mode === 'password' ? 'otp' : 'password')
                    setError('')
                    setMessage('')
                  }}
                >
                  {mode === 'password' ? '改用验证码' : '改用密码'}
                </button>
                <button
                  className="button"
                  type="button"
                  onClick={() => setMessage('微信登录需要在 Supabase 配置自定义 OAuth 后接入。')}
                >
                  微信扫码
                </button>
              </div>
            </form>

            <div className="divider">或继续以</div>

            <div className="oauth" aria-label="第三方登录">
              <button className="button" type="button" onClick={() => handleOAuth('google')}>
                <span className="oauth-mark">G</span>Google
              </button>
              <button className="button" type="button" onClick={() => handleOAuth('github')}>
                <span className="oauth-mark">✦</span>GitHub
              </button>
              <button
                className="button"
                type="button"
                onClick={() => setMessage('微信登录需要在 Supabase 配置自定义 OAuth 后接入。')}
              >
                <span className="oauth-mark">W</span>微信
              </button>
            </div>

            <div className="toast" role="status" aria-live="polite">
              {error || message}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
