"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { hero } from "@/config/site";

const REPEAT = 4; // enough copies that one group is wider than any screen

function Group({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0" aria-hidden={hidden || undefined}>
      {Array.from({ length: REPEAT }, (_, i) => (
        // pr + gap use em so the spacing scales with the text. Every item is
        // the same width, so two groups side by side loop with no jump.
        <span
          key={i}
          className="inline-flex shrink-0 items-center gap-[0.35em] whitespace-nowrap pr-[0.35em]"
        >
          {hero.cta.label}
          <span className="font-light">*</span>
        </span>
      ))}
    </div>
  );
}

/**
 * Call to action: one big endless line of "Start a project *", and the whole
 * strip is a link. While this section is on screen the floating CTA button
 * hides itself (see StickyCta.tsx), so there are never two buttons at once.
 *
 * The motion is plain CSS (.cta-marquee-track in globals.css): the track
 * holds two identical groups and slides left by exactly one group's width.
 */
export default function CtaMarquee() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const section = root.current;
    const element = track.current;
    if (!section || !element) return;
    const observer = new IntersectionObserver(([entry]) => {
      element.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
      element.style.willChange = entry.isIntersecting ? "transform" : "auto";
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={root}
      id="cta"
      aria-label={hero.cta.label}
      className="relative z-10 overflow-hidden bg-cream py-20 text-ink md:py-24"
    >
      <Link
        href={hero.cta.href}
        aria-label={hero.cta.label}
        className="block text-[clamp(1.75rem,6vw,5.5rem)] font-semibold uppercase leading-[1] tracking-[-0.06em] transition-colors duration-500 hover:text-clay focus-visible:text-clay"
      >
        <div ref={track} style={{ animationPlayState: "paused" }} className="cta-marquee-track flex w-max">
          <Group />
          <Group hidden />
        </div>
      </Link>
    </section>
  );
}
