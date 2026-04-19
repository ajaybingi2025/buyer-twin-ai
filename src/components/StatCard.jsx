import { motion } from 'framer-motion'
import { useTheme } from './ThemeContext'

export default function StatCard({ label, value }) {
  const { isDark } = useTheme()

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-3xl p-5 ${isDark ? 'surface-dark' : 'surface-light'}`}
    >
      <p className={`text-sm ${isDark ? 'muted-dark' : 'muted-light'}`}>{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </motion.div>
  )
}