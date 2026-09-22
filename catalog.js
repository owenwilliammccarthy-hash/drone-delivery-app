// Mock catalog data. Swap this for real API calls when wiring up a backend.

export const STORES = [
  {
    id: 'harbor-kitchen',
    name: 'Harbor Kitchen',
    kind: 'restaurant',
    tagline: 'Coastal comfort food',
    prepTime: '12–18 min',
    zone: 'drone', // eligible for drone delivery
    items: [
      { id: 'hk-1', name: 'Grilled shrimp bowl', price: 14.5 },
      { id: 'hk-2', name: 'Blackened fish tacos (3)', price: 12.0 },
      { id: 'hk-3', name: 'Charred corn salad', price: 7.5 },
      { id: 'hk-4', name: 'Sweet tea, large', price: 3.0 },
    ],
  },
  {
    id: 'lowcountry-pharmacy',
    name: 'Lowcountry Pharmacy',
    kind: 'pharmacy',
    tagline: 'Prescriptions & essentials',
    prepTime: '5–10 min',
    zone: 'drone',
    items: [
      { id: 'lp-1', name: 'Prescription pickup', price: 0, requiresId: true },
      { id: 'lp-2', name: 'Allergy relief, 24ct', price: 11.25 },
      { id: 'lp-3', name: 'Digital thermometer', price: 9.0 },
      { id: 'lp-4', name: 'Electrolyte packs (6)', price: 6.75 },
    ],
  },
  {
    id: 'basil-and-bone',
    name: 'Basil & Bone',
    kind: 'restaurant',
    tagline: 'Wood-fired, always fresh',
    prepTime: '18–25 min',
    zone: 'standard', // outside current drone corridor
    items: [
      { id: 'bb-1', name: 'Margherita, 12"', price: 15.0 },
      { id: 'bb-2', name: 'Roasted garlic knots', price: 6.0 },
      { id: 'bb-3', name: 'House side salad', price: 6.5 },
    ],
  },
]

export function findStore(storeId) {
  return STORES.find((s) => s.id === storeId) ?? null
}
