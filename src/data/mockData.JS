export const buyers = [
  {
    id: 'buyer_001',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '555-111-2222',
    budget_min: 350000,
    budget_max: 450000,
    desired_locations: ['Tempe', 'Mesa'],
    timeline: '2-3 months',
    must_have_features: ['3 bedrooms', 'good schools', 'backyard'],
    inquiry_text:
      'We are looking for a family-friendly home with good schools and a backyard.',
    created_at: '2026-04-18T10:00:00Z',
  },
  {
    id: 'buyer_002',
    name: 'David Lee',
    email: 'david@example.com',
    phone: '555-333-4444',
    budget_min: 280000,
    budget_max: 380000,
    desired_locations: ['Phoenix'],
    timeline: '1 month',
    must_have_features: ['close commute', 'modern kitchen'],
    inquiry_text:
      'I want a first home with a reasonable commute and updated interiors.',
    created_at: '2026-04-18T10:05:00Z',
  },
  {
    id: 'buyer_003',
    name: 'Priya Patel',
    email: 'priya@example.com',
    phone: '555-555-6666',
    budget_min: 500000,
    budget_max: 650000,
    desired_locations: ['Scottsdale', 'Chandler'],
    timeline: 'ASAP',
    must_have_features: ['top school district', '4 bedrooms', 'tour soon'],
    inquiry_text:
      'We want a move-in ready home in a top school district and would like to tour soon.',
    created_at: '2026-04-18T10:10:00Z',
  },
  {
    id: 'buyer_004',
    name: 'Narahari Kommi',
    email: 'nkommi@asu.edu',
    phone: '555-777-1111',
    budget_min: 320000,
    budget_max: 430000,
    desired_locations: ['Tempe', 'Phoenix'],
    timeline: '1-2 months',
    must_have_features: ['close commute', 'updated interiors', 'value'],
    inquiry_text:
      'Looking for a practical home near commute routes with updated interiors and good value.',
    created_at: '2026-04-18T10:15:00Z',
  },
  {
    id: 'buyer_005',
    name: 'Ajay Bingi',
    email: 'abingi1@asu.edu',
    phone: '555-777-2222',
    budget_min: 360000,
    budget_max: 480000,
    desired_locations: ['Mesa', 'Tempe'],
    timeline: '2 months',
    must_have_features: ['3 bedrooms', 'backyard', 'family-friendly'],
    inquiry_text:
      'Need a comfortable 3-bedroom home with backyard space in a family-friendly area.',
    created_at: '2026-04-18T10:20:00Z',
  },
  {
    id: 'buyer_006',
    name: 'Anvitha Nagireddy',
    email: 'anagire3@asu.edu',
    phone: '555-777-3333',
    budget_min: 520000,
    budget_max: 680000,
    desired_locations: ['Scottsdale', 'Chandler'],
    timeline: 'ASAP',
    must_have_features: ['top school district', '4 bedrooms', 'move-in ready'],
    inquiry_text:
      'Searching for a move-in ready larger home in a top school district and ready to tour soon.',
    created_at: '2026-04-18T10:25:00Z',
  },
]

