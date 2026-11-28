export const CATEGORY_IMAGES = {
  TRACTOR:
    'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=900&q=80',
  HARVESTER:
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80',
  SEEDER:
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80',
  SPRAYER:
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=900&q=80',
  BALER:
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80',
  PLOW:
    'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=900&q=80',
  TRAILER:
    'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=900&q=80',
  OTHER:
    'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=900&q=80',
}

export const CATEGORY_LABELS = {
  TRACTOR: 'Tractor',
  HARVESTER: 'Combine',
  SEEDER: 'Seed drill',
  SPRAYER: 'Sprayer',
  BALER: 'Baler',
  PLOW: 'Tractor + plough',
  TRAILER: 'Trailer',
  OTHER: 'Machine',
}

export function getEquipmentImage(eq) {
  if (eq?.imageUrl) return eq.imageUrl
  return CATEGORY_IMAGES[eq?.category] || CATEGORY_IMAGES.TRACTOR
}

export const SHOWCASE_EQUIPMENTS = [
  {
    id: 1,
    name: 'John Deere 6R 155',
    category: 'TRACTOR',
    pricePerDay: 280,
    isAvailable: true,
    status: 'OPERATIONAL',
    horsePower: 155,
    year: 2022,
    location: 'Lucé · 6 km away',
    specs: ['155 HP', 'GPS AutoTrac', '2022'],
    ownerName: 'Pierre Martin',
    ownerInitials: 'PM',
    rating: 4.9,
    rentalsCount: 65,
    instantBook: true,
    availabilityNote: 'Available your dates',
    imageUrl:
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Claas Lexion 760',
    category: 'HARVESTER',
    pricePerDay: 1150,
    isAvailable: true,
    status: 'OPERATIONAL',
    horsePower: 435,
    year: 2021,
    location: 'Bonneval · 28 km away',
    specs: ['7.5 m header', 'Operator incl.', '2021'],
    ownerName: 'SARL Beauce Agri',
    ownerInitials: 'BA',
    rating: 4.8,
    rentalsCount: 214,
    instantBook: false,
    availabilityNote: 'Only 2 slots left in June',
    imageUrl:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Kuhn Espro 3000',
    category: 'SEEDER',
    pricePerDay: 165,
    isAvailable: true,
    status: 'OPERATIONAL',
    horsePower: 120,
    year: 2023,
    location: 'Mainvilliers · 9 km away',
    specs: ['3 m width', 'Min. 120 HP', '2023'],
    ownerName: 'Lucie Bernard',
    ownerInitials: 'LB',
    rating: 4.9,
    rentalsCount: 41,
    instantBook: true,
    availabilityNote: 'Available your dates',
    imageUrl:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Amazone UX 5201',
    category: 'SPRAYER',
    pricePerDay: 240,
    isAvailable: true,
    status: 'OPERATIONAL',
    horsePower: 140,
    year: 2020,
    location: 'Illiers-Combray · 22 km away',
    specs: ['5,200 L tank', '36 m boom', '2020'],
    ownerName: 'Karim Haddad',
    ownerInitials: 'KH',
    rating: 4.7,
    rentalsCount: 93,
    instantBook: false,
    availabilityNote: 'Available your dates',
    imageUrl:
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: 'New Holland BigBaler 1290',
    category: 'BALER',
    pricePerDay: 390,
    isAvailable: true,
    status: 'OPERATIONAL',
    horsePower: 180,
    year: 2021,
    location: 'Nogent-le-Rotrou · 38 km away',
    specs: ['120×90 bales', 'Bale weighing', '2021'],
    ownerName: 'CUMA du Perche',
    ownerInitials: 'CP',
    rating: 4.8,
    rentalsCount: 172,
    instantBook: false,
    availabilityNote: 'Booked 12–13 Jun · free from 14',
    imageUrl:
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    name: 'Fendt 724 Vario + Lemken',
    category: 'PLOW',
    pricePerDay: 310,
    isAvailable: true,
    status: 'OPERATIONAL',
    horsePower: 240,
    year: 2019,
    location: 'Courville-sur-Eure · 18 km away',
    specs: ['240 HP', '5 furrows', '2019'],
    ownerName: 'Antoine Leroy',
    ownerInitials: 'AL',
    rating: 4.6,
    rentalsCount: 29,
    instantBook: false,
    availabilityNote: 'Available your dates',
    imageUrl:
      'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=900&q=80',
  },
]
