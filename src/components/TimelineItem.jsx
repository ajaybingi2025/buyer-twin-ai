import { motion } from 'framer-motion'
import { useTheme } from './ThemeContext'

export default function TimelineItem({ type, text, time }) {
  const { isDark } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 rounded-2xl p-4 ${isDark ? 'surface-dark' : 'surface-light'}`}
    >
      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-900 dark:bg-slate-200" />
      <div>
        <p className="text-sm font-semibold">{type}</p>
        <p className={`text-sm leading-6 ${isDark ? 'muted-dark' : 'muted-light'}`}>{text}</p>
        <p className={`mt-1 text-xs ${isDark ? 'muted-dark' : 'muted-light'}`}>{time}</p>
      </div>
    </motion.div>
  )
}