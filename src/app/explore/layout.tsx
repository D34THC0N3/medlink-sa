import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Facilities & Services",
  description:
    "Discover clinics, hospitals, pharmacies and healthcare services across South Africa. Filter by province, service type, and availability on MedLink SA.",
  alternates: {
    canonical: "/explore",
  },
  openGraph: {
    title: "Explore Facilities & Services | MedLink SA",
    description:
      "Find and compare healthcare facilities nationwide — clinics, hospitals, pharmacies, and more.",
    url: "https://medlink-sa.co.za/explore",
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
