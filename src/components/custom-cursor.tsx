"use client";

import { useEffect, useRef } from "react";

/**
 * CustomCursor — dot + ring cursor with a liquid water-splash ripple on click/tap.
 * Works on mouse (desktop) AND touch (mobile).
 * Respects prefers-reduced-motion (disables itself).
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce) return;

    if (fine) document.body.classList.add("custom-cursor-active");

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (fine) {
        dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
        const target = e.target as HTMLElement;
        const interactive = target.closest("a,button,[role='button'],input,textarea,select,[data-cursor='hover']");
        ring.classList.toggle("hovering", !!interactive);
      }
    };

    // Water-splash ripple — fires on BOTH mouse click and touch tap
    const createSplash = (x: number, y: number) => {
      const splash = document.createElement("span");
      splash.className = "water-ripple";
      splash.style.left = `${x}px`;
      splash.style.top = `${y}px`;
      document.body.appendChild(splash);
      setTimeout(() => splash.remove(), 800);
      for (let i = 0; i < 6; i++) {
        const droplet = document.createElement("span");
        droplet.className = "water-droplet";
        const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 28 + Math.random() * 24;
        droplet.style.left = `${x}px`;
        droplet.style.top = `${y}px`;
        droplet.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
        droplet.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
        document.body.appendChild(droplet);
        setTimeout(() => droplet.remove(), 700);
      }
    };

    const onDown = (e: PointerEvent) => createSplash(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) createSplash(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onLeave = () => { dot.style.opacity = "0"; ring.style.opacity = "0"; };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX - 19}px, ${ringY - 19}px)`;
      raf = requestAnimationFrame(loop);
    };
    if (fine) loop();

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    if (fine) document.addEventListener("pointerleave", onLeave);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("touchstart", onTouch);
      if (fine) document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
