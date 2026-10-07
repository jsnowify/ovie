"use client";

import { useRef } from "react";
import Image from "@/components/ui/AheadImage";
import { gsap, useGSAP } from "@/lib/gsap";
import { philosophy } from "@/config/site";
import { projects } from "@/data/projects";

// Photo for the big frame: the Ivatan stone & timber house (exposed, heavy
// material fits the text). Change the index to use another project, or
// swap `cover` for any number from 0-6 to pick a different shot.
const source = projects[4] ?? projects[0];
const photo = source.images[source.cover];

/**
 * Philosophy. Follows the Introduction on the same cream background.
 * Title + tagline on top, a full-width image with the statement centered on
 * it, and three principles along the bottom (left / center / right).
 */
export default function Philosophy() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Text rises from below a clipped edge, same as the other sections.
        gsap.from("[data-line]", {
          yPercent: 110,
          duration: 1.2,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 65%",
            once: true,
          },
        });

        // Slow parallax drift on the photo, scrubbed to the scroll.
        gsap.fromTo(
          "[data-parallax]",
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-frame]",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="philosophy"
      aria-labelledby="philosophy-title"
      className="relative z-10 bg-ink px-gutter pb-16 pt-20 md:pb-24 text-cream md:pt-24"
    >
      {/* Title + tagline */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-6">
        <h2
          id="philosophy-title"
          className="overflow-hidden pb-[0.08em] text-[clamp(2.5rem,13vw,4rem)] font-light uppercase leading-[0.95] tracking-[-0.06em] md:text-[5vw]"
        >
          <span data-line className="block whitespace-nowrap">
            {philosophy.title}
          </span>
        </h2>
        <p className="text-[0.7rem] font-normal leading-[1.05] tracking-[-0.03em] md:pt-[0.4vw] md:text-[max(0.65rem,0.95vw)]">
          {philosophy.tagline.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <span data-line className="block">
                {line}
              </span>
            </span>
          ))}
        </p>
      </div>

      {/* Big image with the statement centered on it */}
      <div
        data-frame
        className="relative mt-gutter aspect-[4/5] overflow-hidden bg-[#ab7653] md:aspect-[2.4/1]"
      >
        <div data-parallax className="absolute inset-x-0 -top-[10%] h-[120%]">
          <Image
            src={photo}
            alt=""
            fill
            quality={100}
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {/* Darkens the photo a little so the cream text always reads */}
        <div className="absolute inset-0 bg-ink/45" aria-hidden />

        <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-[clamp(0.9rem,4vw,1.25rem)] font-normal leading-[1.05] tracking-[-0.04em] text-cream md:px-[8vw] md:text-[1.15vw]">
          <span className="block max-w-[60ch] overflow-hidden pb-[0.08em]">
            <span data-line className="block">
              {philosophy.statement}
            </span>
          </span>
        </p>
      </div>

      {/* Three principles: left, center, right */}
      <ul className="mt-gutter grid gap-2 text-[0.7rem] font-normal leading-[1.05] tracking-[-0.03em] md:flex md:justify-between md:gap-8 md:text-[max(0.65rem,0.95vw)]">
        {philosophy.principles.map((text) => (
          <li key={text} className="overflow-hidden pb-[0.08em] md:max-w-[28%]">
            <span data-line className="block">
              {text}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
