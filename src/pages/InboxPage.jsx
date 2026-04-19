import {
  buyers,
  formatBudget,
  getReadinessLabel,
  getUrgencyLabel,
  getPrimaryDriver,
} from '../data/mockData'
import BuyerCard from '../components/BuyerCard'
import PageWrapper from '../components/PageWrapper'
import { useTheme } from '../components/ThemeContext'

export default function InboxPage() {
  const { isDark } = useTheme()

  const buyerCards = buyers.map((buyer) => ({
    id: buyer.id,
    name: buyer.name,
    budget: formatBudget(buyer.budget_min, buyer.budget_max),
    readiness: getReadinessLabel(buyer.id),
    urgency: getUrgencyLabel(buyer),
    primaryDriver: getPrimaryDriver(buyer),
    nextAction:
      getReadinessLabel(buyer.id) === 'Tour Ready'
        ? 'Schedule a tour for top matching homes'
        : 'Send best-fit listings and follow up',
  }))

  return (
    <PageWrapper maxWidth="max-w-6xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={`text-sm font-medium uppercase tracking-[0.2em] ${isDark ? 'muted-dark' : 'muted-light'}`}>
            BuyerTwin AI
          </p>
          <h1 className="mt-2 text-3xl font-bold">Buyer Inbox</h1>
          <p className={`mt-2 text-sm ${isDark ? 'muted-dark' : 'muted-light'}`}>
            Active buyers, readiness stage, urgency, and next best action.
          </p>
        </div>

        <div className={`rounded-3xl px-4 py-3 ${isDark ? 'surface-dark' : 'surface-light'}`}>
          <p className={`text-xs uppercase tracking-wide ${isDark ? 'muted-dark' : 'muted-light'}`}>Active Buyers</p>
          <p className="mt-1 text-2xl font-semibold">{buyerCards.length}</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {buyerCards.map((buyer) => (
          <BuyerCard key={buyer.id} buyer={buyer} />
        ))}
      </div>
    </PageWrapper>
  )
}