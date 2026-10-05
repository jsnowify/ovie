"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import { useLoader } from "@/providers/LoaderProvider";
import { useOverLight } from "@/hooks/useOverLight";
import { hero } from "@/config/site";

/** "Start a project" stays on screen while scrolling (like the header). */
export default function StickyCta() {
  const root = useRef<HTMLDivElement>(null);
  const { ready } = useLoader();
  const onLight = useOverLight("bottom"); // over the cream Selected Work panel

  useGSAP(
    () => {
      if (!ready) return; // wait for the loader
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Rises up from below the screen edge, no fade.
        gsap.from("[data-rise]", {
          yPercent: 300,
          duration: 1.1,
          delay: 1,
          ease: "power4.out",
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  // z-30: above the page, below the open menu (z-40) and the header (z-50)
  return (
    <div
      ref={root}
      className={`pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center transition-colors duration-300 md:bottom-8 ${
        onLight ? "text-ink" : "text-cream"
      }`}
    >
      <Button href={hero.cta.href} data-rise className="pointer-events-auto">
        {hero.cta.label}
      </Button>
    </div>
  );
}
