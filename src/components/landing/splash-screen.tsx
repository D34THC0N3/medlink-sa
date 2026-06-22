"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Activity } from "lucide-react";

const HeartCanvas = dynamic(() => import("@/components/three/heart-canvas"), {
  ssr: false,
});

const SPLASH_KEY = "medlink-sa-splash-seen";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(true);
  const [skippable, setSkippable] = useState(false);
  const [exiting, setExiting] = useState(false);

  const triggerExit = () => {
    setExiting(true);
    sessionStorage.setItem(SPLASH_KEY, "1");
    setTimeout(() => {
      setShow(false);
      onDone();
    }, 800);
  };

  useEffect(() => {
    // Only show once per browser session
    if (sessionStorage.getItem(SPLASH_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(false);
      onDone();
      return;
    }

    const t1 = setTimeout(() => setSkippable(true), 1500);
    const t2 = setTimeout(() => triggerExit(), 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06, filter: "blur(8px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onClick={skippable ? triggerExit : undefined}
          role="dialog"
          aria-label="MedLink SA is loading"
        >
          {/* ambient glow */}
          <div
            className="glow-orb"
            style={{
              width: 520,
              height: 520,
              background: "var(--glow-1)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          />

          <div className="relative h-[44vh] w-[80vw] max-w-[640px]">
            <HeartCanvas scale={1.1} particles />
          </div>

          <motion.div
            className="absolute bottom-[18vh] flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2 text-foreground">
              <div className="relative">
                <Activity className="h-5 w-5 text-medical" />
                <span className="status-dot absolute -right-1 -top-1 bg-medical" />
              </div>
              <span className="text-sm font-semibold tracking-[0.2em] uppercase">
                MedLink SA
              </span>
            </div>
            <div className="font-display text-2xl font-semibold text-gradient sm:text-3xl">
              South Africa&apos;s Health Network
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="h-px w-10 bg-medical/40" />
              <span className="text-xs text-muted-foreground">
                initialising the national pulse
              </span>
              <span className="h-px w-10 bg-medical/40" />
            </div>
          </motion.div>

          {/* ECG line */}
          <svg
            className="absolute bottom-0 left-0 w-full"
            height="60"
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
            aria-hidden
          >
            <motion.path
              d="M0 30 L 240 30 L 270 30 L 285 10 L 300 50 L 315 18 L 330 30 L 560 30 L 590 30 L 605 10 L 620 50 L 635 18 L 650 30 L 1200 30"
              fill="none"
              stroke="var(--medical)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 2.6, ease: "easeInOut" }}
            />
          </svg>

          {skippable && (
            <motion.button
              className="absolute bottom-8 right-8 chip cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              aria-label="Skip intro"
            >
              skip intro →
            </motion.button>
          )}

          {/* progress bar */}
          <div className="absolute bottom-0 left-0 h-0.5 w-full bg-border/50">
            <motion.div
              className="h-full bg-gradient-to-r from-medical to-cyan-400"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
