"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMutedVideo } from "@/hooks/useMutedVideo";
import { hero } from "@/config/site";
import { useLoader } from "@/providers/LoaderProvider";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useMutedVideo(video);
  const { ready } = useLoader();

  useGSAP(
    () => {
      if (!ready) return; // wait for the loader
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from(
          "[data-video]",
          { scale: 1.12, duration: 2.4, ease: "power3.out" },
          0,
        )
          .from(
            "[data-line]",
            { yPercent: 110, duration: 1.2, stagger: 0.12 },
            0.3,
          )
          // No fade: they rise up from below the edge of the hero (clipped by overflow-hidden).
          .from(
            "[data-rise]",
            { yPercent: 300, duration: 1.1, stagger: 0.1 },
            0.9,
          );

        // While the Selected Work panel slides up over the (sticky) hero, the hero
        // drifts up a little and dims, so the panel feels like it lands on top of it.
        const works = document.getElementById("works");
        if (works) {
          const scrollTrigger = {
            trigger: works,
            start: "top bottom",
            end: "top top",
            scrub: true,
          };
          gsap.to("[data-hero-inner]", {
            yPercent: -10,
            ease: "none",
            scrollTrigger,
          });
          gsap.to("[data-hero-dim]", {
            opacity: 0.7,
            ease: "none",
            scrollTrigger,
          });
        }
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section
      ref={root}
      className="sticky top-0 h-svh w-full overflow-hidden bg-ink text-cream"
    >
      <div data-hero-inner className="absolute inset-0">
        <video
          ref={video}
          data-video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src={hero.video.webm} type="video/webm" />
          <source src={hero.video.mp4} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-ink/50" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30"
          aria-hidden="true"
        />

        <div className="absolute inset-0 z-10 flex items-center justify-center px-gutter">
          <h1 className="text-center text-[clamp(2rem,4.6vw,4.75rem)] font-medium uppercase leading-[0.95] tracking-[-0.05em]">
            {hero.headline.map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <span data-line className="block">
                  {line}
                </span>
              </span>
            ))}
          </h1>
        </div>

        <p
          data-rise
          className="absolute bottom-6 left-gutter z-10 max-w-[19rem] text-[0.8rem] font-normal uppercase leading-[1.05] tracking-[-0.03em] md:bottom-8 md:text-sm"
        >
          {hero.description}
        </p>
      </div>
      <div
        data-hero-dim
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-ink opacity-0"
      />
    </section>
  );
}
