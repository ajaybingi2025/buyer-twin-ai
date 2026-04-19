import { BedDouble, Bath, House, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from './ThemeContext'

export default function ListingCard({ listing }) {
  const { isDark } = useTheme()

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`rounded-3xl p-5 ${isDark ? 'surface-dark' : 'surface-light'}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{listing.address_label}</h3>
          <div className={`mt-1 flex items-center gap-2 text-sm ${isDark ? 'muted-dark' : 'muted-light'}`}>
            <MapPin size={16} />
            <span>
              {listing.city} • {listing.neighborhood}
            </span>
          </div>
        </div>

        <div className={`rounded-full px-3 py-1 text-sm font-semibold ${isDark ? 'primary-btn-dark' : 'primary-btn-light'}`}>
          {listing.fitScore}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <BedDouble size={16} />
          <span>{listing.bedrooms} bd</span>
        </div>
        <div className="flex items-center gap-2">
          <Bath size={16} />
          <span>{listing.bathrooms} ba</span>
        </div>
        <div className="flex items-center gap-2">
          <House size={16} />
          <span>{listing.sqft} sqft</span>
        </div>
      </div>

      <p className={`mt-3 text-sm leading-6 ${isDark ? 'muted-dark' : 'muted-light'}`}>
        {listing.description}
      </p>

      <div className="mt-3 rounded-2xl bg-black/5 p-3 dark:bg-white/5">
        <span className="font-semibold">Why it fits:</span> {listing.explanation}
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

      <p className="mt-4 text-lg font-semibold">${listing.price.toLocaleString()}</p>
    </motion.div>
  )
}