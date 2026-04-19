import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from './ThemeContext'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={toggleTheme}
      type="button"
      className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
        isDark ? 'secondary-btn-dark' : 'secondary-btn-light'
      }`}
    >
      <span className="flex items-center gap-2">
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </span>
    </motion.button>
  )
}