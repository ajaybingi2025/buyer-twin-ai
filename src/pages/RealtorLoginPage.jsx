import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, ArrowRight } from 'lucide-react'
import PageWrapper from '../components/PageWrapper'
import { useTheme } from '../components/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { trackEvent } from '../api/events'
import AppFooter from '../components/AppFooter'

export default function RealtorLoginPage() {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { login, loading } = useAuth()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const data = await login({
        email: form.email,
        password: form.password,
      })

      if (data.user.role !== 'agent') {
        throw new Error('This account is not an agent account')
      }

      await trackEvent({
        userId: String(data.user.id),
        role: 'agent',
        eventType: 'login_clicked',
        page: 'agent_login',
        targetId: 'agent_login_submit',
        metadata: { email: form.email },
      })

      navigate('/inbox')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <PageWrapper maxWidth="max-w-5xl">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`rounded-[32px] p-8 md:p-10 ${isDark ? 'surface-dark' : 'surface-light'}`}
        >
          <div className={`inline-flex rounded-2xl p-4 ${isDark ? 'badge-dark' : 'badge-light'}`}>
            <Building2 size={28} />
          </div>

          <p className={`mt-6 text-xs font-semibold uppercase tracking-[0.25em] ${isDark ? 'muted-dark' : 'muted-light'}`}>
            Agent Portal
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Login to your intelligence dashboard</h1>
          <p className={`mt-4 max-w-xl text-sm leading-7 ${isDark ? 'muted-dark' : 'muted-light'}`}>
            Understand buyer behavior, review ranked listings, and send more relevant outreach with confidence.
          </p>

          <div className="mt-8 space-y-4">
            <Feature text="See buyer signals and readiness in one place" isDark={isDark} />
            <Feature text="Explain why certain homes are stronger fits" isDark={isDark} />
            <Feature text="Generate and send smarter outreach faster" isDark={isDark} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`rounded-[32px] p-8 md:p-10 ${isDark ? 'surface-dark' : 'surface-light'}`}
        >
          <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${isDark ? 'muted-dark' : 'muted-light'}`}>
            Sign In
          </p>
          <h2 className="mt-3 text-3xl font-bold">Agent Login</h2>
          <p className={`mt-3 text-sm leading-7 ${isDark ? 'muted-dark' : 'muted-light'}`}>
            Enter your credentials to access the dashboard.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <input
              name="email"
              type="email"
              placeholder="Agent email"
              value={form.email}
              onChange={handleChange}
              className={`w-full rounded-2xl px-4 py-4 ${isDark ? 'input-dark' : 'input-light'}`}
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={`w-full rounded-2xl px-4 py-4 ${isDark ? 'input-dark' : 'input-light'}`}
            />

            {error ? <p className="text-sm text-red-500">{error}</p> : null}

            <motion.button
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-semibold ${
                isDark ? 'primary-btn-dark' : 'primary-btn-light'
              }`}
            >
              {loading ? 'Signing in...' : 'Login as Agent'}
              {!loading ? <ArrowRight size={18} /> : null}
            </motion.button>
          </form>

          <p className={`mt-5 text-sm ${isDark ? 'muted-dark' : 'muted-light'}`}>
            No agent account yet?{' '}
            <Link to="/register/agent" className="font-semibold underline">
              Register here
            </Link>
          </p>
        </motion.div>
      </div>

      <AppFooter />
    </PageWrapper>
  )
}

function Feature({ text, isDark }) {
  return (
    <div className={`rounded-2xl p-4 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
      <p className={`text-sm ${isDark ? 'muted-dark' : 'muted-light'}`}>{text}</p>
    </div>
  )
}