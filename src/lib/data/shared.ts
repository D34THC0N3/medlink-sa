/* Shared mock data used across multiple roles / pages */

export const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "zu", label: "isiZulu", native: "isiZulu" },
  { code: "af", label: "Afrikaans", native: "Afrikaans" },
  { code: "st", label: "Sesotho", native: "Sesotho" },
];

/* ---------- Medicines with prices across pharmacies ---------- */
export type Medicine = {
  id: string;
  name: string;
  generic: string;
  form: string;
  strength: string;
  pack: string;
  schedule: number; // 0-6 SA medicine scheduling
  requiresPrescription: boolean;
  category: string;
  prices: Array<{
    pharmacy: string;
    price: number;
    inStock: boolean;
    delivery: boolean;
    distanceKm: number;
  }>;
};

export const MEDICINES: Medicine[] = [
  {
    id: "m1",
    name: "Panado",
    generic: "Paracetamol",
    form: "Tablet",
    strength: "500mg",
    pack: "24 tablets",
    schedule: 0,
    requiresPrescription: false,
    category: "Pain & fever",
    prices: [
      { pharmacy: "Clicks", price: 24.99, inStock: true, delivery: true, distanceKm: 0.9 },
      { pharmacy: "Dis-Chem", price: 22.5, inStock: true, delivery: true, distanceKm: 2.1 },
      { pharmacy: "Rosebank Pharmacy", price: 27.0, inStock: true, delivery: false, distanceKm: 1.4 },
      { pharmacy: "Pick n Pay Pharmacy", price: 19.99, inStock: false, delivery: true, distanceKm: 3.2 },
    ],
  },
  {
    id: "m2",
    name: "Augmentin",
    generic: "Amoxicillin + Clavulanic acid",
    form: "Tablet",
    strength: "875mg/125mg",
    pack: "14 tablets",
    schedule: 4,
    requiresPrescription: true,
    category: "Antibiotic",
    prices: [
      { pharmacy: "Clicks", price: 189.99, inStock: true, delivery: true, distanceKm: 0.9 },
      { pharmacy: "Dis-Chem", price: 174.5, inStock: true, delivery: true, distanceKm: 2.1 },
      { pharmacy: "Rosebank Pharmacy", price: 205.0, inStock: false, delivery: false, distanceKm: 1.4 },
    ],
  },
  {
    id: "m3",
    name: "Glucophage",
    generic: "Metformin",
    form: "Tablet",
    strength: "850mg",
    pack: "60 tablets",
    schedule: 4,
    requiresPrescription: true,
    category: "Diabetes",
    prices: [
      { pharmacy: "Clicks", price: 89.99, inStock: true, delivery: true, distanceKm: 0.9 },
      { pharmacy: "Dis-Chem", price: 79.0, inStock: true, delivery: true, distanceKm: 2.1 },
      { pharmacy: "Pick n Pay Pharmacy", price: 75.5, inStock: true, delivery: true, distanceKm: 3.2 },
    ],
  },
  {
    id: "m4",
    name: "Ventolin",
    generic: "Salbutamol",
    form: "Inhaler",
    strength: "100mcg",
    pack: "200 doses",
    schedule: 3,
    requiresPrescription: true,
    category: "Asthma",
    prices: [
      { pharmacy: "Clicks", price: 129.99, inStock: true, delivery: true, distanceKm: 0.9 },
      { pharmacy: "Dis-Chem", price: 119.0, inStock: false, delivery: true, distanceKm: 2.1 },
      { pharmacy: "Rosebank Pharmacy", price: 135.0, inStock: true, delivery: false, distanceKm: 1.4 },
    ],
  },
  {
    id: "m5",
    name: "Allergex",
    generic: "Chlorphenamine",
    form: "Tablet",
    strength: "4mg",
    pack: "30 tablets",
    schedule: 1,
    requiresPrescription: false,
    category: "Allergy",
    prices: [
      { pharmacy: "Clicks", price: 34.99, inStock: true, delivery: true, distanceKm: 0.9 },
      { pharmacy: "Dis-Chem", price: 29.5, inStock: true, delivery: true, distanceKm: 2.1 },
      { pharmacy: "Pick n Pay Pharmacy", price: 32.0, inStock: true, delivery: true, distanceKm: 3.2 },
    ],
  },
  {
    id: "m6",
    name: "Brufen",
    generic: "Ibuprofen",
    form: "Tablet",
    strength: "400mg",
    pack: "20 tablets",
    schedule: 2,
    requiresPrescription: false,
    category: "Pain & inflammation",
    prices: [
      { pharmacy: "Clicks", price: 39.99, inStock: true, delivery: true, distanceKm: 0.9 },
      { pharmacy: "Dis-Chem", price: 35.0, inStock: true, delivery: true, distanceKm: 2.1 },
      { pharmacy: "Rosebank Pharmacy", price: 42.0, inStock: true, delivery: false, distanceKm: 1.4 },
    ],
  },
];

