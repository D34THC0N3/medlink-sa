/* Admin dashboard mock data */

export const ADMIN_USERS = [
  { id: "u1", name: "Thandiwe Mokoena", email: "adminpatient@gmail.com", role: "Patient", verified: "approved", joined: "12 Jan 2025" },
  { id: "u2", name: "Dr. Sipho Dlamini", email: "admindoctor@gmail.com", role: "Doctor", verified: "approved", joined: "08 Feb 2025" },
  { id: "u3", name: "Chris Hani Baragwanath", email: "adminhospital@gmail.com", role: "Hospital", verified: "approved", joined: "03 Jan 2025" },
  { id: "u4", name: "Clicks Rosebank", email: "adminpharmacy@gmail.com", role: "Pharmacy", verified: "approved", joined: "22 Feb 2025" },
  { id: "u5", name: "Dr. K. Adams", email: "k.adams@hpcsa.za", role: "Doctor", verified: "pending", joined: "2 days ago" },
  { id: "u6", name: "Netcare Sunninghill", email: "admin@sunninghill.netcare.co.za", role: "Hospital", verified: "pending", joined: "1 day ago" },
  { id: "u7", name: "L. Zulu", email: "lzulu@nurse.za", role: "Doctor", verified: "pending", joined: "5 hours ago" },
];

export const ADMIN_HOSPITALS = [
  { id: "h1", name: "Chris Hani Baragwanath", province: "Gauteng", beds: 2888, doctors: 184, verified: true, joined: "03 Jan 2025" },
  { id: "h2", name: "Charlotte Maxeke", province: "Gauteng", beds: 1088, doctors: 112, verified: true, joined: "15 Jan 2025" },
  { id: "h3", name: "Groote Schuur", province: "Western Cape", beds: 952, doctors: 98, verified: true, joined: "28 Jan 2025" },
  { id: "h4", name: "Netcare Sunninghill", province: "Gauteng", beds: 432, doctors: 64, verified: false, joined: "1 day ago" },
  { id: "h5", name: "Inkosi Albert Luthuli", province: "KwaZulu-Natal", beds: 836, doctors: 89, verified: false, joined: "3 days ago" },
];



export const NETWORK_ACTIVITY = [
  { d: "Mon", consults: 4200, scripts: 1800 },
  { d: "Tue", consults: 4800, scripts: 2100 },
  { d: "Wed", consults: 5100, scripts: 2300 },
  { d: "Thu", consults: 4900, scripts: 2250 },
  { d: "Fri", consults: 5600, scripts: 2600 },
  { d: "Sat", consults: 3400, scripts: 1500 },
  { d: "Sun", consults: 2800, scripts: 1200 },
];

export const PROVINCE_SPLIT = [
  { name: "Gauteng", value: 38, color: "#2563eb" },
  { name: "KwaZulu-Natal", value: 22, color: "#06b6d4" },
  { name: "Western Cape", value: 18, color: "#8b5cf6" },
  { name: "Eastern Cape", value: 9, color: "#10b981" },
  { name: "Other", value: 13, color: "#f59e0b" },
];
