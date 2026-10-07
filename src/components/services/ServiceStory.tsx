"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";

export default function ServiceStory({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const pathname = usePathname();
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-story-reveal]").forEach((section) => {
        gsap.from(section.querySelectorAll("[data-story-heading]"), {
          y: 28,
          opacity: 0,
          duration: 1,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 85%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-story-parallax]").forEach((image) => {
        gsap.fromTo(image, { yPercent: -8 }, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: image.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    });
    return () => media.revert();
  }, { scope: root, dependencies: [pathname], revertOnUpdate: true });

  return <main ref={root} className="relative bg-cream text-ink">{children}</main>;
}
