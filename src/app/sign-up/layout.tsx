import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create your free MedLink SA account to connect with healthcare providers, book appointments, and access digital health services across South Africa.",
  alternates: {
    canonical: "/sign-up",
  },
  openGraph: {
    title: "Create Account | MedLink SA",
    description:
      "Join South Africa's national health network — free for patients, doctors, and pharmacies.",
    url: "https://medlink-sa.co.za/sign-up",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
