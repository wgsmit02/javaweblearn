import { createContext, useContext, useState } from 'react'
import { authApi } from '../api/auth'

interface AuthContextValue {
  token: string | null
  username: string | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Persist token in localStorage so the user stays logged in on page refresh
  const [token, setToken]       = useState<string | null>(() => localStorage.getItem('token'))
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('username'))

  async function login(username: string, password: string) {
    const res = await authApi.login(username, password)
    localStorage.setItem('token', res.token)
    localStorage.setItem('username', res.username)
    setToken(res.token)
    setUsername(res.username)
  }

  async function register(username: string, password: string) {
    const res = await authApi.register(username, password)
    localStorage.setItem('token', res.token)
    localStorage.setItem('username', res.username)
    setToken(res.token)
    setUsername(res.username)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setToken(null)
    setUsername(null)
  }

  return (
    <AuthContext.Provider value={{ token, username, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
