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

export const DOCTOR_HIGH_RISK = [
  {
    id: "h1",
    name: "Thandiwe Mokoena",
    initials: "TM",
    condition: "Hypertension · Stage 2",
    risk: "critical" as const,
    lastVisit: "12 Jun",
    trend: [128, 131, 126, 133, 129, 124, 127],
  },
  {
    id: "h2",
    name: "Sipho Dlamini",
    initials: "SD",
    condition: "Post-op cardiac",
    risk: "high" as const,
    lastVisit: "10 Jun",
    trend: [86, 84, 90, 88, 92, 87, 89],
  },
  {
    id: "h3",
    name: "Aisha Patel",
    initials: "AP",
    condition: "Diabetes T2",
    risk: "moderate" as const,
    lastVisit: "08 Jun",
    trend: [142, 138, 140, 145, 139, 141, 137],
  },
];
