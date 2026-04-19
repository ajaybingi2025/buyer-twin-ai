import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import { useTheme } from '../components/ThemeContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { isDark } = useTheme()

  return (
    <PageWrapper maxWidth="max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full rounded-[28px] p-8 ${isDark ? 'surface-dark' : 'surface-light'}`}
      >
        <p className={`text-sm font-medium uppercase tracking-[0.2em] ${isDark ? 'muted-dark' : 'muted-light'}`}>
          BuyerTwin AI
        </p>
        <h1 className="mt-3 text-3xl font-bold">Agent Decision Copilot</h1>
        <p className={`mt-3 ${isDark ? 'muted-dark' : 'muted-light'}`}>
          Understand buyer behavior, rank homes, and generate personalized outreach.
        </p>

        <motion.button
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/inbox')}
          className={`mt-8 w-full rounded-2xl px-4 py-3 text-sm font-semibold ${
            isDark ? 'primary-btn-dark' : 'primary-btn-light'
          }`}
        >
          Enter Demo Dashboard
        </motion.button>
      </motion.div>
    </PageWrapper>
  )
}