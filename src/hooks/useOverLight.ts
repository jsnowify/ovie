"use client";

import { useState } from "react";
import { useGSAP, ScrollTrigger } from "@/lib/gsap";

/**
 * True while the cream panels (#works through #about) is under the given edge of
 * the viewport. Fixed UI (header at the top, CTA at the bottom) uses it to
 * switch to dark colors so it stays visible over the cream panel.
 */
export function useOverLight(edge: "top" | "bottom") {
  const [over, setOver] = useState(false);

  useGSAP(
    () => {
      const works = document.getElementById("works");
      if (!works) return;
      // Selected Work and the Introduction are both cream and back to back,
      // so one trigger spans from the top of #works to the bottom of #about.
      const last = document.getElementById("about") ?? works;
      ScrollTrigger.create({
        trigger: works,
        endTrigger: last,
        start: edge === "top" ? "top 40px" : "top bottom-=40px",
        end: edge === "top" ? "bottom 40px" : "bottom bottom-=40px",
        onToggle: (self) => setOver(self.isActive),
      });
    },
    { dependencies: [] },
  );

  return over;
}