export const events = [
  {
    id: 'event_001',
    buyer_id: 'buyer_001',
    listing_id: 'listing_001',
    event_type: 'listing_viewed',
    timestamp: '2026-04-18T11:00:00Z',
    duration_seconds: 95,
    source_channel: 'email',
    metadata: { note: 'Viewed family listing carefully' },
  },
  {
    id: 'event_002',
    buyer_id: 'buyer_001',
    listing_id: 'listing_001',
    event_type: 'listing_saved',
    timestamp: '2026-04-18T11:08:00Z',
    duration_seconds: 40,
    source_channel: 'email',
    metadata: { note: 'Saved school-focused listing' },
  },
  {
    id: 'event_003',
    buyer_id: 'buyer_001',
    listing_id: 'listing_002',
    event_type: 'listing_skipped',
    timestamp: '2026-04-18T11:15:00Z',
    duration_seconds: 12,
    source_channel: 'sms',
    metadata: { note: 'Skipped commute-focused home' },
  },
  {
    id: 'event_004',
    buyer_id: 'buyer_002',
    listing_id: 'listing_002',
    event_type: 'listing_viewed',
    timestamp: '2026-04-18T11:10:00Z',
    duration_seconds: 70,
    source_channel: 'sms',
    metadata: { note: 'Viewed commute-friendly starter home' },
  },
  {
    id: 'event_005',
    buyer_id: 'buyer_002',
    listing_id: 'listing_002',
    event_type: 'message_clicked',
    timestamp: '2026-04-18T11:17:00Z',
    duration_seconds: 15,
    source_channel: 'sms',
    metadata: { note: 'Clicked listing from text message' },
  },
  {
    id: 'event_006',
    buyer_id: 'buyer_002',
    listing_id: 'listing_002',
    event_type: 'listing_saved',
    timestamp: '2026-04-18T11:20:00Z',
    duration_seconds: 35,
    source_channel: 'sms',
    metadata: { note: 'Saved modern starter home' },
  },
  {
    id: 'event_007',
    buyer_id: 'buyer_003',
    listing_id: 'listing_003',
    event_type: 'listing_viewed',
    timestamp: '2026-04-18T11:05:00Z',
    duration_seconds: 110,
    source_channel: 'email',
    metadata: { note: 'Spent long time on school district details' },
  },
  {
    id: 'event_008',
    buyer_id: 'buyer_003',
    listing_id: 'listing_003',
    event_type: 'listing_saved',
    timestamp: '2026-04-18T11:12:00Z',
    duration_seconds: 30,
    source_channel: 'email',
    metadata: { note: 'Saved high school score home' },
  },
  {
    id: 'event_009',
    buyer_id: 'buyer_003',
    listing_id: 'listing_003',
    event_type: 'message_replied',
    timestamp: '2026-04-18T11:20:00Z',
    duration_seconds: 20,
    source_channel: 'email',
    metadata: { note: 'Asked about touring this weekend' },
  },
  {
    id: 'event_010',
    buyer_id: 'buyer_004',
    listing_id: 'listing_005',
    event_type: 'listing_viewed',
    timestamp: '2026-04-18T11:25:00Z',
    duration_seconds: 80,
    source_channel: 'email',
    metadata: { note: 'Viewed updated commute-friendly listing' },
  },
  {
    id: 'event_011',
    buyer_id: 'buyer_004',
    listing_id: 'listing_005',
    event_type: 'listing_saved',
    timestamp: '2026-04-18T11:30:00Z',
    duration_seconds: 25,
    source_channel: 'email',
    metadata: { note: 'Saved value commute listing' },
  },
  {
    id: 'event_012',
    buyer_id: 'buyer_005',
    listing_id: 'listing_004',
    event_type: 'listing_viewed',
    timestamp: '2026-04-18T11:35:00Z',
    duration_seconds: 90,
    source_channel: 'sms',
    metadata: { note: 'Viewed backyard family home' },
  },
  {
    id: 'event_013',
    buyer_id: 'buyer_005',
    listing_id: 'listing_004',
    event_type: 'listing_saved',
    timestamp: '2026-04-18T11:40:00Z',
    duration_seconds: 30,
    source_channel: 'sms',
    metadata: { note: 'Saved family home in Mesa' },
  },
  {
    id: 'event_014',
    buyer_id: 'buyer_006',
    listing_id: 'listing_006',
    event_type: 'listing_viewed',
    timestamp: '2026-04-18T11:45:00Z',
    duration_seconds: 100,
    source_channel: 'email',
    metadata: { note: 'Viewed larger home in strong school district' },
  },
  {
    id: 'event_015',
    buyer_id: 'buyer_006',
    listing_id: 'listing_006',
    event_type: 'message_replied',
    timestamp: '2026-04-18T11:50:00Z',
    duration_seconds: 20,
    source_channel: 'email',
    metadata: { note: 'Asked for earliest tour availability' },
  },
]

