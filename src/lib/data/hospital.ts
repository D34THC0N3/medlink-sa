/* Hospital dashboard mock data */

export const BED_GRID = Array.from({ length: 80 }).map((_, i) => ({
  id: `bed-${i + 1}`,
  ward: ["ICU", "General", "Paediatrics", "Maternity", "Surgical"][i % 5],
  status: (["occupied", "available", "cleaning", "reserved"] as const)[
    ((i * 7) % 4)
  ],
}));

export const HOSPITAL_STAFF = [
  { id: "st1", name: "Dr. Sipho Dlamini", role: "Cardiologist", status: "on-duty", patients: 12, verified: true },
  { id: "st2", name: "Dr. Thandiwe Mokoena", role: "GP", status: "on-duty", patients: 8, verified: true },
  { id: "st3", name: "Nurse N. Nkosi", role: "ICU Nurse", status: "on-duty", patients: 4, verified: true },
  { id: "st4", name: "Dr. R. Naidoo", role: "Dermatologist", status: "off-duty", patients: 0, verified: true },
  { id: "st5", name: "Dr. (pending) K. Adams", role: "Paediatrics", status: "pending", patients: 0, verified: false },
];

export const HOSPITAL_QUEUE = [
  { number: 37, name: "M. Khumalo", service: "Triage", status: "serving", waitMin: 0 },
  { number: 38, name: "P. Sithole", service: "General", status: "called", waitMin: 2 },
  { number: 39, name: "L. Botha", service: "General", status: "waiting", waitMin: 8 },
  { number: 40, name: "R. Pillay", service: "Lab", status: "waiting", waitMin: 14 },
  { number: 41, name: "T. Molefe", service: "General", status: "waiting", waitMin: 22 },
  { number: 42, name: "You", service: "General", status: "waiting", waitMin: 38 },
];

export const APPROVALS_PENDING = [
  { id: "ap1", name: "Dr. K. Adams", role: "Paediatrician", hpcsa: "MP088234", applied: "2 days ago" },
  { id: "ap2", name: "Nurse L. Zulu", role: "ICU Nurse", sanc: "SANC-449821", applied: "5 hours ago" },
];
