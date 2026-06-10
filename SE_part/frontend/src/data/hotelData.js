export const roomPhotos = [
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
];

export const rooms = [
  {
    id: 1,
    type: 'Deluxe Garden Suite',
    price: 145,
    image: roomPhotos[0],
    features: ['King bed', 'Private balcony', 'Garden view', 'Breakfast included'],
  },
  {
    id: 2,
    type: 'Premium Ocean Room',
    price: 180,
    image: roomPhotos[1],
    features: ['Queen bed', 'Ocean view', 'Smart TV', 'Rain shower'],
  },
  {
    id: 3,
    type: 'Family Villa Suite',
    price: 240,
    image: roomPhotos[2],
    features: ['Two bedrooms', 'Lounge area', 'Mini pantry', 'Four guests'],
  },
  {
    id: 4,
    type: 'Executive Honeymoon Suite',
    price: 295,
    image: roomPhotos[3],
    features: ['Jacuzzi bath', 'Private dining', 'Late checkout', 'Welcome drink'],
  },
];

export const testimonials = [
  {
    name: 'Amaya Fernando',
    text: 'The room was spotless, calm, and beautifully designed. The team handled every detail before we even asked.',
    rating: 5,
  },
  {
    name: 'Daniel Perera',
    text: 'Elegant rooms, quick service, and a very smooth booking experience. It felt like a boutique resort.',
    rating: 5,
  },
  {
    name: 'Nethmi Silva',
    text: 'The review system made us feel heard. Staff followed up quickly and the stay was peaceful.',
    rating: 5,
  },
];

export const bookings = [
  { id: 'BK-1024', customer: 'Amaya Fernando', room: 'Deluxe Garden Suite', checkIn: '2026-06-12', checkOut: '2026-06-15', guests: 2, status: 'Pending' },
  { id: 'BK-1025', customer: 'Daniel Perera', room: 'Premium Ocean Room', checkIn: '2026-06-18', checkOut: '2026-06-21', guests: 2, status: 'Approved' },
  { id: 'BK-1026', customer: 'Nethmi Silva', room: 'Family Villa Suite', checkIn: '2026-06-22', checkOut: '2026-06-25', guests: 4, status: 'Rejected' },
];

export const reviews = [
  {
    id: 'RV-201',
    customer: 'Amaya Fernando',
    review: 'The suite was beautiful and the staff were thoughtful throughout our stay.',
    sentiment: 'Positive',
    category: 'Room',
    cluster: 'Comfort and cleanliness',
    recommendation: 'Feature this review on room detail pages.',
    status: 'Approved',
  },
  {
    id: 'RV-202',
    customer: 'Daniel Perera',
    review: 'Breakfast service was delayed, but the front desk resolved it politely.',
    sentiment: 'Neutral',
    category: 'Dining',
    cluster: 'Service timing',
    recommendation: 'Review breakfast staffing during peak hours.',
    status: 'Pending',
  },
  {
    id: 'RV-203',
    customer: 'Nethmi Silva',
    review: 'The AC was noisy at night and disturbed our sleep.',
    sentiment: 'Negative',
    category: 'Facilities',
    cluster: 'Room maintenance',
    recommendation: 'Schedule AC maintenance for the affected room.',
    status: 'Pending',
  },
];

export const customers = [
  { id: 'CU-501', name: 'Amaya Fernando', email: 'amaya@example.com', bookings: 3, status: 'Active' },
  { id: 'CU-502', name: 'Daniel Perera', email: 'daniel@example.com', bookings: 1, status: 'Active' },
  { id: 'CU-503', name: 'Nethmi Silva', email: 'nethmi@example.com', bookings: 2, status: 'VIP' },
];
