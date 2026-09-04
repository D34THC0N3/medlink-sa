import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Get answers to common questions about MedLink SA — how to book appointments, join the queue, order medicine, and use the platform.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "FAQ | MedLink SA",
    description:
      "Everything you need to know about using MedLink SA's digital health platform.",
    url: "https://medlink-sa.co.za/faq",
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
