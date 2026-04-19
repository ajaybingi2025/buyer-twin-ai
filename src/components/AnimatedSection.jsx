import { motion } from 'framer-motion'

export default function AnimatedSection({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      {children}
    </motion.div>
  )
}