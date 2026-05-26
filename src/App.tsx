import { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from './auth/AuthContext'
import LoginPage from './auth/LoginPage'
import Dashboard from './Dashboard'

function getRoute() {
  return window.location.hash.replace(/^#/, '') || '/login'
}

function AppRoutes() {
  const [route, setRoute] = useState(getRoute)
  const { session, loading } = useAuth()

  useEffect(() => {
    function handleHashChange() {
      setRoute(getRoute())
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (loading) {
    return (
      <main className="loading-shell">
        <div className="loader-card">正在检查登录状态...</div>
      </main>
    )
  }

  if (route === '/dashboard') {
    return session ? <Dashboard /> : <LoginPage />
  }

  return session ? <Dashboard /> : <LoginPage />
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
