"use client";

import { useRef } from "react";
import Image from "@/components/ui/AheadImage";
import { gsap, useGSAP } from "@/lib/gsap";
import { approach } from "@/config/site";
import { projects } from "@/data/projects";

// One photo per step, each from a different project (not the cover shot, so
// it does not repeat what Selected Work already shows).
const photos = approach.steps.map((_, i) => {
  const p = projects[i % projects.length];
  return p.images[(p.cover + 1) % p.images.length];
});

/**
 * Approach. Title row, then a 2x2 grid of outlined cells.
 * Left cells: image on the left, text on the right.
 * Right cells: text on the left, image on the right.
 * On mobile the cells stack: text first, image below.
 */
export default function Approach() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Title row
        gsap.from("[data-head] [data-line]", {
          yPercent: 110,
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 65%",
            once: true,
          },
        });

        // Each cell animates when it reaches the screen (the lower row is
        // off screen at first, so one trigger for all would play unseen).
        gsap.utils.toArray<HTMLElement>("[data-cell]").forEach((cell) => {
          gsap.from(cell.querySelectorAll("[data-line]"), {
            yPercent: 110,
            duration: 1.2,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: { trigger: cell, start: "top 80%", once: true },
          });
        });

        // Parallax: each photo drifts slowly against the scroll while its
        // frame is on screen. Scrubbed, so it follows Lenis exactly.
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="approach"
      aria-labelledby="approach-title"
      className="relative z-10 bg-clay px-gutter pb-16 pt-20 md:pb-24 text-cream md:pt-24"
    >
      {/* Tagline on the left, title on the right */}
      <div
        data-head
        className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
      >
        <p className="overflow-hidden pb-[0.08em] text-[0.7rem] font-normal leading-[1.05] tracking-[-0.03em] md:text-[max(0.65rem,0.95vw)]">
          <span data-line className="block">
            {approach.tagline}
          </span>
        </p>
        <h2
          id="approach-title"
          className="overflow-hidden pb-[0.08em] text-[clamp(2.5rem,13vw,4rem)] font-light uppercase leading-[0.95] tracking-[-0.06em] md:text-[5vw]"
        >
          <span data-line className="block whitespace-nowrap">
            {approach.title}
          </span>
        </h2>
      </div>

      <ol className="mt-gutter grid gap-gutter md:grid-cols-2 md:gap-x-0">
        {approach.steps.map((step, i) => {
          const isLeft = i % 2 === 0;
          return (
            <li
              key={step.number}
              data-cell
              // DOM order is always text then image. Left cells flip it on
              // desktop so the image sits on the left.
              className={`flex flex-col gap-gutter border border-cream/40 p-gutter md:h-[24vw] md:gap-[0.4vw] ${
                isLeft ? "md:flex-row-reverse" : "md:flex-row md:border-l-0"
              }`}
            >
              <div className="flex flex-1 flex-col">
                <h3 className="overflow-hidden pb-[0.08em] text-[clamp(1.75rem,9vw,2.75rem)] uppercase leading-[0.95] tracking-[-0.06em] md:text-[3.2vw]">
                  <span data-line className="block whitespace-nowrap">
                    <span className="font-light">{step.number}/</span>
                    <span className="font-semibold">{step.name}</span>
                  </span>
                </h3>
                <p className="mt-3 overflow-hidden pb-[0.08em] text-[0.7rem] font-normal leading-[1.05] tracking-[-0.03em] md:mt-[5vw] md:pl-[1.5vw] md:pr-[1vw] md:text-[max(0.65rem,0.95vw)]">
                  <span data-line className="block">
                    {step.text}
                  </span>
                </p>
              </div>

              <div className="relative aspect-[5/4] w-full overflow-hidden bg-[#ab7653] md:w-[43%] md:flex-none md:self-end">
                {/* Taller than the frame so it can drift without showing an
                    empty edge. The frame clips it. */}
                <div
                  data-parallax
                  className="absolute inset-x-0 -top-[12%] h-[124%]"
                >
                  <Image
                    src={photos[i]}
                    alt=""
                    fill
                    quality={90}
                    sizes="(min-width: 768px) 22vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
