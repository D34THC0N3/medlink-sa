"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth, ROLE_DASHBOARDS } from "@/lib/auth-context";
import { useLang } from "@/lib/lang-context";

const HeartModel = dynamic(() => import("@/components/three/heart-model"), {
  ssr: false,
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function HeroSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const { user } = useAuth();
  const { t } = useLang();
  const [mounted, setMounted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    return scrollYProgress.on("change", (v) => setProgress(v));
  }, [scrollYProgress]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // GSAP cinematic intro
  useEffect(() => {
    if (!sectionRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-word", {
        yPercent: 120,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.1,
        delay: 0.5,
      });
      gsap.from(".hero-fade", {
        y: 24,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
        delay: 1.1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll transforms — minimal, clean
  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.45], [1, 0.3, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.35], [0, -50]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const titleWords = [t("hero.title1"), t("hero.title2"), t("hero.title3")];

  return (
    <section ref={sectionRef} className="relative h-[200vh]" id="top">
      <div ref={ref} className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Clean minimal background */}
        <div className="absolute inset-0 bg-background" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 65% 50%, color-mix(in oklab, var(--medical) 12%, transparent) 0%, transparent 60%)",
          }}
        />

        {/* === 3D heart — CENTER STAGE, the main focus === */}
        <div className="absolute inset-0 z-10">
          <HeartModel scrollProgress={progress} baseX={0.8} />
        </div>

        {/* === Minimal text overlay — bottom-left, doesn't cover the heart === */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="pointer-events-none absolute inset-0 z-20 flex items-end justify-start px-6 pb-24 sm:px-10 sm:pb-16 lg:px-16"
        >
          <div className="max-w-lg">
            {/* Kicker */}
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hero-fade chip pointer-events-auto mb-4"
            >
              <span className="status-dot bg-emerald-500" />
              {t("hero.kicker")}
            </motion.span>

            {/* Headline — word-by-word reveal */}
            <motion.h1
              className="font-display text-[2rem] font-semibold leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl"
            >
              {titleWords.map((word, wi) => (
                <span key={wi} className="block overflow-hidden">
                  <span
                    className={`hero-word inline-block ${
                      wi === 1 ? "text-gradient-medical" : "text-foreground"
                    }`}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ y: 12 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="hero-fade mt-3 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm lg:text-base"
            >
              {t("hero.sub")}
            </motion.p>

            {/* CTA — minimal */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.3 }}
              className="hero-fade pointer-events-auto mt-5"
            >
              {mounted && user ? (
                <Link href={ROLE_DASHBOARDS[user.role]} className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold sm:px-6 sm:py-3 sm:text-sm">
                  {t("hero.cta3")}
                </Link>
              ) : (
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <Link href="/sign-up" className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold sm:px-6 sm:py-3 sm:text-sm">
                    {t("hero.cta1")}
                  </Link>
                  <Link href="/sign-in" className="btn-glass inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold sm:px-6 sm:py-3 sm:text-sm">
                    {t("hero.cta2")}
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* === Scroll cue — bottom-center, minimal === */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="hero-fade absolute inset-x-0 bottom-6 z-30 flex flex-col items-center gap-2"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground"
          >
            <ArrowDown className="h-3 w-3 animate-bounce" />
            {t("hero.scroll")}
          </motion.div>
        </motion.div>

        {/* === Drag/poke hint — desktop only, minimal, top-center === */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: progress < 0.05 ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 2.2 }}
          className="pointer-events-none absolute top-24 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-2 text-xs text-muted-foreground/70 sm:flex"
        >
          <Sparkles className="h-3 w-3 text-medical" />
          {t("hero.hint")}
        </motion.div>
      </div>
    </section>
  );
}
