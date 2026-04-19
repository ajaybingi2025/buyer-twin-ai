import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, House, Sparkles, ArrowRight } from 'lucide-react'
import PageWrapper from '../components/PageWrapper'
import { useTheme } from '../components/ThemeContext'
import BrandHeader from '../components/BrandHeader'
import LogoStrip from '../components/LogoStrip'
import AnimatedSection from '../components/AnimatedSection'

export default function RoleSelectPage() {
  const navigate = useNavigate()
  const { isDark } = useTheme()

  return (
    <PageWrapper maxWidth="max-w-7xl">
      <BrandHeader
        title="BuyerTwin AI"
        subtitle="A real-estate intelligence experience that helps agents understand buyers better and helps buyers discover homes with more personalized relevance."
      />

      <LogoStrip />

      <AnimatedSection delay={0.08}>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.button
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => navigate('/login/buyer')}
            className={`group rounded-[32px] p-8 text-left ${isDark ? 'surface-dark' : 'surface-light'}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className={`rounded-2xl p-4 ${isDark ? 'badge-dark' : 'badge-light'}`}>
                <House size={28} />
              </div>
              <ArrowRight className="transition group-hover:translate-x-1" />
            </div>

            <p className={`mt-8 text-sm font-semibold uppercase tracking-[0.2em] ${isDark ? 'muted-dark' : 'muted-light'}`}>
              Buyer Portal
            </p>
            <h2 className="mt-3 text-3xl font-bold">Explore homes and shape your recommendations</h2>
            <p className={`mt-4 text-sm leading-7 ${isDark ? 'muted-dark' : 'muted-light'}`}>
              Search Arizona homes, save favorites, request tours, and let your activity guide smarter AI-powered suggestions.
            </p>
          </motion.button>

          <motion.button
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => navigate('/login/realtor')}
            className={`group rounded-[32px] p-8 text-left ${isDark ? 'surface-dark' : 'surface-light'}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className={`rounded-2xl p-4 ${isDark ? 'badge-dark' : 'badge-light'}`}>
                <Building2 size={28} />
              </div>
              <ArrowRight className="transition group-hover:translate-x-1" />
            </div>

            <p className={`mt-8 text-sm font-semibold uppercase tracking-[0.2em] ${isDark ? 'muted-dark' : 'muted-light'}`}>
              Agent Portal
            </p>
            <h2 className="mt-3 text-3xl font-bold">Understand buyer behavior and act faster</h2>
            <p className={`mt-4 text-sm leading-7 ${isDark ? 'muted-dark' : 'muted-light'}`}>
              Review buyer intelligence, event signals, recommended listings, and personalized outreach — all in one place.
            </p>
          </motion.button>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.16}>
        <div className={`mt-8 rounded-[32px] p-6 md:p-8 ${isDark ? 'surface-dark' : 'surface-light'}`}>
          <div className="flex items-center gap-3">
            <Sparkles size={20} />
            <h3 className="text-xl font-semibold">Why this demo will feel strong</h3>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <InfoCard
              title="Role-based experience"
              text="Separate buyer and agent portals make the value proposition clearer to judges."
              isDark={isDark}
            />
            <InfoCard
              title="Behavior-driven intelligence"
              text="Every search, click, save, and tour request becomes a signal for recommendations."
              isDark={isDark}
            />
            <InfoCard
              title="Premium visual polish"
              text="Smooth transitions, branded surfaces, and clear flows make the product feel real."
              isDark={isDark}
            />
          </div>
        </div>
      </AnimatedSection>
    </PageWrapper>
  )
}

function InfoCard({ title, text, isDark }) {
  return (
    <div className={`rounded-[24px] p-5 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className={`mt-2 text-sm leading-6 ${isDark ? 'muted-dark' : 'muted-light'}`}>
        {text}
      </p>
    </div>
  )
}