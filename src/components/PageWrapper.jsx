import ThemeToggle from './ThemeToggle'
import { useTheme } from './ThemeContext'

export default function PageWrapper({ children, maxWidth = 'max-w-6xl' }) {
  const { isDark } = useTheme()

  return (
    <div className={isDark ? 'page-shell-dark p-6 md:p-8' : 'page-shell-light p-6 md:p-8'}>
      <div className={`mx-auto ${maxWidth}`}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${isDark ? 'muted-dark' : 'muted-light'}`}>
              BuyerTwin AI
            </p>
          </div>
          <ThemeToggle />
        </div>

        {children}
      </div>
    </div>
  )
}