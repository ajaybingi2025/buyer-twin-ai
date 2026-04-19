import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, ArrowRight } from 'lucide-react'
import PageWrapper from '../components/PageWrapper'
import { useTheme } from '../components/ThemeContext'
import { useAuth } from '../context/AuthContext'
import AppFooter from '../components/AppFooter'

export default function BuyerRegisterPage() {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { register, loading } = useAuth()

  const [form, setForm] = useState({
    name: '',
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
      const data = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'buyer',
      })

      navigate(`/buyer/${data.user.id}/home`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <PageWrapper maxWidth="max-w-5xl">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`rounded-[32px] p-8 md:p-10 ${isDark ? 'surface-dark' : 'surface-light'}`}
        >
          <div className={`inline-flex rounded-2xl p-4 ${isDark ? 'badge-dark' : 'badge-light'}`}>
            <UserPlus size={28} />
          </div>

          <p className={`mt-6 text-xs font-semibold uppercase tracking-[0.25em] ${isDark ? 'muted-dark' : 'muted-light'}`}>
            New Buyer
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Create your buyer account</h1>
          <p className={`mt-4 text-sm leading-7 ${isDark ? 'muted-dark' : 'muted-light'}`}>
            Start with discovery, interact with homes, and let the platform learn your preferences over time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`rounded-[32px] p-8 md:p-10 ${isDark ? 'surface-dark' : 'surface-light'}`}
        >
          <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${isDark ? 'muted-dark' : 'muted-light'}`}>
            Register
          </p>
          <h2 className="mt-3 text-3xl font-bold">Buyer Register</h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <input
              name="name"
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              className={`w-full rounded-2xl px-4 py-4 ${isDark ? 'input-dark' : 'input-light'}`}
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
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
              {loading ? 'Creating account...' : 'Register as Buyer'}
              {!loading ? <ArrowRight size={18} /> : null}
            </motion.button>
          </form>

          <p className={`mt-5 text-sm ${isDark ? 'muted-dark' : 'muted-light'}`}>
            Already have an account?{' '}
            <Link to="/login/buyer" className="font-semibold underline">
              Login here
            </Link>
          </p>
        </motion.div>
      </div>

      <AppFooter />
    </PageWrapper>
  )
}