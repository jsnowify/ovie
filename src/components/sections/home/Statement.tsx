"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const lines = [
  "We do not design around trends.",
  "We design for place, purpose, and permanence.",
];

const principles = [
  "Architecture should age.",
  "Materials should change.",
  "Spaces should be lived in.",
];

// Where each square sits. Desktop is a zig-zag on 3 columns (01 and 03 on the
// top row, 02 one row down in the middle), so the squares only touch at the
// corners. Mobile uses the same zig-zag on 2 columns.
const placement = [
  "col-start-1 row-start-1",
  "col-start-2 row-start-2",
  "col-start-1 row-start-3 md:col-start-3 md:row-start-1",
];

const FILL_SECONDS = 0.9;

type Cell = {
  li: HTMLElement | null;
  fill: HTMLElement | null;
  state: "idle" | "rising" | "filled" | "draining";
  hovering: boolean;
};

/**
 * Statement (#statement). Label top left and two lines top right, then three
 * outlined squares in a zig-zag, each with a big number and a short principle.
 */
export default function Statement() {
  const root = useRef<HTMLElement>(null);

  // Hover fill, one small state machine per square. A CSS hover would reverse
  // the moment the cursor leaves. Here, once a fill starts it ALWAYS finishes
  // rising, and only then drains out the top (if the cursor has left by then).
  //   idle -> rising -> filled (cursor still there) -> draining -> idle
  const cells = useRef<Cell[]>(
    principles.map(() => ({
      li: null,
      fill: null,
      state: "idle",
      hovering: false,
    })),
  );

  const seconds = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : FILL_SECONDS;

  const rise = (c: Cell) => {
    if (!c.fill || !c.li) return;
    c.state = "rising";
    c.li.dataset.filled = "true";
    gsap.fromTo(
      c.fill,
      { scaleY: 0, transformOrigin: "50% 100%" }, // grows from the bottom edge
      {
        scaleY: 1,
        duration: seconds(),
        ease: "expo.inOut",
        overwrite: true,
        onComplete: () => {
          if (c.hovering) c.state = "filled";
          else drain(c);
        },
      },
    );
  };

  const drain = (c: Cell) => {
    if (!c.fill || !c.li) return;
    c.state = "draining";
    c.li.dataset.filled = "false";
    gsap.fromTo(
      c.fill,
      { scaleY: 1, transformOrigin: "50% 0%" }, // shrinks toward the top edge
      {
        scaleY: 0,
        duration: seconds(),
        ease: "expo.inOut",
        overwrite: true,
        onComplete: () => {
          c.state = "idle";
          if (c.hovering) rise(c); // cursor came back while it was draining
        },
      },
    );
  };

  const onEnter = (i: number) => {
    const c = cells.current[i];
    c.hovering = true;
    if (c.state === "idle") rise(c);
  };

  const onLeave = (i: number) => {
    const c = cells.current[i];
    c.hovering = false;
    if (c.state === "filled") drain(c);
    // If it is still rising, onComplete above drains it afterwards.
  };

  useEffect(() => {
    const list = cells.current;
    return () => {
      list.forEach((c) => c.fill && gsap.killTweensOf(c.fill));
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Top row
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

        // Each square animates when it reaches the screen (they sit at
        // different heights, so one trigger for all would play unseen).
        gsap.utils.toArray<HTMLElement>("[data-cell]").forEach((cell) => {
          gsap.from(cell.querySelectorAll("[data-line]"), {
            yPercent: 110,
            duration: 1.2,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: { trigger: cell, start: "top 85%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="statement"
      aria-labelledby="statement-title"
      className="relative z-10 scroll-mt-20 bg-cream px-gutter pb-16 pt-20 text-ink md:pb-24 md:pt-24"
    >
      {/* Label on the left, the two lines start where the third square does */}
      <div
        data-head
        className="flex flex-col gap-6 md:grid md:grid-cols-[53.8vw_1fr] md:gap-0"
      >
        <h2
          id="statement-title"
          className="overflow-hidden pb-[0.08em] text-[0.7rem] font-normal uppercase leading-[1.05] tracking-[-0.03em] md:text-[max(0.65rem,0.95vw)]"
        >
          <span data-line className="block">
            Statement
          </span>
        </h2>

        <div className="text-[clamp(1rem,4.4vw,1.5rem)] font-normal leading-[1.55] tracking-[-0.045em] md:text-[1.5vw]">
          {lines.map((line) => (
            <p key={line} className="overflow-hidden pb-[0.08em]">
              <span data-line className="block">
                {line}
              </span>
            </p>
          ))}
        </div>
      </div>

      <ol className="mt-10 grid grid-cols-2 md:ml-[5.8vw] md:mt-[4vw] md:w-[72vw] md:grid-cols-3">
        {principles.map((principle, i) => (
          <li
            key={principle}
            data-cell
            ref={(el) => {
              cells.current[i].li = el;
            }}
            onMouseEnter={() => onEnter(i)}
            onMouseLeave={() => onLeave(i)}
            className={`relative flex aspect-square items-center justify-center border border-clay text-ink transition-colors duration-300 data-[filled=true]:text-cream data-[filled=true]:delay-[350ms] ${placement[i]}`}
          >
            {/* The clay fill. GSAP drives it (not Tailwind scale classes, which
                would fight GSAP's transform). Starts collapsed. */}
            <span
              aria-hidden="true"
              ref={(el) => {
                cells.current[i].fill = el;
              }}
              style={{ transform: "scaleY(0)", transformOrigin: "50% 100%" }}
              className="absolute inset-0 bg-clay"
            />

            <p className="relative overflow-hidden pb-[0.08em] text-[clamp(2.5rem,13vw,4rem)] font-light leading-[1] tracking-[-0.06em] md:text-[5vw]">
              <span data-line className="block">
                {String(i + 1).padStart(2, "0")}
              </span>
            </p>

            <p className="absolute inset-x-0 bottom-[8%] overflow-hidden px-3 pb-[0.08em] text-center text-[0.75rem] font-normal leading-[1.1] tracking-[-0.03em] md:text-[1.45vw]">
              <span data-line className="block">
                {principle}
              </span>
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
