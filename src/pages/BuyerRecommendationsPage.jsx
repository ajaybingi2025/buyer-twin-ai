import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Heart, CalendarDays } from 'lucide-react'
import { buyers, getRankedListingsForBuyer } from '../data/mockData'
import PageWrapper from '../components/PageWrapper'
import { useTheme } from '../components/ThemeContext'
import { trackEvent } from '../api/events'
import BrandHeader from '../components/BrandHeader'
import AnimatedSection from '../components/AnimatedSection'
import AppFooter from '../components/AppFooter'

export default function BuyerRecommendationsPage() {
  const { id } = useParams()
  const { isDark } = useTheme()
  const buyer = buyers.find((b) => b.id === id)

  if (!buyer) return <div className="p-10 text-xl">Buyer not found.</div>

  const recommendations = getRankedListingsForBuyer(buyer).slice(0, 3)

  const handleInterested = async (listing) => {
    await trackEvent({
      userId: String(buyer.id),
      role: 'buyer',
      eventType: 'listing_saved',
      page: 'buyer_recommendations',
      targetId: listing.id,
      metadata: {
        title: listing.address_label,
        city: listing.city,
        fitScore: listing.fitScore,
      },
    })
    alert(`Marked interested in ${listing.address_label}`)
  }

  const handleTour = async (listing) => {
    await trackEvent({
      userId: String(buyer.id),
      role: 'buyer',
      eventType: 'tour_requested',
      page: 'buyer_recommendations',
      targetId: listing.id,
      metadata: {
        title: listing.address_label,
        city: listing.city,
        fitScore: listing.fitScore,
      },
    })
    alert(`Tour request started for ${listing.address_label}`)
  }

  return (
    <PageWrapper maxWidth="max-w-5xl">
      <BrandHeader
        title={`Homes picked for ${buyer.name}`}
        subtitle="These homes represent the current best-fit recommendations based on your preferences and available behavioral signals."
      />

      <AnimatedSection delay={0.08}>
        <div className={`mt-6 rounded-[32px] p-6 md:p-8 ${isDark ? 'surface-dark' : 'surface-light'}`}>
          <div className="flex items-center gap-2">
            <Sparkles size={18} />
            <h2 className="text-xl font-semibold">Recommendation profile</h2>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {buyer.must_have_features.map((feature) => (
              <span
                key={feature}
                className={`rounded-full px-3 py-1 text-xs font-medium ${isDark ? 'badge-dark' : 'badge-light'}`}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <div className="mt-6 space-y-5">
        {recommendations.map((listing, index) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className={`rounded-[30px] p-6 ${isDark ? 'surface-dark' : 'surface-light'}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">{listing.address_label}</h2>
                <p className={`mt-1 text-sm ${isDark ? 'muted-dark' : 'muted-light'}`}>
                  {listing.city} • {listing.neighborhood}
                </p>
              </div>

              <div className={`rounded-full px-4 py-2 text-sm font-semibold ${isDark ? 'primary-btn-dark' : 'primary-btn-light'}`}>
                Match {listing.fitScore}
              </div>
            </div>

            <p className="mt-4 text-sm">
              {listing.bedrooms} bd • {listing.bathrooms} ba • {listing.sqft} sqft
            </p>

            <p className={`mt-3 text-sm leading-7 ${isDark ? 'muted-dark' : 'muted-light'}`}>
              {listing.description}
            </p>

            <div className={`mt-4 rounded-2xl p-4 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
              <p className="text-sm font-semibold">Why this was picked</p>
              <p className={`mt-2 text-sm leading-6 ${isDark ? 'muted-dark' : 'muted-light'}`}>
                {listing.explanation}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {listing.tags.map((tag) => (
                <span
                  key={tag}
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${isDark ? 'badge-dark' : 'badge-light'}`}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xl font-semibold">${listing.price.toLocaleString()}</p>

              <div className="flex gap-3">
                <button
                  type="button"
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                    isDark ? 'secondary-btn-dark' : 'secondary-btn-light'
                  }`}
                  onClick={() => handleInterested(listing)}
                >
                  <span className="flex items-center gap-2">
                    <Heart size={16} />
                    Interested
                  </span>
                </button>

                <button
                  type="button"
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                    isDark ? 'primary-btn-dark' : 'primary-btn-light'
                  }`}
                  onClick={() => handleTour(listing)}
                >
                  <span className="flex items-center gap-2">
                    <CalendarDays size={16} />
                    Book Tour
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          to={`/buyer/${buyer.id}/home`}
          className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
            isDark ? 'secondary-btn-dark' : 'secondary-btn-light'
          }`}
        >
          Back to Buyer Home
        </Link>
      </div>

      <AppFooter />
    </PageWrapper>
  )
}