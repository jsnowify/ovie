"use client";

import { useEffect, useState, type RefObject } from "react";
import { ScrollTrigger } from "@/lib/gsap";

type Measure = (colors: Map<Element, string>) => void;
const measures = new Set<Measure>();
let frame = 0;
let trigger: ScrollTrigger | null = null;
const schedule = () => {
  if (frame || document.hidden) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    const colors = new Map<Element, string>();
    measures.forEach((measure) => measure(colors));
  });
};

function subscribe(measure: Measure) {
  measures.add(measure);
  if (measures.size === 1) {
    trigger = ScrollTrigger.create({ onUpdate: schedule, onRefresh: schedule });
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule);
    ScrollTrigger.addEventListener("refresh", schedule);
  }
  schedule();
  return () => {
    measures.delete(measure);
    if (measures.size) return;
    cancelAnimationFrame(frame);
    frame = 0;
    trigger?.kill();
    trigger = null;
    window.removeEventListener("scroll", schedule, true);
    window.removeEventListener("resize", schedule);
    ScrollTrigger.removeEventListener("refresh", schedule);
  };
}

/** Detect the surface beneath each fixed control, independently. */
export function useOverLight(target: RefObject<HTMLElement | null>) {
  const [over, setOver] = useState(false);

  useEffect(() => {
    let previous = false;
    const update = (next: boolean) => {
      if (previous === next) return;
      previous = next;
      setOver(next);
    };
    const measure: Measure = (colors) => {
      const control = target.current;
      if (!control || control.closest("[inert]")) return;
      const rect = control.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      if (y < 0 || y >= window.innerHeight) return;

      for (const surface of document.elementsFromPoint(x, y)) {
        if (surface.closest("[data-adaptive-ui]")) continue;
        // Photos and videos use light foregrounds; CSS surface colors are
        // measured below. This does not sample individual image pixels.
        if (surface instanceof HTMLImageElement || surface instanceof HTMLVideoElement) {
          update(false);
          return;
        }
        let color = colors.get(surface);
        if (color === undefined) {
          color = getComputedStyle(surface).backgroundColor;
          colors.set(surface, color);
        }
        const values = color.match(/[\d.]+/g)?.map(Number);
        if (!values || values.length < 3 || (values[3] ?? 1) < 0.9) continue;
        const channels = values.slice(0, 3).map((value) => {
          const channel = value / 255;
          return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        });
        const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
        update(luminance > 0.179);
        return;
      }
      update(false);
    };
    return subscribe(measure);
  }, [target]);

  return over;
}
