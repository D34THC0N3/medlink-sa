import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SessionProvider from "@/components/session-provider";
import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/lang-context";
import { SecurityProvider } from "@/components/security-provider";
import ChunkErrorHandler from "@/components/chunk-error-handler";
import { PageTransition } from "@/components/page-transition";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://medlink-sa.co.za";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MedLink SA — South Africa's National Health Network",
    template: "%s | MedLink SA",
  },
  description:
    "MedLink SA connects patients, doctors, hospitals, pharmacies and administrators into one national digital health ecosystem. Book appointments, order medicine, join the queue, and get care — anywhere in South Africa.",
  keywords: [
    "MedLink SA",
    "digital health South Africa",
    "telemedicine",
    "healthcare platform",
    "online pharmacy South Africa",
    "clinic queue",
    "DHIS2",
  ],
  authors: [{ name: "MedLink SA" }],
  creator: "MedLink SA",
  publisher: "MedLink SA",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-ZA": "/",
      af: "/",
      zu: "/",
    },
  },
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "MedLink SA — South Africa's National Health Network",
    description:
      "One operating system for South African healthcare. Patients, doctors, hospitals, pharmacies & administrators — connected.",
    url: siteUrl,
    siteName: "MedLink SA",
    type: "website",
    locale: "en_ZA",
  },
  twitter: {
    card: "summary_large_image",
    title: "MedLink SA",
    description:
      "South Africa's national digital health ecosystem — one living nervous system.",
  },
  verification: {},
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f5f9" },
    { media: "(prefers-color-scheme: dark)", color: "#05070d" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${jetbrains.variable} font-sans antialiased bg-background text-foreground`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "MedLink SA",
              url: siteUrl,
              logo: `${siteUrl}/logo.svg`,
              description:
                "South Africa's national digital health ecosystem connecting patients, doctors, hospitals, pharmacies and administrators.",
              address: {
                "@type": "PostalAddress",
                addressCountry: "ZA",
              },
              sameAs: [],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "MedLink SA",
              url: siteUrl,
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteUrl}/explore?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
        <SessionProvider>
          <AuthProvider>
            <LanguageProvider>
              <SecurityProvider>
                <ChunkErrorHandler />
                <PageTransition>{children}</PageTransition>
              </SecurityProvider>
            </LanguageProvider>
          </AuthProvider>
        </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
