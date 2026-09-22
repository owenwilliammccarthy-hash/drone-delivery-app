// Mock catalog data. Swap this for real API calls when wiring up a backend.

export const STORES = [
  {
    id: 'patty-lane',
    name: 'Patty Lane',
    kind: 'restaurant',
    emoji: '🍔',
    tagline: 'Smash burgers & crispy sides',
    prepTime: '8–12 min',
    zone: 'drone', // eligible for drone delivery
    items: [
      { id: 'pl-1', name: 'Cheeseburger', price: 11.5, weightKg: 0.4 },
      { id: 'pl-2', name: 'Onion Rings', price: 5.0, weightKg: 0.3 },
      { id: 'pl-3', name: 'Fries', price: 4.0, weightKg: 0.25 },
      { id: 'pl-4', name: 'Chocolate Shake', price: 6.5, weightKg: 0.5 },
    ],
  },
  {
    id: 'harbor-kitchen',
    name: 'Harbor Kitchen',
    kind: 'restaurant',
    emoji: '🍣',
    tagline: 'Sushi, bowls & coastal plates',
    prepTime: '12–18 min',
    zone: 'drone',
    items: [
      { id: 'hk-1', name: 'Sushi Platter', price: 18.0, weightKg: 0.7 },
      { id: 'hk-2', name: 'Grilled Shrimp Bowl', price: 14.5, weightKg: 0.6 },
      { id: 'hk-3', name: 'Miso Soup', price: 4.5, weightKg: 0.35 },
      { id: 'hk-4', name: 'Iced Green Tea', price: 3.0, weightKg: 0.4 },
    ],
  },
  {
    id: 'mission-pharmacy',
    name: 'Mission Pharmacy',
    kind: 'pharmacy',
    emoji: '💊',
    tagline: 'Prescriptions & essentials',
    prepTime: '5–10 min',
    zone: 'drone',
    items: [
      { id: 'mp-1', name: 'Prescription Pickup', price: 0, weightKg: 0.1, requiresId: true },
      { id: 'mp-2', name: 'Allergy Relief 24ct', price: 11.25, weightKg: 0.1 },
      { id: 'mp-3', name: 'Digital Thermometer', price: 9.0, weightKg: 0.1 },
      { id: 'mp-4', name: 'Electrolyte Packs ×6', price: 6.75, weightKg: 0.3 },
    ],
  },
  {
    id: 'basil-and-bone',
    name: 'Basil & Bone',
    kind: 'restaurant',
    emoji: '🍕',
    tagline: 'Wood-fired pizza',
    prepTime: '18–25 min',
    zone: 'standard', // outside current drone corridor
    items: [
      { id: 'bb-1', name: 'Margherita Pizza', price: 15.0, weightKg: 0.8 },
      { id: 'bb-2', name: 'Garlic Knots', price: 6.0, weightKg: 0.3 },
      { id: 'bb-3', name: 'Caesar Salad', price: 8.5, weightKg: 0.35 },
    ],
  },
]

export function findStore(storeId) {
  return STORES.find((s) => s.id === storeId) ?? null
}

// Past orders shown in the Orders tab for a fresh account.
const day = 24 * 60 * 60 * 1000
export function seedOrders(now = Date.now()) {
  return [
    { id: 'DR-8821', title: 'Margherita Pizza + Fries', weightKg: 1.1, emoji: '🍕', status: 'delivered', placedAt: now - 1 * day - 3.2 * 3600e3, etaMin: 6 },
    { id: 'DR-8819', title: 'Sushi Platter × 2', weightKg: 1.4, emoji: '🍣', status: 'delivered', placedAt: now - 2 * day - 1.1 * 3600e3, etaMin: 7 },
    { id: 'DR-8814', title: 'Pad Thai + Spring Rolls', weightKg: 0.8, emoji: '🍜', status: 'delivered', placedAt: now - 3 * day - 5.5 * 3600e3, etaMin: 5 },
    { id: 'DR-8801', title: 'Caesar Salad + Soup', weightKg: 0.7, emoji: '🥗', status: 'cancelled', placedAt: now - 4 * day - 2.7 * 3600e3 },
  ]
}

export const SAVED_LOCATIONS = [
  { id: 'home', label: 'Home', emoji: '🏠', address: '2847 Market St, San Francisco' },
  { id: 'office', label: 'Office', emoji: '🏢', address: '450 Mission St, Floor 12' },
]
