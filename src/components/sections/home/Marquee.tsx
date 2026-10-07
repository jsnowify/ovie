"use client";

import { useEffect, useRef } from "react";
import Image from "@/components/ui/AheadImage";
import { gsap } from "@/lib/gsap";
import { useLenis } from "@/providers/SmoothScroll";
import { projects } from "@/data/projects";

/** Idle speed in px per frame at 60fps (about 72px/s). */
const BASE_SPEED = 1.2;
/** How much the scroll speed adds on top. Higher = reacts harder to fast scrolls. */
const BOOST = 0.35;
/** Smoothing for speed changes (0-1). Lower = floatier, slower to react. */
const EASE = 0.08;

// Photos from your projects, round-robin so neighbours come from different
// projects. An EVEN count keeps the tall/short pattern unbroken at the loop seam.
const photos = projects[0].images
  .flatMap((_, i) => projects.map((p) => p.images[i]))
  .filter(Boolean)
  .slice(0, 10);

function Group({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-start"
      aria-hidden={hidden || undefined}
    >
      {photos.map((src, i) => (
        // pr-gutter (not flex gap) so every group is exactly as wide as the
        // next one. That is what makes the loop seamless.
        <div key={i} className="w-[46vw] shrink-0 pr-gutter md:w-[21vw]">
          <div
            className={`relative overflow-hidden bg-[#ab7653] ${
              i % 2 === 0 ? "aspect-[4/5]" : "aspect-[5/4]"
            }`}
          >
            <Image observeSection
              src={src}
              alt=""
              fill
              quality={90}
              sizes="(min-width: 768px) 21vw, 46vw"
              className="object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Infinite image marquee driven by scroll.
 * - Always drifting at a slow base speed.
 * - Scrolling faster makes it faster.
 * - Scrolling back (up) reverses it. When you stop, it keeps the last direction.
 * Two identical groups sit side by side; the track slides and wraps by exactly
 * one group's width, so the jump is invisible.
 */
export default function Marquee() {
  const lenis = useLenis();
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const group = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rootEl = root.current;
    const trackEl = track.current;
    const groupEl = group.current;
    if (!rootEl || !trackEl || !groupEl) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    let loop = groupEl.offsetWidth;
    const ro = new ResizeObserver(() => {
      loop = groupEl.offsetWidth;
    });
    ro.observe(groupEl);

    const readScroll = () => lenis.current?.scroll ?? window.scrollY;
    let last = readScroll();
    let x = 0;
    let speed = 0;
    let dir = 1; // 1 = scrolling down -> marquee moves left

    const tick = (_time: number, deltaMs: number) => {
      const y = readScroll();
      const dy = y - last;
      last = y;
      if (!loop) return;

      const f = Math.min(deltaMs, 50) / (1000 / 60); // frame-rate independent
      if (Math.abs(dy) > 0.5) dir = Math.sign(dy);

      const push = Math.max(-80, Math.min(80, dy)) * BOOST;
      const target = dir * BASE_SPEED + push;
      // Signed easing: a direction change slides through zero instead of snapping.
      speed += (target - speed) * (1 - Math.pow(1 - EASE, f));

      x = gsap.utils.wrap(-loop, 0, x - speed * f);
      trackEl.style.transform = `translate3d(${x}px,0,0)`;
    };

    // Attach the ticker only while visible, rather than running an idle
    // callback on every frame throughout the rest of the page.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        last = readScroll();
        trackEl.style.willChange = "transform";
        gsap.ticker.add(tick);
      } else {
        gsap.ticker.remove(tick);
        trackEl.style.willChange = "auto";
      }
    });
    io.observe(rootEl);
    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      io.disconnect();
    };
  }, [lenis]);

  return (
    <section
      ref={root}
      aria-label="Selected images"
      className="relative z-10 overflow-hidden bg-cream pb-16 pt-20 md:pb-24 md:pt-24"
    >
      <div ref={track} className="flex w-max">
        <div ref={group} className="flex shrink-0">
          <Group />
        </div>
        <Group hidden />
      </div>
    </section>
  );
}
