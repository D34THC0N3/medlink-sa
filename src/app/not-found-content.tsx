"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SiteNavbar from "@/components/layout/site-navbar";
import SiteFooter from "@/components/layout/site-footer";

export default function NotFoundContent() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteNavbar />
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-lg"
        >
          <svg
            viewBox="0 0 64 64"
            className="mx-auto mb-8 w-20 h-20 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <rect x="8" y="8" width="48" height="48" rx="8" />
            <line x1="20" y1="24" x2="44" y2="40" />
            <line x1="44" y1="24" x2="20" y2="40" />
          </svg>
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground">
            404
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </motion.div>
      </main>
      <SiteFooter />
    </div>
  );
}
