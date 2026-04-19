import { motion } from 'framer-motion'
import { useTheme } from './ThemeContext'

export default function BrandHeader({
  title = 'BuyerTwin AI',
  subtitle = 'AI decision copilot for real estate agents and buyers',
}) {
  const { isDark } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-[32px] p-8 md:p-10 ${
        isDark ? 'surface-dark' : 'surface-light'
      }`}
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-10 right-0 h-40 w-40 rounded-full bg-cyan-400 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-violet-400 blur-3xl" />
      </div>

      <div className="relative z-10">
        <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${isDark ? 'muted-dark' : 'muted-light'}`}>
          Lofty Hackathon Demo
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className={`mt-4 max-w-2xl text-sm leading-7 md:text-base ${isDark ? 'muted-dark' : 'muted-light'}`}>
          {subtitle}
        </p>
      </div>
    </motion.div>
  )
}