export const listings = [
  {
    id: 'listing_001',
    address_label: '123 Maple Ave',
    city: 'Tempe',
    price: 420000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1850,
    neighborhood: 'Maple Grove',
    school_score: 9,
    commute_score: 7,
    tags: ['family', 'backyard', 'schools'],
    description: 'Family-friendly home near parks and top-rated schools.',
    image_url: null,
  },
  {
    id: 'listing_002',
    address_label: '456 Oak Street',
    city: 'Phoenix',
    price: 340000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1300,
    neighborhood: 'Central Phoenix',
    school_score: 6,
    commute_score: 9,
    tags: ['commute', 'modern', 'starter'],
    description: 'Modern starter home with quick freeway access.',
    image_url: null,
  },
  {
    id: 'listing_003',
    address_label: '789 Desert Lane',
    city: 'Scottsdale',
    price: 615000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2600,
    neighborhood: 'Desert Ridge',
    school_score: 10,
    commute_score: 8,
    tags: ['schools', 'move-in ready', 'family'],
    description: 'Spacious move-in ready home in a premium school district.',
    image_url: null,
  },
  {
    id: 'listing_004',
    address_label: '321 Cedar Court',
    city: 'Mesa',
    price: 395000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1750,
    neighborhood: 'Cedar Park',
    school_score: 8,
    commute_score: 6,
    tags: ['family', 'backyard', 'value'],
    description: 'Comfortable family home with outdoor space and solid schools.',
    image_url: null,
  },
  {
    id: 'listing_005',
    address_label: '654 Skyline Dr',
    city: 'Phoenix',
    price: 365000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1450,
    neighborhood: 'Skyline Village',
    school_score: 7,
    commute_score: 10,
    tags: ['commute', 'updated', 'value'],
    description: 'Updated home with excellent commute access and practical layout.',
    image_url: null,
  },
  {
    id: 'listing_006',
    address_label: '987 Willow Bend',
    city: 'Chandler',
    price: 590000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2450,
    neighborhood: 'Willow Estates',
    school_score: 9,
    commute_score: 7,
    tags: ['schools', 'family', 'tour-ready'],
    description:
      'Well-kept larger home in a strong school area with flexible family space.',
    image_url: null,
  },
]

export function formatBudget(min, max) {
  const format = (value) => `$${Math.round(value / 1000)}k`
  return `${format(min)} - ${format(max)}`
}

export function getBuyerEvents(buyerId) {
  return events.filter((event) => event.buyer_id === buyerId)
}

export function getListingById(listingId) {
  return listings.find((listing) => listing.id === listingId)
}

export function getReadinessLabel(buyerId) {
  const buyerEvents = getBuyerEvents(buyerId)
  const hasReply = buyerEvents.some((event) => event.event_type === 'message_replied')
  const saveCount = buyerEvents.filter((event) => event.event_type === 'listing_saved').length
  const buyer = buyers.find((b) => b.id === buyerId)

  if (hasReply || buyer?.timeline === 'ASAP') return 'Tour Ready'
  if (saveCount >= 1) return 'Active Consideration'
  return 'Research Mode'
}

export function getUrgencyLabel(buyer) {
  if (buyer.timeline === 'ASAP') return 'High'
  if (buyer.timeline === '1 month') return 'Medium'
  if (buyer.timeline === '1-2 months') return 'Medium'
  return 'Medium'
}

export function getPrimaryDriver(buyer) {
  const features = buyer.must_have_features.join(' ').toLowerCase()
  const locations = buyer.desired_locations.join(' ').toLowerCase()

  if (features.includes('school')) return 'School Quality'
  if (features.includes('commute')) return 'Commute'
  if (features.includes('modern') || features.includes('updated')) return 'Modern Interior'
  if (features.includes('family') || features.includes('backyard')) return 'Family Space'
  if (locations.includes('scottsdale') || locations.includes('chandler')) return 'Family Space'
  return 'Value'
}

export function getConfidenceScore(buyerId) {
  const buyerEvents = getBuyerEvents(buyerId)
  if (buyerEvents.length >= 3) return 88
  if (buyerEvents.length === 2) return 76
  return 65
}

export function getTwinSummary(buyer) {
  const driver = getPrimaryDriver(buyer)
  const readiness = getReadinessLabel(buyer.id)

  return `${buyer.name} appears most motivated by ${driver.toLowerCase()}. Current behavior suggests ${readiness.toLowerCase()} with strongest interest around ${buyer.must_have_features.join(', ')}.`
}

export function mapEventType(eventType) {
  if (eventType === 'listing_viewed') return 'Viewed'
  if (eventType === 'listing_saved') return 'Saved'
  if (eventType === 'listing_skipped') return 'Skipped'
  if (eventType === 'message_clicked') return 'Clicked'
  if (eventType === 'message_replied') return 'Replied'
  return eventType
}

