import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { buyers, getRankedListingsForBuyer } from '../data/mockData'
import ListingCard from '../components/ListingCard'
import PageWrapper from '../components/PageWrapper'
import { useTheme } from '../components/ThemeContext'

export default function ListingsPage() {
  const { id } = useParams()
  const { isDark } = useTheme()
  const buyer = buyers.find((b) => b.id === id)

  if (!buyer) return <div className="p-10 text-xl">Buyer not found.</div>

  const rankedListings = getRankedListingsForBuyer(buyer).slice(0, 5)

  return (
    <PageWrapper maxWidth="max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Listings Match Page</h1>
          <p className={`mt-1 text-sm ${isDark ? 'muted-dark' : 'muted-light'}`}>
            Top recommended homes for {buyer.name}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to={`/buyer/${buyer.id}/recommendations-preview`}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
              isDark ? 'primary-btn-dark' : 'primary-btn-light'
            }`}
          >
            Open Buyer View
          </Link>

          <Link
            to={`/buyer/${buyer.id}`}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
              isDark ? 'secondary-btn-dark' : 'secondary-btn-light'
            }`}
          >
            Back to Buyer
          </Link>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {rankedListings.map((listing, index) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ListingCard listing={listing} />
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  )
}