import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('buyertwin-theme') || 'light'
  })

  useEffect(() => {
    localStorage.setItem('buyertwin-theme', theme)
    document.body.classList.remove('light-theme', 'dark-theme')
    document.body.classList.add(theme === 'light' ? 'light-theme' : 'dark-theme')
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      toggleTheme: () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}