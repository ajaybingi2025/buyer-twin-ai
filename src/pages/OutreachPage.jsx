import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import {
  buyers,
  getTopListingForBuyer,
  generateSmsDraft,
  generateEmailDraft,
  generateCallScript,
} from '../data/mockData'

export default function OutreachPage() {
  const { id } = useParams()
  const buyer = buyers.find((b) => b.id === id)
  const [sending, setSending] = useState(false)

  if (!buyer) {
    return <div className="p-10 text-xl">Buyer not found.</div>
  }

  const topListing = getTopListingForBuyer(buyer)
  const sms = generateSmsDraft(buyer, topListing)
  const email = generateEmailDraft(buyer, topListing)
  const callScript = generateCallScript(buyer, topListing)

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard')
    } catch {
      alert('Copy failed')
    }
  }

  const sendEmailRecommendation = async () => {
    try {
      setSending(true)

      const response = await fetch('http://127.0.0.1:8000/send-recommendation-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer,
          listing: topListing,
          subject: email.subject,
          body: email.body,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to send email')
      }

      alert(`Email sent to ${buyer.email}`)
    } catch (error) {
      alert(error.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Outreach Studio</h1>
            <p className="mt-1 text-sm text-slate-500">
              Personalized drafts for {buyer.name}
            </p>
          </div>

          <Link
            to={`/buyer/${buyer.id}`}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900"
          >
            Back to Buyer
          </Link>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Top matched listing</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            {topListing.address_label} • {topListing.city}
          </h2>
          <p className="mt-2 text-sm text-slate-600">{topListing.description}</p>

          <div className="mt-4">
            <button
              onClick={sendEmailRecommendation}
              disabled={sending}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
              type="button"
            >
              {sending ? 'Sending...' : `Send Recommendation Email to ${buyer.email}`}
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <DraftCard
            title="SMS Draft"
            text={sms}
            onCopy={() => copyText(sms)}
          />

          <DraftCard
            title="Email Draft"
            text={`Subject: ${email.subject}\n\n${email.body}`}
            onCopy={() => copyText(`Subject: ${email.subject}\n\n${email.body}`)}
          />

          <DraftCard
            title="Call Script"
            text={callScript}
            onCopy={() => copyText(callScript)}
          />
        </div>
      </div>
    </div>
  )
}

function DraftCard({ title, text, onCopy }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

        <div className="flex gap-2">
          <button
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900"
            type="button"
          >
            Regenerate
          </button>

          <button
            onClick={onCopy}
            className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white"
            type="button"
          >
            Copy
          </button>
        </div>
      </div>

      <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-6 text-slate-700">
        {text}
      </pre>
    </div>
  )
}