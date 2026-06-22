"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export function useGsapScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!ref.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-animate='fade-up']").forEach((el) => {
        gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-animate='stagger']").forEach((el) => {
        const kids = Array.from(el.children) as HTMLElement[];
        gsap.from(kids, { y: 30, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-animate='title']").forEach((el) => {
        const text = el.textContent || "";
        el.textContent = "";
        const words = text.split(" ");
        words.forEach((w, i) => {
          const span = document.createElement("span");
          span.style.display = "inline-block";
          span.style.overflow = "hidden";
          const inner = document.createElement("span");
          inner.style.display = "inline-block";
          inner.textContent = i < words.length - 1 ? w + "\u00A0" : w;
          span.appendChild(inner);
          el.appendChild(span);
        });
        const inners = el.querySelectorAll(":scope > span > span");
        gsap.from(inners, { yPercent: 110, duration: 1, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return ref;
}
