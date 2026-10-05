"use client";

import { useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { intro } from "@/config/site";
import { projects } from "@/data/projects";

type Pic = { src?: string; alt: string };

/** Two random photos from your projects, each from a different project. */
function pickTwo(): [Pic, Pic] {
  const [a, b] = [...projects].sort(() => Math.random() - 0.5);
  const rand = (images: string[]) =>
    images[Math.floor(Math.random() * images.length)];
  return [
    { src: rand(a.images), alt: "" },
    { src: rand(b.images), alt: "" },
  ];
}

let picked: [Pic, Pic] | null = null;
const subscribe = () => () => {};
const getPics = () => (picked ??= pickTwo());
const getServerPics = () => null;

/** Image slot: the real photo once `src` is set, a clay block until then. */
function Slot({
  pic,
  sizes,
  className,
  speed = 8,
}: {
  pic: Pic;
  sizes: string;
  className: string;
  /** Parallax travel in % (the image drifts -speed to +speed while scrolling) */
  speed?: number;
}) {
  return (
    <div
      data-reveal
      className={`relative overflow-hidden bg-[#ab7653] ${className}`}
    >
      {pic.src && (
        // Taller than the frame (130%, centered) so it can drift without
        // ever showing an empty edge. The frame clips it.
        <div
          data-parallax
          data-speed={speed}
          className="absolute inset-x-0 -top-[15%] h-[130%]"
        >
          <Image
            data-img
            src={pic.src}
            alt={pic.alt}
            fill
            quality={100}
            sizes={sizes}
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}

/**
 * Introduction (#about). Comes right after Selected Work on the same cream
 * background. Desktop: big image on the left, text + small image stacked on
 * the right. The left image starts level with the lead paragraph and ends
 * level with the caption. Mobile: everything stacks in reading order.
 */
export default function Introduction() {
  const root = useRef<HTMLElement>(null);

  // Random photos are client-only: the server snapshot is null (clay
  // placeholder), so server and client HTML match, then React swaps in the
  // picked photos after hydration. Same pick for the whole page visit.
  const pics = useSyncExternalStore(subscribe, getPics, getServerPics);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power4.out" },
          scrollTrigger: {
            trigger: root.current,
            start: "top 65%",
            once: true,
          },
        });
        // Text rises from below a clipped edge, no fade (same as the hero).
        // The images have no intro animation: they just sit there and
        // drift with the parallax below.
        tl.from(
          "[data-line]",
          { yPercent: 110, duration: 1.2, stagger: 0.1 },
          0,
        );

        // Parallax: each image drifts slowly against the scroll while its
        // frame is on screen. Scrubbed, so it follows Lenis exactly.
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const speed = Number(el.dataset.speed ?? 8);
          gsap.fromTo(
            el,
            { yPercent: -speed },
            {
              yPercent: speed,
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
    // Re-run once the photos are in, so the parallax can find them.
    // revertOnUpdate is required: without it the first run's hidden "from"
    // state is never undone, and the second run animates hidden -> hidden.
    { scope: root, dependencies: [pics], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      id="about"
      aria-labelledby="intro-title"
      className="relative z-10 bg-cream px-gutter pb-gutter pt-20 text-ink md:pt-24"
    >
      <div className="grid gap-gutter md:grid-cols-2 md:grid-rows-[auto_auto_auto_auto]">
        {/* Heading: top left, left aligned */}
        <h2
          id="intro-title"
          className="overflow-hidden pb-[0.08em] text-left text-[clamp(1.5rem,6.4vw,2.5rem)] font-light uppercase leading-[0.95] tracking-[-0.06em] md:col-start-1 md:row-start-1 md:text-[3.2vw]"
        >
          <span data-line className="block whitespace-nowrap">
            {intro.headline}
          </span>
        </h2>

        {/* Lead */}
        <p className="overflow-hidden pb-[0.08em] text-[clamp(1rem,4.4vw,1.5rem)] font-normal uppercase leading-[1] tracking-[-0.045em] md:col-start-2 md:row-start-2 md:text-[1.7vw]">
          <span data-line className="block">
            {intro.lead}
          </span>
        </p>

        {/* Large image: spans lead -> caption on desktop */}
        <Slot
          pic={pics?.[0] ?? { alt: "" }}
          speed={8}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="aspect-square md:col-start-1 md:row-span-3 md:row-start-2 md:aspect-auto md:h-full"
        />

        {/* Small image */}
        <Slot
          pic={pics?.[1] ?? { alt: "" }}
          speed={11}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="aspect-[3/2] md:col-start-2 md:row-start-3"
        />

        {/* Caption */}
        <p className="overflow-hidden pb-[0.08em] text-[0.7rem] font-normal uppercase leading-[1.05] tracking-[-0.03em] md:col-start-2 md:row-start-4 md:text-[max(0.65rem,0.95vw)]">
          <span data-line className="block">
            {intro.caption}
          </span>
        </p>
      </div>
    </section>
  );
}