/* ---------- Facilities ---------- */
export type Facility = {
  id: string;
  name: string;
  category: "hospital" | "clinic" | "pharmacy";
  location: string;
  province: string;
  distanceKm: number;
  rating: number;
  open: boolean;
  openUntil: string;
  beds?: { total: number; available: number };
  queueWait?: number; // minutes
  tags: string[];
  lat: number;
  lng: number;
};

export const FACILITIES: Facility[] = [
  {
    id: "f1",
    name: "Chris Hani Baragwanath Hospital",
    category: "hospital",
    location: "Soweto, Gauteng",
    province: "Gauteng",
    distanceKm: 3.2,
    rating: 4.4,
    open: true,
    openUntil: "24/7",
    beds: { total: 2888, available: 412 },
    queueWait: 47,
    tags: ["Trauma", "ICU", "Paediatrics", "Teaching"],
    lat: -26.2731,
    lng: 27.9495,
  },
  {
    id: "f2",
    name: "Charlotte Maxeke Hospital",
    category: "hospital",
    location: "Parktown, Gauteng",
    province: "Gauteng",
    distanceKm: 5.1,
    rating: 4.2,
    open: true,
    openUntil: "24/7",
    beds: { total: 1088, available: 187 },
    queueWait: 62,
    tags: ["Trauma", "Cardiac", "Maternity"],
    lat: -26.1715,
    lng: 28.0419,
  },
  {
    id: "f3",
    name: "Rosebank Clinic",
    category: "clinic",
    location: "Rosebank, Gauteng",
    province: "Gauteng",
    distanceKm: 0.8,
    rating: 4.6,
    open: true,
    openUntil: "20:00",
    queueWait: 18,
    tags: ["GP", "Vaccines", "Family medicine"],
    lat: -26.1436,
    lng: 28.0396,
  },
  {
    id: "f4",
    name: "Clicks Pharmacy — Rosebank",
    category: "pharmacy",
    location: "Rosebank, Gauteng",
    province: "Gauteng",
    distanceKm: 0.9,
    rating: 4.6,
    open: true,
    openUntil: "21:00",
    tags: ["Refills", "Drive-thru", "Delivery"],
    lat: -26.1438,
    lng: 28.0401,
  },
  {
    id: "f5",
    name: "Dis-Chem — Sandton",
    category: "pharmacy",
    location: "Sandton, Gauteng",
    province: "Gauteng",
    distanceKm: 2.1,
    rating: 4.8,
    open: true,
    openUntil: "22:00",
    tags: ["Clinic", "Vaccines", "Delivery", "24h ER"],
    lat: -26.1076,
    lng: 28.0567,
  },
  {
    id: "f6",
    name: "Groote Schuur Hospital",
    category: "hospital",
    location: "Cape Town, Western Cape",
    province: "Western Cape",
    distanceKm: 1412,
    rating: 4.3,
    open: true,
    openUntil: "24/7",
    beds: { total: 952, available: 134 },
    queueWait: 71,
    tags: ["Transplant", "Cardiac", "Teaching"],
    lat: -33.9407,
    lng: 18.4612,
  },
];

/* ---------- Queue / service data ---------- */
export type QueueTicket = {
  number: number;
  facility: string;
  service: string;
  issuedAt: string;
  estimatedWaitMin: number;
  status: "waiting" | "called" | "serving" | "missed" | "completed";
};

export const CURRENT_TICKET: QueueTicket = {
  number: 42,
  facility: "Rosebank Clinic",
  service: "General check-up",
  issuedAt: "Today, 09:14",
  estimatedWaitMin: 38,
  status: "waiting",
};

export const QUEUE_STATE = {
  nowServing: 37,
  totalAhead: 4,
  totalInQueue: 23,
  avgWaitMin: 12,
  lastUpdated: "just now",
};

/* ---------- Landing page ---------- */
export const PAIN_POINTS = [
  { title: "Queueing for hours to be seen for 5 minutes", solution: "Smart triage queues, teleconsults and SMS-ready turn times so patients stop waiting in corridors.", icon: "Clock" },
  { title: "Records that vanish between clinics", solution: "One patient, one record — carried on the network, not the folder. FHIR R4 compliant.", icon: "FolderX" },
  { title: "Pharmacies that never got the script", solution: "E-prescriptions route straight to the nearest open pharmacy — with stock checks.", icon: "Pill" },
  { title: "Beds no one knew were free", solution: "A live heatmap of every ward, every hospital — so ambulances stop circling.", icon: "BedDouble" },
  { title: "Passwords nobody can remember", solution: "Passkeys & WhatsApp OTP. Sign in with a face, a fingerprint or a tap.", icon: "KeyRound" },
  { title: "Rural clinics left in the dark", solution: "Offline-first capture. Work with zero signal, sync the moment it returns.", icon: "WifiOff" },
];
