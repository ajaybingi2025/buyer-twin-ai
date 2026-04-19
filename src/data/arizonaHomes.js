export const arizonaHomes = [
  {
    id: 'az_home_001',
    title: 'Desert Ridge Family Home',
    city: 'Phoenix',
    neighborhood: 'Desert Ridge',
    price: 465000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1820,
    type: 'House',
    image:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
    description:
      'Well-kept family home with open living area, backyard space, and quick freeway access.',
    tags: ['family', 'backyard', 'value'],
  },
  {
    id: 'az_home_002',
    title: 'Scottsdale Move-In Ready Home',
    city: 'Scottsdale',
    neighborhood: 'Desert View',
    price: 615000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2520,
    type: 'House',
    image:
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    description:
      'Modern larger home in a premium area with spacious interiors and strong school access nearby.',
    tags: ['move-in ready', 'schools', 'family'],
  },
  {
    id: 'az_home_003',
    title: 'Tempe Starter Townhome',
    city: 'Tempe',
    neighborhood: 'Maple District',
    price: 349000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1280,
    type: 'Townhome',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    description:
      'Affordable starter option with practical layout and easy access to commute routes.',
    tags: ['starter', 'commute', 'value'],
  },
  {
    id: 'az_home_004',
    title: 'Mesa Backyard Home',
    city: 'Mesa',
    neighborhood: 'Cedar Park',
    price: 398000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1710,
    type: 'House',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    description:
      'Comfortable home with outdoor space, practical layout, and family-friendly feel.',
    tags: ['backyard', 'family', 'value'],
  },
  {
    id: 'az_home_005',
    title: 'Chandler School District Home',
    city: 'Chandler',
    neighborhood: 'Willow Estates',
    price: 585000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2430,
    type: 'House',
    image:
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    description:
      'Larger home with flexible family space and strong fit for buyers focused on schools.',
    tags: ['schools', 'family', 'tour-ready'],
  },
  {
    id: 'az_home_006',
    title: 'Phoenix Updated Commute Home',
    city: 'Phoenix',
    neighborhood: 'Skyline Village',
    price: 372000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1480,
    type: 'House',
    image:
      'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80',
    description:
      'Updated interior with strong commute convenience and a smart first-home feel.',
    tags: ['updated', 'commute', 'modern'],
  },
  {
    id: 'az_home_007',
    title: 'Gilbert Family Space Home',
    city: 'Gilbert',
    neighborhood: 'Lakeside Ranch',
    price: 525000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2290,
    type: 'House',
    image:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
    description:
      'Spacious suburban home with family layout, extra room, and clean finishes.',
    tags: ['family', 'space', 'suburban'],
  },
  {
    id: 'az_home_008',
    title: 'Scottsdale Premium Condo',
    city: 'Scottsdale',
    neighborhood: 'Old Town Edge',
    price: 435000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1180,
    type: 'Condo',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    description:
      'Clean low-maintenance condo option with stylish interior and central location.',
    tags: ['modern', 'low maintenance', 'location'],
  },
]

export const arizonaCities = [
  'All',
  'Phoenix',
  'Scottsdale',
  'Tempe',
  'Mesa',
  'Chandler',
  'Gilbert',
]

export function formatPrice(price) {
  return `$${price.toLocaleString()}`
}