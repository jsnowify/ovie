"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLenis } from "@/providers/SmoothScroll";
import { useFitText } from "@/hooks/useFitText";
import { designProcess, type Project } from "@/data/projects";

// Same `sizes` as the card in Selected Work, so the browser already has this image.
const CARD_SIZES = "(min-width: 768px) 50vw, 100vw";

// Measure the actual image box, including the card's current parallax transform.
// Ratios stay correct as the outer rectangle changes size during the morph.
function measureOrigin(origin: HTMLElement) {
  const rect = origin.getBoundingClientRect();
  const image = origin.querySelector<HTMLElement>("[data-parallax]");
  const imageRect = image?.getBoundingClientRect() ?? rect;
  return {
    rect,
    imageTop: ((imageRect.top - rect.top) / rect.height) * 100,
    imageHeight: (imageRect.height / rect.height) * 100,
  };
}

/** sessionStorage key for how far this case study is scrolled (survives a refresh). */
export const scrollKey = (id: string) => `case-study-scroll:${id}`;

type Props = {
  project: Project;
  origin: HTMLElement;
  onClosed: () => void;
  /** Open straight to the finished state, no expand animation (used after a refresh) */
  instant?: boolean;
  /** Scroll position to start at (used after a refresh) */
  initialScroll?: number;
};

/**
 * Opening: the clicked work expands from its own spot to fill the screen,
 * then the case study panel slides up over it (same idea as Selected Work
 * covering the hero). Closing plays the same thing backwards.
 */