export function getMatchReason(buyer, listing) {
  const reasons = []

  if (buyer.desired_locations.includes(listing.city)) reasons.push(`matches desired location in ${listing.city}`)
  if (listing.price >= buyer.budget_min && listing.price <= buyer.budget_max) reasons.push('fits budget range')

  if (buyer.must_have_features.some((f) => f.toLowerCase().includes('school')) && listing.school_score >= 8) {
    reasons.push('strong school score')
  }

  if (buyer.must_have_features.some((f) => f.toLowerCase().includes('backyard')) && listing.tags.includes('backyard')) {
    reasons.push('includes backyard-focused fit')
  }

  if (buyer.must_have_features.some((f) => f.toLowerCase().includes('commute')) && listing.commute_score >= 8) {
    reasons.push('good commute alignment')
  }

  if (
    buyer.must_have_features.some((f) => f.toLowerCase().includes('modern') || f.toLowerCase().includes('updated')) &&
    (listing.tags.includes('modern') || listing.tags.includes('updated'))
  ) {
    reasons.push('updated interior fit')
  }

  if (
    buyer.must_have_features.some((f) => f.toLowerCase().includes('4 bedroom')) &&
    listing.bedrooms >= 4
  ) {
    reasons.push('meets larger bedroom need')
  }

  return reasons.length ? reasons.slice(0, 3).join(', ') : 'general fit based on buyer profile'
}

export function getFitScore(buyer, listing) {
  let score = 0

  if (buyer.desired_locations.includes(listing.city)) score += 25
  if (listing.price >= buyer.budget_min && listing.price <= buyer.budget_max) score += 25

  if (buyer.must_have_features.some((f) => f.toLowerCase().includes('school'))) score += listing.school_score * 3
  if (buyer.must_have_features.some((f) => f.toLowerCase().includes('commute'))) score += listing.commute_score * 3

  if (buyer.must_have_features.some((f) => f.toLowerCase().includes('backyard')) && listing.tags.includes('backyard')) score += 10
  if (
    buyer.must_have_features.some((f) => f.toLowerCase().includes('modern') || f.toLowerCase().includes('updated')) &&
    (listing.tags.includes('modern') || listing.tags.includes('updated'))
  ) score += 10
  if (buyer.must_have_features.some((f) => f.toLowerCase().includes('4 bedroom')) && listing.bedrooms >= 4) score += 10

  return Math.min(score, 99)
}

export function getRankedListingsForBuyer(buyer) {
  return listings
    .map((listing) => ({
      ...listing,
      fitScore: getFitScore(buyer, listing),
      explanation: getMatchReason(buyer, listing),
    }))
    .sort((a, b) => b.fitScore - a.fitScore)
}

export function getTopListingForBuyer(buyer) {
  return getRankedListingsForBuyer(buyer)[0]
}

export function generateSmsDraft(buyer, listing) {
  return `Hi ${buyer.name.split(' ')[0]}, I found a home that aligns well with what you’re looking for—especially ${getPrimaryDriver(buyer).toLowerCase()}. ${listing.address_label} in ${listing.city} stands out as a strong match. Want me to send details or help schedule a tour?`
}

export function generateEmailDraft(buyer, listing) {
  return {
    subject: 'A strong home match for your search',
    body: `Hi ${buyer.name},

I wanted to share a listing that looks like a strong fit for your home search.

Top match: ${listing.address_label}, ${listing.city}
Why it stands out: ${getMatchReason(buyer, listing)}
Price: $${listing.price.toLocaleString()}

This home seems to align especially well with your priorities around ${getPrimaryDriver(buyer).toLowerCase()}.

Would you like me to send more details or help set up a tour?

Best,
Your Agent`,
  }
}

export function generateCallScript(buyer, listing) {
  return `Hi ${buyer.name}, I wanted to quickly reach out because I found a home that seems to match what matters most to you, especially ${getPrimaryDriver(buyer).toLowerCase()}. The home is ${listing.address_label} in ${listing.city}, and it stands out because it ${getMatchReason(buyer, listing)}. I’d love to walk you through it and see if you’d like to tour it.`
}