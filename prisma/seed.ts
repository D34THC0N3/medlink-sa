import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const TEST_PASSWORD = "MedLink2024!";

const users = [
  {
    email: "admin@medlinksa.co.za",
    name: "Thabo Mokoena",
    role: "admin" as const,
    verified: true,
  },
  {
    email: "patient@medlinksa.co.za",
    name: "Lerato Nkosi",
    role: "patient" as const,
    verified: true,
  },
  {
    email: "doctor@medlinksa.co.za",
    name: "Dr. Sipho Dlamini",
    role: "doctor" as const,
    verified: true,
  },
  {
    email: "hospital@medlinksa.co.za",
    name: "Chris Hani Hospital",
    role: "hospital" as const,
    verified: true,
  },
  {
    email: "pharmacy@medlinksa.co.za",
    name: "Dis-Chem Pharmacy",
    role: "pharmacy" as const,
    verified: true,
  },
];

async function main() {
  const hash = await bcrypt.hash(TEST_PASSWORD, 10);

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        role: u.role,
        passwordHash: hash,
        verified: u.verified,
      },
    });
  }

  console.log("Seeded 5 test accounts:");
  for (const u of users) {
    console.log(`  ${u.role.padEnd(10)} ${u.email} / ${TEST_PASSWORD}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
