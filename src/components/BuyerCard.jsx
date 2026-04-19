import { Link } from 'react-router-dom'
import { ArrowRight, CircleDollarSign, Gauge, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from './ThemeContext'

export default function BuyerCard({ buyer }) {
  const { isDark } = useTheme()

  return (
    <motion.div whileHover={{ y: -6 }} whileTap={{ scale: 0.99 }}>
      <Link
        to={`/buyer/${buyer.id}`}
        className={`group block rounded-3xl p-5 ${
          isDark ? 'surface-dark' : 'surface-light'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{buyer.name}</h3>
            <div className={`mt-2 inline-flex items-center gap-2 text-sm ${isDark ? 'muted-dark' : 'muted-light'}`}>
              <Sparkles size={16} />
              <span>{buyer.primaryDriver}</span>
            </div>
          </div>

          <span className={`rounded-full px-3 py-1 text-xs font-medium ${isDark ? 'badge-dark' : 'badge-light'}`}>
            {buyer.readiness}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-black/5 p-3 dark:bg-white/5">
            <div className={`flex items-center gap-2 ${isDark ? 'muted-dark' : 'muted-light'}`}>
              <Gauge size={16} />
              <p>Urgency</p>
            </div>
            <p className="mt-1 font-medium">{buyer.urgency}</p>
          </div>

          <div className="rounded-2xl bg-black/5 p-3 dark:bg-white/5">
            <div className={`flex items-center gap-2 ${isDark ? 'muted-dark' : 'muted-light'}`}>
              <CircleDollarSign size={16} />
              <p>Budget</p>
            </div>
            <p className="mt-1 font-medium">{buyer.budget}</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-black/5 p-3 dark:bg-white/5">
          <p className={`text-xs uppercase tracking-wide ${isDark ? 'muted-dark' : 'muted-light'}`}>
            Next action
          </p>
          <p className="mt-1 text-sm">{buyer.nextAction}</p>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
          Open buyer <ArrowRight size={16} className="transition group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  )
}