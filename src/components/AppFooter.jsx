import { useTheme } from './ThemeContext'

export default function AppFooter() {
  const { isDark } = useTheme()

  return (
    <div className="mt-10 pb-4 text-center">
      <p className={`text-xs uppercase tracking-[0.2em] ${isDark ? 'muted-dark' : 'muted-light'}`}>
        Built for Lofty Hackathon • Global Hacks • ACM ASU
      </p>
    </div>
  )
}