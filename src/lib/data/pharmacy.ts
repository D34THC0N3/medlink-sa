/* Pharmacy dashboard mock data */

export const PHARMACY_ORDERS = [
  { id: "o1", patient: "Thandiwe M.", medicine: "Glucophage 850mg × 60", price: 89.99, status: "new" as const, delivery: true, address: "Rosebank, JHB" },
  { id: "o2", patient: "Sipho D.", medicine: "Augmentin 875mg × 14", price: 189.99, status: "preparing" as const, delivery: true, address: "Sandton, JHB" },
  { id: "o3", patient: "Aisha P.", medicine: "Ventolin Inhaler", price: 129.99, status: "ready" as const, delivery: false, address: "In-store pickup" },
  { id: "o4", patient: "Johan V.", medicine: "Brufen 400mg × 20", price: 39.99, status: "new" as const, delivery: true, address: "Parktown, JHB" },
  { id: "o5", patient: "Walk-in", medicine: "Panado 500mg × 24", price: 24.99, status: "completed" as const, delivery: false, address: "In-store" },
];

export const PHARMACY_INVENTORY = [
  { id: "i1", name: "Panado 500mg", stock: 240, reorder: 50, status: "ok" as const },
  { id: "i2", name: "Augmentin 875mg", stock: 18, reorder: 30, status: "low" as const },
  { id: "i3", name: "Glucophage 850mg", stock: 92, reorder: 40, status: "ok" as const },
  { id: "i4", name: "Ventolin Inhaler", stock: 7, reorder: 15, status: "critical" as const },
  { id: "i5", name: "Allergex 4mg", stock: 130, reorder: 40, status: "ok" as const },
  { id: "i6", name: "Brufen 400mg", stock: 22, reorder: 30, status: "low" as const },
];
