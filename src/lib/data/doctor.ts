/* Doctor dashboard mock data */

export const DOCTOR_SCHEDULE = [
  {
    id: "s1",
    patient: "Thandiwe M.",
    age: 47,
    reason: "Hypertension follow-up",
    time: "09:00",
    duration: 30,
    type: "in-person" as const,
    status: "checked-in" as const,
  },
  {
    id: "s2",
    patient: "Sipho D.",
    age: 58,
    reason: "Post-op cardiac review",
    time: "09:45",
    duration: 30,
    type: "video" as const,
    status: "upcoming" as const,
  },
  {
    id: "s3",
    patient: "Aisha P.",
    age: 52,
    reason: "Diabetes T2 — quarterly",
    time: "10:30",
    duration: 30,
    type: "in-person" as const,
    status: "upcoming" as const,
  },
  {
    id: "s4",
    patient: "Johan V.",
    age: 61,
    reason: "Chest pain — minor",
    time: "11:15",
    duration: 20,
    type: "video" as const,
    status: "upcoming" as const,
  },
];


