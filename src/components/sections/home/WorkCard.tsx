"use client";

import { useRef } from "react";
import Image, { getImageProps } from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import RollText from "@/components/ui/RollText";
import { useFitText } from "@/hooks/useFitText";
import { useCaseStudy } from "@/providers/CaseStudyProvider";
import type { Project } from "@/data/projects";

/** Parallax travel in % (the image drifts -PARALLAX to +PARALLAX while scrolling) */
const PARALLAX = 8;

export default function WorkCard({ project }: { project: Project }) {
  const ref = useRef<HTMLButtonElement>(null);
  const titleBox = useRef<HTMLHeadingElement>(null);
  const titleText = useRef<HTMLSpanElement>(null);
  useFitText(titleBox, titleText);
  const { open } = useCaseStudy();
  const warmed = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  // Parallax: the picture drifts slowly against the scroll while the card is
  // on screen. Scrubbed, so it follows Lenis exactly. Same idea as the
  // Introduction images.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-parallax]",
          { yPercent: -PARALLAX },
          {
            yPercent: PARALLAX,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  // Start downloading the full-screen cover before the click, so it's already
  // sharp when the work expands. Same props as the case study's cover (same
  // srcset), so the browser reuses this download. No quality change.
  const warm = () => {
    if (warmed.current) return;
    warmed.current = true;
    const { props } = getImageProps({
      src: project.images[project.cover],
      alt: "",
      fill: true,
      quality: 100,
      sizes: "100vw",
    });
    const img = new window.Image();
    img.sizes = "100vw";
    img.srcset = props.srcSet ?? "";
    img.src = props.src;
  };

  return (
    <button
      ref={ref}
      data-project-id={project.id}
      type="button"
      aria-haspopup="dialog"
      onClick={() => ref.current && open(project, ref.current)}
      onPointerEnter={() => {
        timer.current = window.setTimeout(warm, 150); // only if it dwells, not on a sweep
      }}
      onPointerLeave={() => window.clearTimeout(timer.current)}
      onPointerDown={warm}
      onFocus={warm}
      className="work-link group/roll relative block aspect-[4/3] w-full overflow-hidden bg-ink/10 text-left md:aspect-[4/5]"
    >
      {/* Taller than the card (130%, centered) so it can drift without ever
          showing an empty edge. The card clips it. */}
      <div data-parallax className="absolute inset-x-0 -top-[15%] h-[130%]">
        <Image
          src={project.images[project.cover]}
          alt=""
          fill
          quality={100}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      {/* Hovered work: dimmed */}
      <span
        aria-hidden="true"
        className="work-dim absolute inset-0 bg-ink/50"
      />

      {/* Title sits inside the image and only shows while this work is hovered */}
      <h3
        ref={titleBox}
        className="fit-title absolute inset-x-0 bottom-0 p-gutter font-light uppercase tracking-[-0.04em] text-cream"
      >
        {/* Measured by useFitText: shrinks the title if it's too long for the card */}
        <span ref={titleText} className="inline-block">
          <RollText reveal underline className="leading-[1.1]">
            {project.title}
          </RollText>
        </span>
      </h3>

      {/* Other works while one is hovered: blurred (kept last so it also blurs the title) */}
      <span
        aria-hidden="true"
        className="work-blur pointer-events-none absolute inset-0"
      />
    </button>
  );
}
