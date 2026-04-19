import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getCurrentUser, loginUser, registerUser } from '../api/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('buyertwin-user')
    return raw ? JSON.parse(raw) : null
  })

  const [loading, setLoading] = useState(false)
  const [bootstrapping, setBootstrapping] = useState(true)

  const saveSession = (data) => {
    localStorage.setItem('buyertwin-token', data.access_token)
    localStorage.setItem('buyertwin-user', JSON.stringify(data.user))
    setUser(data.user)
  }

  const login = async (payload) => {
    setLoading(true)
    try {
      const data = await loginUser(payload)
      saveSession(data)
      return data
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload) => {
    setLoading(true)
    try {
      const data = await registerUser(payload)
      saveSession(data)
      return data
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('buyertwin-token')
    localStorage.removeItem('buyertwin-user')
    setUser(null)
  }

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('buyertwin-token')

      if (!token) {
        setBootstrapping(false)
        return
      }

      try {
        const data = await getCurrentUser()
        setUser(data.user)
        localStorage.setItem('buyertwin-user', JSON.stringify(data.user))
      } catch {
        logout()
      } finally {
        setBootstrapping(false)
      }
    }

    bootstrap()
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      bootstrapping,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }),
    [user, loading, bootstrapping]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}