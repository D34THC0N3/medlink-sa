import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findMockUserByEmail, type MockUser } from "@/lib/mock-users";

/**
 * Auth config that works with or without a database.
 * When DATABASE_URL is set and Prisma is available, uses PostgreSQL.
 * Otherwise falls back to an in-memory mock user store (seeded with
 * the test accounts shown on the sign-in page).
 */
const HAS_DB = !!process.env.DATABASE_URL;

async function authorize(
  credentials: Record<"email" | "password", string> | undefined
) {
  if (!credentials?.email || !credentials?.password) return null;

  if (HAS_DB) {
    try {
      const { PrismaClient, UserRole } = await import("@prisma/client");
      const prisma = new PrismaClient();
      const user = await prisma.user.findUnique({
        where: { email: credentials.email.toLowerCase().trim() },
      });
      if (!user) return null;
      const valid = await bcrypt.compare(credentials.password, user.passwordHash);
      if (!valid) return null;
      return {
        id: user.id,
        name: user.name ?? "",
        email: user.email,
        role: user.role as UserRole,
        avatar: user.avatar ?? undefined,
      };
    } catch {
      // Prisma unavailable — fall through to mock
    }
  }

  // Mock mode: validate against in-memory users
  const mock = findMockUserByEmail(credentials.email);
  if (!mock) return null;
  const valid = bcrypt.compare(credentials.password, mock.passwordHash);
  if (!valid) return null;
  return {
    id: mock.id,
    name: mock.name,
    email: mock.email,
    role: mock.role,
    avatar: mock.avatar,
  };
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
};
