import { Link, useParams } from 'react-router-dom'
import {
  buyers,
  formatBudget,
  getBuyerEvents,
  getReadinessLabel,
  getUrgencyLabel,
  getPrimaryDriver,
  getConfidenceScore,
  getTwinSummary,
  mapEventType,
  getListingById,
} from '../data/mockData'
import StatCard from '../components/StatCard'
import TimelineItem from '../components/TimelineItem'
import ScoreBar from '../components/ScoreBar'

export default function BuyerDetailPage() {
  const { id } = useParams()
  const buyer = buyers.find((b) => b.id === id)

  if (!buyer) {
    return <div className="p-10 text-xl">Buyer not found.</div>
  }

  const buyerEvents = getBuyerEvents(buyer.id)

  const timelineEvents = buyerEvents.map((event) => {
    const listing = getListingById(event.listing_id)
    return {
      id: event.id,
      type: mapEventType(event.event_type),
      text: listing
        ? `${event.metadata?.note || event.event_type} — ${listing.address_label}, ${listing.city}`
        : event.metadata?.note || event.event_type,
      time: new Date(event.timestamp).toLocaleString(),
    }
  })

  const readiness = getReadinessLabel(buyer.id)
  const urgency = getUrgencyLabel(buyer)
  const primaryDriver = getPrimaryDriver(buyer)
  const confidence = getConfidenceScore(buyer.id)
  const twinSummary = getTwinSummary(buyer)

  const nextAction =
    readiness === 'Tour Ready'
      ? 'Schedule a tour for the top recommended homes.'
      : 'Share best-fit listings and continue follow-up.'

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{buyer.name}</h1>
            <p className="mt-1 text-sm text-slate-500">
              Buyer profile, decision twin, timeline, and next action
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to={`/buyer/${buyer.id}/listings`}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              View Listings
            </Link>

            <Link
              to={`/buyer/${buyer.id}/outreach`}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900"
            >
              Outreach Studio
            </Link>

            <Link
              to="/inbox"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900"
            >
              Back to Inbox
            </Link>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Budget"
            value={formatBudget(buyer.budget_min, buyer.budget_max)}
          />
          <StatCard label="Timeline" value={buyer.timeline} />
          <StatCard label="Primary Driver" value={primaryDriver} />
          <StatCard label="Readiness" value={readiness} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Inquiry Summary</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {buyer.inquiry_text}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Must-Have Features</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {buyer.must_have_features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Behavior Timeline</h2>
              <div className="mt-4 space-y-3">
                {timelineEvents.map((event) => (
                  <TimelineItem key={event.id} {...event} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Decision Twin</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{twinSummary}</p>
              <div className="mt-5">
                <ScoreBar value={confidence} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Next Best Action</h2>
              <p className="mt-3 text-sm text-slate-600">{nextAction}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
              <p className="mt-3 text-sm text-slate-600">{buyer.email}</p>
              <p className="mt-1 text-sm text-slate-600">{buyer.phone}</p>
              <p className="mt-3 text-sm text-slate-500">
                Urgency: <span className="font-medium text-slate-800">{urgency}</span>
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Desired locations:{' '}
                <span className="font-medium text-slate-800">
                  {buyer.desired_locations.join(', ')}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}