import { createAuthActions } from './auth/authActions'
import { useAuth } from './auth/AuthContext'
import { supabase } from './lib/supabase'

const authActions = createAuthActions(supabase)

export default function Dashboard() {
  const { user } = useAuth()

  async function handleSignOut() {
    await authActions.signOut()
    window.location.hash = '#/login'
  }

  return (
    <main className="dashboard-shell">
      <section className="dashboard-panel">
        <div>
          <div className="label">KimiDance 工作台</div>
          <h1 className="dashboard-title">登录已生效</h1>
          <p className="dashboard-copy">
            当前账号：{user?.email ?? '已认证用户'}。下一步可以把任务上传、历史列表和拉片结果接到这里。
          </p>
        </div>
        <button className="button button-primary dashboard-button" type="button" onClick={handleSignOut}>
          退出登录
        </button>
      </section>
    </main>
  )
}
