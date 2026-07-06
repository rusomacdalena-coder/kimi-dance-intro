import { useState, type FormEvent } from 'react'
import { isSupabaseConfigured, supabase } from './lib/supabase'

const occupations = ['编剧', '制片', '剪辑师', '学生', '其他']

export default function BetaForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.currentTarget
    const data = new FormData(form)
    const gotcha = String(data.get('_gotcha') ?? '')
    const email = String(data.get('email') ?? '').trim().toLowerCase()
    const occupation = String(data.get('occupation') ?? '').trim()
    const purposeValue = String(data.get('purpose') ?? '').trim()
    const purpose = purposeValue.length > 0 ? purposeValue : null

    if (gotcha) {
      setSubmitted(true)
      setLoading(false)
      return
    }

    if (!isSupabaseConfigured) {
      setError('申请通道还没配置好，请稍后再试')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.from('invite_requests').insert({
        email,
        occupation,
        purpose,
        source: 'landing_page',
        user_agent: navigator.userAgent.slice(0, 500),
      })

      if (!error || error.code === '23505') {
        setSubmitted(true)
      } else {
        setError('提交失败，请稍后再试，或直接邮件联系我')
      }
    } catch {
      setError('网络错误，请检查网络后重试')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12 px-6 rounded-2xl surface-glass">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-xl font-semibold mb-2">收到申请！</h3>
        <p className="copy-readable text-sm">
          我会统一审核并生成邀请码，再发到你的邮箱。
          <br />
          请留意收件箱（和垃圾箱）。
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 p-8 rounded-2xl surface-glass"
    >
      {/* 邮箱 */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-cream">
          邮箱 <span className="text-destructive">*</span>
        </label>
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="w-full h-11 px-4 rounded-xl field-glass text-sm text-foreground
                     focus:outline-none focus:ring-2 focus:ring-ring
                     placeholder:text-muted-foreground/50"
        />
      </div>

      {/* 角色 */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-cream">
          你的职业 <span className="text-destructive">*</span>
        </label>
        <select
          name="occupation"
          required
          defaultValue=""
          className="w-full h-11 px-4 rounded-xl field-glass text-sm
                     focus:outline-none focus:ring-2 focus:ring-ring
                     text-muted-foreground"
        >
          <option value="" disabled>
            选择你的职业
          </option>
          {occupations.map((occupation) => (
            <option key={occupation} value={occupation}>
              {occupation}
            </option>
          ))}
        </select>
      </div>

      {/* 一句话 */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-cream">
          一句话说说你想用来做什么
          <span className="text-muted-foreground font-normal ml-1">（选填）</span>
        </label>
        <textarea
          name="purpose"
          maxLength={300}
          rows={2}
          placeholder="例如：想拆解竞品的分场结构..."
          className="w-full px-4 py-3 rounded-xl field-glass text-sm text-foreground
                     focus:outline-none focus:ring-2 focus:ring-ring resize-none
                     placeholder:text-muted-foreground/50"
        />
      </div>

      {/* Honeypot - anti-spam */}
      <input type="text" name="_gotcha" className="hidden" />

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 px-4 py-2.5 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold
                   shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? '提交中...' : '提交申请'}
      </button>

      <p className="text-xs text-muted-foreground/60 text-center">
        邮箱仅用于发送邀请码和安装包，不会发送营销邮件
      </p>
    </form>
  )
}