export default function CaseStudy({
  project,
  origin,
  onClosed,
  instant = false,
  initialScroll = 0,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const expander = useRef<HTMLDivElement>(null);
  const expandingImage = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const titleBox = useRef<HTMLDivElement>(null);
  const titleText = useRef<HTMLSpanElement>(null);
  // Same fitted size as the card it grows from. Fitted once (live: false), so the
  // size does not change while the picture expands to full screen.
  useFitText(titleBox, titleText, { live: false });
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opened = useRef(false);
  const closing = useRef(false);
  const processList = useRef<HTMLOListElement>(null);
  // Set by the parallax effect below. Called once the panel has landed, because
  // the images were still sliding in (transformed) when it first measured.
  const updateParallax = useRef<() => void>(() => {});
  const lenisRef = useLenis();

  const [initialGeometry] = useState(() => measureOrigin(origin));
  const { rect } = initialGeometry;
  const [light, setLight] = useState(false); // close button over the cream panel
  const [showMedia, setShowMedia] = useState(false);
  // Sharp cover loaded. Shared by the expanding picture and the scroller, so
  // both always show the exact same frame (no sharpness pop when they swap).
  const [hiRes, setHiRes] = useState(false);
  // Was the card showing its hover look (dim + title) when it was clicked?
  // On touch it isn't, so the expanding picture must start clean too.
  const [hovered] = useState(
    () =>
      !instant &&
      window.matchMedia("(hover: hover)").matches &&
      origin.matches(":hover, :focus-visible"),
  );

  const cover = project.images[project.cover];
  const rest = project.images.filter((_, i) => i !== project.cover);
  // The gallery is split in two, with the narrative in between.
  const half = Math.ceil(rest.length / 2);
  const galleryA = rest.slice(0, half);
  const galleryB = rest.slice(half);

  // Lock before measuring the transition: removing the scrollbar can change
  // the card's width and position. Restore it only after the handoff finishes.
  useLayoutEffect(() => {
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    const previousGutter = html.style.scrollbarGutter;
    html.style.scrollbarGutter = "stable";
    html.style.overflow = "hidden";
    lenisRef.current?.stop();
    return () => {
      html.style.overflow = previousOverflow;
      html.style.scrollbarGutter = previousGutter;
    };
  }, [lenisRef]);

  const { contextSafe } = useGSAP(
    () => {
      const vw = root.current!.clientWidth;
      const vh = root.current!.clientHeight;
      const start = measureOrigin(origin);
      gsap.set(expander.current, {
        top: start.rect.top,
        left: start.rect.left,
        width: start.rect.width,
        height: start.rect.height,
      });
      gsap.set(expandingImage.current, {
        top: `${start.imageTop}%`,
        height: `${start.imageHeight}%`,
      });
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const tl = gsap.timeline({
        onComplete: () => {
          opened.current = true;
          if (panel.current) panel.current.style.willChange = "auto";
          setShowMedia(true);
          closeBtn.current?.focus({ preventScroll: true });
          updateParallax.current();
        },
      });

      if (reduce || instant) {
        tl.set(expander.current, { autoAlpha: 0 }).set(scroller.current, {
          autoAlpha: 1,
        });
        return;
      }

      gsap.set(panel.current, { willChange: "transform" });

      // Only clear the dim + title if the card was actually showing them.
      if (hovered) {
        tl.to(
          "[data-a-title]",
          { autoAlpha: 0, duration: 0.3, ease: "power2.out" },
          0,
        ).to(
          "[data-a-dim]",
          { opacity: 0, duration: 0.9, ease: "power2.out" },
          0,
        );
      }

      tl
        // 1. The work expands to fill the screen.
        .to(
          expander.current,
          {
            top: 0,
            left: 0,
            width: vw,
            height: vh,
            duration: 1,
            ease: "power4.inOut",
          },
          0,
        )
        .to(expandingImage.current, {
          top: "0%",
          height: "100%",
          duration: 1,
          ease: "power4.inOut",
        }, 0)
        // 2. Swap to the scrollable version (identical picture), then slide the panel up.
        .set(scroller.current, { autoAlpha: 1 })
        .set(expander.current, { autoAlpha: 0 })
        .fromTo(
          panel.current,
          { y: vh },
          { y: 0, duration: 1, ease: "power3.out" },
        )
        .from(
          "[data-cs-line]",
          { yPercent: 110, duration: 1, ease: "power3.out", stagger: 0.1 },
          "<0.3",
        )
        .from(
          closeBtn.current,
          { yPercent: -200, duration: 0.9, ease: "power3.out" },
          "<",
        );
    },
    { scope: root },
  );

  // Back to where the reader was after a refresh. Runs before the first paint.
  useLayoutEffect(() => {
    if (initialScroll > 0 && scroller.current) {
      scroller.current.scrollTop = initialScroll;
    }
  }, [initialScroll]);

  const close = contextSafe(() => {
    if (!opened.current || closing.current) return;
    closing.current = true;
    root.current?.querySelectorAll("video").forEach((video) => video.pause());

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      onClosed();
      return;
    }

    const sc = scroller.current!;
    let destination = measureOrigin(origin);
    gsap.set(panel.current, { willChange: "transform" });
    gsap.killTweensOf(sc); // stop any smooth-scroll tween before we drive scrollTop
    const tl = gsap.timeline({ onComplete: onClosed });
    if (sc.scrollTop > 0) {
      tl.to(sc, {
        scrollTop: 0,
        duration: Math.min(0.6, sc.scrollTop / 2000 + 0.2),
        ease: "power2.inOut",
      });
    }
    tl.to(
      closeBtn.current,
      { yPercent: -200, duration: 0.5, ease: "power3.in" },
      "<",
    )
      .to(panel.current, {
        y: () => root.current!.clientHeight,
        duration: 0.85,
        ease: "power3.inOut",
      })
      // Back to the expanding picture, then shrink it onto the work.
      .call(() => {
        // Read at the actual shrink phase, after scroll return and panel exit.
        destination = measureOrigin(origin);
        gsap.set(expandingImage.current, { top: "0%", height: "100%" });
        gsap.set("[data-cs-cover]", { scale: 1 });
      })
      .set(expander.current, {
        autoAlpha: 1,
        top: 0,
        left: 0,
        width: () => root.current!.clientWidth,
        height: () => root.current!.clientHeight,
      })
      .set(scroller.current, { autoAlpha: 0 })
      .to(expander.current, {
        top: () => destination.rect.top,
        left: () => destination.rect.left,
        width: () => destination.rect.width,
        height: () => destination.rect.height,
        duration: 1,
        ease: "power4.inOut",
      }, "shrink")
      .to(expandingImage.current, {
        top: () => `${destination.imageTop}%`,
        height: () => `${destination.imageHeight}%`,
        duration: 1,
        ease: "power4.inOut",
      }, "shrink")
      // Blend into the real card at the end, including its live hover treatment.
      .to(expander.current, { opacity: 0, duration: 0.15, ease: "power1.inOut" });
  });

  // Lock the page behind the overlay. It's fully covered, so also pause its
  // videos (the hero) instead of decoding them for nothing; resume on close.
  useEffect(() => {
    const paused: HTMLVideoElement[] = [];
    document.querySelectorAll("video").forEach((v) => {
      if (!root.current?.contains(v) && !v.paused) {
        v.pause();
        paused.push(v);
      }
    });

    return () => {
      // Read on purpose at cleanup time: Lenis is not a DOM node.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      lenisRef.current?.start();
      paused.forEach((v) => v.play().catch(() => {}));
    };
  }, [lenisRef]);

  // Smooth wheel scrolling for the panel. The page's Lenis is stopped while
  // this is open (and ignores this panel), so give the panel the same
  // eased feel. Touch, keyboard and pinch-zoom stay native.
  useEffect(() => {
    const sc = scroller.current;
    if (!sc) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const to = gsap.quickTo(sc, "scrollTop", {
      duration: 0.9,
      ease: "power3.out",
    });
    let target = sc.scrollTop;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.deltaY === 0 || !opened.current) return;
      e.preventDefault();
      if (closing.current) return;
      const unit =
        e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? sc.clientHeight : 1;
      const from = to.tween?.isActive() ? target : sc.scrollTop;
      target = Math.max(
        0,
        Math.min(sc.scrollHeight - sc.clientHeight, from + e.deltaY * unit),
      );
      to(target);
    };

    sc.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      sc.removeEventListener("wheel", onWheel);
      gsap.killTweensOf(sc);
    };
  }, []);

  // Keep synchronous storage work out of the scroll loop, but flush before
  // refresh/backgrounding so restoration still uses the latest position.
  useEffect(() => {
    const sc = scroller.current;
    if (!sc) return;
    let timer: number | undefined;
    let frame = 0;
    let isLight = false;
    const save = () => {
      window.clearTimeout(timer);
      timer = undefined;
      if (closing.current) return;
      try {
        sessionStorage.setItem(scrollKey(project.id), String(Math.round(sc.scrollTop)));
      } catch {}
    };
    const update = () => {
      frame = 0;
      const next = sc.scrollTop > panel.current!.offsetTop - 56;
      if (next !== isLight) {
        isLight = next;
        setLight(next);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
      // At most one write per 250ms, even during continuous scrolling.
      if (timer === undefined) timer = window.setTimeout(save, 250);
    };
    sc.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", save);
    document.addEventListener("visibilitychange", save);
    update();
    return () => {
      save();
      cancelAnimationFrame(frame);
      sc.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", save);
      document.removeEventListener("visibilitychange", save);
    };
  }, [project.id]);

  // Parallax. The panel scrolls natively (not window), so this can't use
  // ScrollTrigger; it reads each frame's real position instead.
  //  - gallery images drift against the scroll while their frame is on screen
  //  - the pinned cover slowly zooms while the panel slides over it
  // Performance: scroll events only schedule ONE frame; inside it all reads
  // happen before all writes (no layout thrash), and only frames that are
  // actually near the screen are touched.
  useEffect(() => {
    const sc = scroller.current;
    if (!sc) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(
      sc.querySelectorAll<HTMLElement>("[data-cs-parallax]"),
    );
    const cover = sc.querySelector<HTMLElement>("[data-cs-cover]");
    const near = new Set<HTMLElement>();
    const byFrame = new Map<Element, HTMLElement>();
    const geometry = new Map<HTMLElement, { top: number; height: number; speed: number }>();
    let raf = 0;
    let coverProgress = -1;
    let all = true; // next frame: refresh every image (first run, resize)

    const run = () => {
      raf = 0;
      const vh = sc.clientHeight;
      if (!opened.current) return;
      const scrollTop = sc.scrollTop;
      if (all) {
        const scTop = sc.getBoundingClientRect().top;
        for (const el of items) {
          const bounds = el.parentElement!.getBoundingClientRect();
          geometry.set(el, {
            top: bounds.top - scTop + scrollTop,
            height: bounds.height,
            speed: Number(el.dataset.speed ?? 8),
          });
        }
      }
      // Keep the cover zoom following scrollTop during the return-to-top;
      // gallery work can stop as soon as closing starts.
      const list = closing.current ? [] : Array.from(near);
      all = false;

      // 1. read
      list.forEach((el) => {
        const bounds = geometry.get(el);
        if (!bounds) return;
        const { height, speed } = bounds;
        const top = bounds.top - scrollTop;
        const p = Math.min(1, Math.max(0, (vh - top) / (vh + height)));
        el.style.transform = `translate3d(0, ${(p - 0.5) * 2 * speed}%, 0)`;
      });

      // Cover: scale 1 (identical to the expanding picture) -> 1.08 over the
      // first screen of scrolling.
      if (cover) {
        const t = Math.min(1, sc.scrollTop / vh);
        if (t !== coverProgress) {
          coverProgress = t;
          cover.style.transform = t > 0 ? `scale(${1 + t * 0.08})` : "";
          cover.style.willChange = t < 1 ? "transform" : "auto";
        }
      }
    };
    const schedule = (refreshAll = false) => {
      if (refreshAll) all = true;
      if (!raf) raf = requestAnimationFrame(run);
    };

    // Which frames are near the screen right now (a little margin so the
    // drift is already correct when they scroll in).
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = byFrame.get(e.target);
          if (!el) continue;
          if (e.isIntersecting) {
            near.add(el);
            el.style.willChange = "transform";
          } else {
            near.delete(el);
            el.style.willChange = "auto";
          }
        }
        schedule();
      },
      { root: sc, rootMargin: "20% 0px" },
    );
    items.forEach((el) => {
      const frame = el.parentElement;
      if (!frame) return;
      byFrame.set(frame, el);
      io.observe(frame);
    });

    // Anything that changes the layout (fonts, resize, video mounting)
    // moves the frames, so refresh them all.
    const onResize = () => schedule(true);
    const ro = new ResizeObserver(onResize);
    if (panel.current) ro.observe(panel.current);
    window.addEventListener("resize", onResize);

    const onScroll = () => schedule();
    sc.addEventListener("scroll", onScroll, { passive: true });

    // Called once the panel has landed (it was still sliding in, transformed,
    // when this first measured).
    updateParallax.current = () => schedule(true);
    schedule(true);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      sc.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      updateParallax.current = () => {};
    };
  }, []);

  // Design Process numbers: each digit spins like a slot wheel and lands on its
  // number once the process row scrolls into view.
  useEffect(() => {
    const sc = scroller.current;
    const list = processList.current;
    if (!sc || !list) return;

    const digits = Array.from(
      list.querySelectorAll<HTMLElement>("[data-spin]"),
    );
    // GSAP calls function values as (index, target), so the element is the SECOND argument.
    const yFor = (_i: number, el: Element) =>
      -(Number((el as HTMLElement).dataset.to) / 20) * 100;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(digits, { yPercent: yFor });
      return;
    }

    let tween: gsap.core.Tween | null = null;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        tween = gsap.fromTo(
          digits,
          { yPercent: 0 },
          {
            yPercent: yFor,
            duration: 1.6,
            ease: "power4.out",
            stagger: 0.09,
          },
        );
      },
      { root: sc, threshold: 0.3 },
    );
    io.observe(list);
    return () => {
      io.disconnect();
      tween?.kill();
    };
  }, []);

  // Esc closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Project data sheet. Empty values are hidden.
  const facts = [
    ["Location", project.location],
    ["Year", project.year],
    ["Typology", project.type],
    ["Status", project.status],
    ["Lot area", project.lotArea],
    ["Gross floor area", project.area],
    ["Storeys", project.storeys],
    ["Client", project.client],
  ].filter(([, value]) => value);

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      className="fixed inset-0 z-[60]"
    >
      {/* A: the work, expanding from where it was clicked */}
      <div
        ref={expander}
        className="fixed z-20 overflow-hidden bg-ink [contain:layout_paint]"
        style={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        }}
      >
        <div
          ref={expandingImage}
          className="absolute inset-x-0"
          style={{ top: `${initialGeometry.imageTop}%`, height: `${initialGeometry.imageHeight}%` }}
        >
        <Image
          src={cover}
          alt=""
          fill
          priority
          quality={100}
          sizes={CARD_SIZES}
          className="object-cover"
        />
        <HiResCover
          src={cover}
          loaded={hiRes}
          onLoaded={() => setHiRes(true)}
        />
        </div>
        {/* Starts exactly like the hovered card (dimmed, with its title and
            underline), then clears. Hidden if the card wasn't hovered (touch). */}
        <div
          data-a-dim
          aria-hidden="true"
          style={hovered ? undefined : { visibility: "hidden" }}
          className="absolute inset-0 bg-ink/50"
        />
        <div
          ref={titleBox}
          data-a-title
          aria-hidden="true"
          style={hovered ? undefined : { visibility: "hidden" }}
          className="fit-title absolute inset-x-0 bottom-0 p-gutter font-light uppercase tracking-[-0.04em] text-cream"
        >
          {/* Same structure as the card's RollText (one box per character,
              underline at the bottom), so nothing shifts when they swap. */}
          <span ref={titleText} className="relative inline-flex leading-[1.1]">
            {Array.from(project.title).map((char, i) => (
              <span key={i} className="inline-block">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
            <span className="absolute inset-x-0 bottom-0 block h-[2px] bg-cream" />
          </span>
        </div>
      </div>

      {/* B: the scrollable case study. Cover stays pinned, the panel slides over it. */}
      <div
        ref={scroller}
        data-lenis-prevent
        className="invisible absolute inset-0 z-10 overflow-y-auto overscroll-contain bg-cream [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="sticky top-0 h-full w-full overflow-hidden bg-ink">
          {/* Wrapper so the cover can zoom (parallax) without touching the images */}
          <div data-cs-cover className="absolute inset-0 will-change-transform">
            <Image
              src={cover}
              alt=""
              fill
              sizes={CARD_SIZES}
              quality={100}
              className="object-cover"
            />
            <HiResCover
              src={cover}
              loaded={hiRes}
              onLoaded={() => setHiRes(true)}
            />
          </div>
        </div>

        <div
          ref={panel}
          className="relative z-10 -mt-[40svh] bg-cream px-gutter pb-gutter pt-10 text-ink shadow-[0_-24px_60px_rgba(0,0,0,0.3)] md:pt-16"
        >
          <h2 className="text-[clamp(3rem,10vw,10rem)] font-light uppercase leading-[0.9] tracking-[-0.06em]">
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-cs-line className="block">
                {project.title}
              </span>
            </span>
          </h2>

          <div className="mt-10 grid gap-10 md:mt-16 md:grid-cols-12">
            <p className="text-lg font-light leading-snug tracking-[-0.01em] md:col-span-5 md:text-2xl">
              {project.summary}
            </p>
            <dl className="grid grid-cols-2 gap-x-gutter gap-y-8 md:col-span-5 md:col-start-8">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs uppercase tracking-[-0.02em] text-ink/60">
                    {label}
                  </dt>
                  <dd className="mt-1 text-base font-light uppercase tracking-[-0.02em] md:text-lg">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-16 md:mt-28">
            {/* Space is reserved up front, so mounting the video never pushes the images down */}
            <div className="aspect-video w-full bg-ink/10">
              {showMedia && <CaseVideo video={project.video} />}
            </div>

            <Section label="Brief">
              <Prose>{project.brief}</Prose>
            </Section>
            <Section label="Site & Context">
              <Prose>{project.site}</Prose>
            </Section>
            <Section label="Concept">
              <Prose>{project.concept}</Prose>
            </Section>

            <Gallery images={galleryA} />

            <Section label="Design Response">
              <div className="grid gap-10">
                {[
                  ["Spatial planning", project.response.spatial],
                  ["Materials & tectonics", project.response.materials],
                  ["Climate response", project.response.climate],
                ].map(([heading, text]) => (
                  <div key={heading}>
                    <h4 className="text-base font-light uppercase tracking-[-0.02em] md:text-lg">
                      {heading}
                    </h4>
                    <div className="mt-2">
                      <Prose>{text}</Prose>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section label="Materials">
              <ul>
                {project.materials.map((m) => (
                  <li
                    key={m.name}
                    className="grid gap-1 border-b border-ink/15 py-4 first:pt-0 last:border-b-0 md:grid-cols-2 md:gap-gutter"
                  >
                    <span className="text-base font-light uppercase tracking-[-0.02em] md:text-lg">
                      {m.name}
                    </span>
                    <span className="text-base font-light tracking-[-0.01em] text-ink/70 md:text-lg">
                      {m.note}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>

            <Gallery images={galleryB} />

            <Section label="Design Process" wide>
              {/* Hierarchy: big clay number > uppercase phase title > muted text.
                  Below lg each step is a row (number left, text right); from lg
                  up the five steps sit side by side and stack their content. */}
              <ol
                ref={processList}
                className="grid gap-x-gutter lg:grid-cols-5"
              >
                {designProcess.map((step, i) => (
                  <li
                    key={step.phase}
                    className="grid grid-cols-[4.5rem_1fr] gap-x-gutter border-t border-ink py-6 lg:block lg:pb-0 lg:pt-4"
                  >
                    <span
                      aria-hidden="true"
                      className="block text-[clamp(2.5rem,4vw,4rem)] font-light leading-none tracking-[-0.06em] text-clay lg:mb-16"
                    >
                      <SpinNumber value={i + 1} />
                    </span>
                    <div>
                      <h4 className="text-lg font-light uppercase leading-tight tracking-[-0.03em] lg:min-h-[3.75em] lg:text-xl">
                        {step.phase}
                      </h4>
                      <p className="mt-3 text-base font-light leading-snug tracking-[-0.01em] text-ink/65 lg:mt-4 lg:text-sm">
                        {step.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Section>

            {project.drawings && project.drawings.length > 0 && (
              <Section label="Drawings" wide>
                <div className="grid gap-gutter md:grid-cols-2">
                  {project.drawings.map((d) => (
                    <figure key={d.src}>
                      <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
                        <Image
                          src={d.src}
                          alt={d.label}
                          fill
                          quality={100}
                          sizes={CARD_SIZES}
                          className="object-contain"
                        />
                      </div>
                      <figcaption className="mt-2 text-xs uppercase tracking-[-0.02em] text-ink/60">
                        {d.label}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </Section>
            )}

            <Section label="Credits">
              <dl className="grid grid-cols-2 gap-x-gutter gap-y-6">
                {project.credits
                  .filter((c) => c.name)
                  .map((c) => (
                    <div key={c.role}>
                      <dt className="text-xs uppercase tracking-[-0.02em] text-ink/60">
                        {c.role}
                      </dt>
                      <dd className="mt-1 text-base font-light uppercase tracking-[-0.02em] md:text-lg">
                        {c.name}
                      </dd>
                    </div>
                  ))}
              </dl>
            </Section>
          </div>
        </div>
      </div>

      {/* Close: same frosted glass as the menu button */}
      <button
        ref={closeBtn}
        type="button"
        aria-label="Close case study"
        onClick={close}
        className={`fixed right-gutter top-5 z-30 h-10 w-10 border border-current/20 bg-current/10 backdrop-blur-xl transition-colors duration-300 md:top-8 ${
          light ? "text-ink" : "text-cream"
        }`}
      >
        <span className="absolute left-1/2 top-1/2 block h-px w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
        <span className="absolute left-1/2 top-1/2 block h-px w-6 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
      </button>
    </div>
  );
}

/** A case study section: small label on the left, content on the right. */
function Section({
  label,
  wide = false,
  children,
}: {
  label: string;
  /** Full-width content (label on top) for the process and drawings */
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-gutter grid gap-x-gutter gap-y-6 border-t border-ink/15 py-12 md:grid-cols-12 md:py-20">
      <h3
        className={`text-xs uppercase tracking-[-0.02em] text-ink/60 ${
          wide ? "md:col-span-12" : "md:col-span-3"
        }`}
      >
        {label}
      </h3>
      <div className={wide ? "md:col-span-12" : "md:col-span-8 md:col-start-5"}>
        {children}
      </div>
    </section>
  );
}

/** Two-digit number whose digits are slot wheels. CaseStudy spins them (data-spin). */
function SpinNumber({ value }: { value: number }) {
  const digits = String(value).padStart(2, "0").split("").map(Number);
  return (
    <>
      {digits.map((d, i) => (
        <span
          key={i}
          className="inline-block h-[1em] overflow-hidden align-top leading-[1] tabular-nums"
        >
          {/* 0-9 twice: it rolls through a full turn, then lands on the digit */}
          <span
            data-spin
            data-to={d + 10}
            className="block will-change-transform"
          >
            {Array.from({ length: 20 }, (_, n) => (
              <span key={n} className="block h-[1em] leading-[1]">
                {n % 10}
              </span>
            ))}
          </span>
        </span>
      ))}
    </>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-lg font-light leading-snug tracking-[-0.01em] md:text-xl">
      {children}
    </p>
  );
}

/** Wide, tall, tall, wide... A lone last image is made wide so no gap is left. */
function Gallery({ images }: { images: string[] }) {
  return (
    <div className="mt-gutter grid grid-cols-2 gap-gutter">
      {images.map((src, i) => {
        const wide = i % 3 === 0 || (i === images.length - 1 && i % 3 === 1);
        return (
          <div
            key={src}
            className={`relative overflow-hidden bg-ink/10 ${
              wide ? "col-span-2 aspect-[16/9]" : "aspect-[4/5]"
            }`}
          >
            {/* Taller than the frame (130%, centered) so it can drift without
                showing an empty edge. The frame clips it. Each side has 15% of
                the frame spare = 11.5% of this box, so speed must stay under
                that. Tall images drift a bit more than wide ones, which gives
                the grid some depth. */}
            <div
              data-cs-parallax
              data-speed={wide ? 7 : 9}
              className="absolute inset-x-0 -top-[15%] h-[130%]"
            >
              <FadeImage src={src} sizes={wide ? "100vw" : CARD_SIZES} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Gallery picture that fades in once loaded, instead of popping in over the grey frame. */
function FadeImage({ src, sizes }: { src: string; sizes: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      ref={(img) => {
        // Already in the cache before React attached onLoad
        if (img?.complete) setLoaded(true);
      }}
      src={src}
      alt=""
      fill
      quality={100}
      sizes={sizes}
      onLoad={() => setLoaded(true)}
      className={`object-cover transition-opacity duration-700 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

/** Sharp full-screen version of the cover. It loads in over the cached one. */
function HiResCover({
  src,
  loaded,
  onLoaded,
}: {
  src: string;
  loaded: boolean;
  onLoaded: () => void;
}) {
  return (
    <Image
      src={src}
      alt=""
      fill
      priority
      quality={100}
      sizes="100vw"
      onLoad={(e) => {
        // Decode off the main thread first, so the fade never hitches.
        const img = e.currentTarget;
        img
          .decode()
          .catch(() => {})
          .then(onLoaded);
      }}
      className={`object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
    />
  );
}

function CaseVideo({ video }: { video: Project["video"] }) {
  const ref = useRef<HTMLVideoElement>(null);

  // Only decode while it's actually on screen (it sits below the fold).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.pause();
    };
  }, []);

  return (
    <video
      ref={ref}
      className="aspect-video w-full object-cover"
      preload="none"
      muted
      loop
      playsInline
    >
      <source src={video.webm} type="video/webm" />
      <source src={video.mp4} type="video/mp4" />
    </video>
  );
}
