import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your MedLink SA account to book appointments, order prescriptions, and manage your healthcare.",
  alternates: {
    canonical: "/sign-in",
  },
  openGraph: {
    title: "Sign In | MedLink SA",
    description:
      "Access your MedLink SA dashboard — patients, doctors, pharmacies, hospitals, and administrators.",
    url: "https://medlink-sa.co.za/sign-in",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
