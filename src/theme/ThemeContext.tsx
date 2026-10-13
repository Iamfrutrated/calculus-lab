import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type ThemeName = 'light' | 'dark'

const STORAGE_KEY = 'calculus-lab-theme'

type ThemeValue = {
  theme: ThemeName
  toggle: () => void
}

const ThemeContext = createContext<ThemeValue>({
  theme: 'light',
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggle: () => setTheme((current) => (current === 'light' ? 'dark' : 'light')),
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
