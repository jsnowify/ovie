"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "@/components/ui/AheadImage";
import { gsap, useGSAP } from "@/lib/gsap";
import { about } from "@/config/site";
import { projects } from "@/data/projects";

// Photo for the square: a different project and shot from the Philosophy
// image. Change the index to use another project.
const source = projects[2] ?? projects[0];
const photo = source.images[(source.cover + 2) % source.images.length];

/**
 * About (#about). Label top left, three short paragraphs on the right, and a
 * square photo lower left, pushed in from the edge.
 * Mobile order: label, text, photo.
 */
export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Text rises from below a clipped edge, same as the other sections.
        gsap.from("[data-line]", {
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
      id="about"
      aria-labelledby="about-label"
      className="relative z-10 bg-cream px-gutter pb-16 pt-20 text-ink md:pb-24 md:pt-24"
    >
      <div className="flex flex-col gap-gutter md:grid md:grid-cols-[53fr_47fr] md:gap-0">
        {/* On mobile this wrapper disappears so label / text / photo can be
            ordered freely; on desktop it is the left column. */}
        <div className="contents md:block">
          <h2
            id="about-label"
            className="order-1 overflow-hidden pb-[0.08em] text-[0.7rem] font-normal uppercase leading-[1.05] tracking-[-0.03em] md:text-[max(0.65rem,0.95vw)]"
          >
            <span data-line className="block">
              {about.label}
            </span>
          </h2>

          <div
            data-frame
            className="relative order-3 mt-6 aspect-square w-[60%] self-end overflow-hidden bg-[#ab7653] md:ml-[16vw] md:mt-[16vw] md:w-[17vw]"
          >
            <div
              data-parallax
              className="absolute inset-x-0 -top-[10%] h-[120%]"
            >
              <Image
                src={photo}
                alt=""
                fill
                quality={100}
                // The frame is small, but the photo inside is 120% tall for the
                // parallax (object-cover zooms it ~20%) and phones are 2-3x
                // density. Asking for 40vw gives the browser a sharp source.
                sizes="(min-width: 768px) 40vw, 80vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Paragraphs: the gap between them is one line */}
        <div className="order-2 flex flex-col gap-[1em] text-[clamp(1rem,4.4vw,1.5rem)] font-normal leading-[1] tracking-[-0.045em] md:text-[1.6vw]">
          {about.paragraphs.map((text) => (
            <p key={text} className="overflow-hidden pb-[0.08em]">
              <span data-line className="block">
                {text}
              </span>
            </p>
          ))}
          <Link href="/about/" className="mt-6 w-fit border-b border-ink/40 pb-2 text-sm tracking-normal transition-colors hover:text-clay">About the studio <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </section>
  );
}
