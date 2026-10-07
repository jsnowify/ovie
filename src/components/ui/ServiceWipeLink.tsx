"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";

export default function ServiceWipeLink({ href, children }: { href: string; children: string }) {
  const root = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const link = root.current;
    if (!link) return;
    const fill = link.querySelector("[data-wipe]");
    const label = link.querySelector("[data-label]");
    let hovered = false;
    let focused = false;
    let shown = false;
    let animation: gsap.core.Timeline | null = null;
    const update = () => {
      const desired = hovered || focused;
      if (animation || desired === shown) return;
      shown = desired;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.set(fill, { transformOrigin: desired ? "top" : "bottom" });
      if (reduced) {
        gsap.set(fill, { scaleY: desired ? 1 : 0 });
        gsap.set(label, { color: desired ? "#fff9e8" : "#28251d" });
        return;
      }
      animation = gsap.timeline({ onComplete: () => { animation = null; update(); } });
      animation.to(fill, { scaleY: desired ? 1 : 0, duration: 0.9, ease: "expo.inOut" }, 0)
        .to(label, { color: desired ? "#fff9e8" : "#28251d", duration: 0.3 }, desired ? 0.35 : 0);
    };
    const enter = (event: PointerEvent) => { if (event.pointerType === "mouse") { hovered = true; update(); } };
    const leave = () => { hovered = false; update(); };
    const focus = () => { focused = link.matches(":focus-visible"); update(); };
    const blur = () => { focused = false; update(); };
    link.addEventListener("pointerenter", enter);
    link.addEventListener("pointerleave", leave);
    link.addEventListener("focus", focus);
    link.addEventListener("blur", blur);
    return () => {
      animation?.kill();
      link.removeEventListener("pointerenter", enter);
      link.removeEventListener("pointerleave", leave);
      link.removeEventListener("focus", focus);
      link.removeEventListener("blur", blur);
    };
  }, []);

  return (
    <Link ref={root} href={href} className="relative block overflow-hidden px-3 py-6 text-xl font-light tracking-[-0.04em] focus-visible:outline-clay md:text-3xl">
      <span data-wipe aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-clay" />
      <span data-label className="relative flex items-center justify-between gap-6"><span>{children}</span><span aria-hidden="true">↗</span></span>
    </Link>
  );
}
