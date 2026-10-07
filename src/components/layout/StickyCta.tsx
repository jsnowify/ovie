"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import { useLoader } from "@/providers/LoaderProvider";
import { useOverLight } from "@/hooks/useOverLight";
import { hero } from "@/config/site";

/** "Start a project" stays on screen while scrolling (like the header). */
export default function StickyCta() {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const control = useRef<HTMLDivElement>(null);
  const { ready } = useLoader();
  const onLight = useOverLight(control);
  // Hide when a section's own CTA is visible so the fixed button doesn't overlap it.
  const [hidden, setHidden] = useState(false);

  useGSAP(
    () => {
      const zones = [
        document.getElementById("cta"),
        document.getElementById("contact"),
        document.querySelector("[data-service-cta]"),
      ].filter((zone): zone is HTMLElement => zone instanceof HTMLElement);
      const visibility = new Map<HTMLElement, boolean>();
      zones.forEach((zone) => {
        const trigger = ScrollTrigger.create({
          trigger: zone,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            visibility.set(zone, self.isActive);
            setHidden([...visibility.values()].some(Boolean));
          },
        });
        visibility.set(zone, trigger.isActive);
      });
      setHidden([...visibility.values()].some(Boolean));
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

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
      data-adaptive-ui
      // inert: while it is off screen it can't be tabbed to or clicked
      inert={hidden || undefined}
      className={`pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center transition-[color,transform] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] md:bottom-8 ${
        hidden ? "translate-y-[300%]" : "translate-y-0"
      } ${onLight ? "text-ink" : "text-cream"}`}
    >
      <div ref={control}>
        <Button href={pathname === "/contact/" || pathname === "/contact" ? "#project-inquiry" : hero.cta.href} data-rise className="pointer-events-auto">
          {hero.cta.label}
        </Button>
      </div>
    </div>
  );
}
