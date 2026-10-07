"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "@/components/ui/AheadImage";
import { gsap, useGSAP } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import { services } from "@/data/services";

export default function Services() {
  const root = useRef<HTMLElement>(null);
  const layers = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const shownKey = useRef("0-0");
  const photoDirection = useRef<1 | -1>(1);
  const requestImage = useRef<((request: { key: string; ready: boolean; travel: 1 | -1 }) => void) | null>(null);
  const [active, setActive] = useState(0);
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [seen, setSeen] = useState<string[]>(["0-0", "0-1"]);
  const [loaded, setLoaded] = useState<string[]>([]);
  const service = services[active];
  const currentKey = `${active}-${slide}`;
  const imageReady = loaded.includes(currentKey);

  const select = (index: number) => {
    if (index === active) return;
    setDirection(index > active ? 1 : -1);
    photoDirection.current = index > active ? 1 : -1;
    setActive(index);
    setSlide(0);
    requestSlides(index, 0);
  };

  // Keep the next photo warm without downloading every hidden slide.
  const requestSlides = (serviceIndex: number, imageIndex: number) => {
    const count = services[serviceIndex].images.length;
    const keys = [`${serviceIndex}-${imageIndex}`, `${serviceIndex}-${(imageIndex + 1) % count}`];
    setSeen((previous) => {
      const additions = keys.filter((key) => !previous.includes(key));
      return additions.length ? [...previous, ...additions] : previous;
    });
  };

  const selectImage = (index: number, travel: 1 | -1 = index > slide ? 1 : -1) => {
    photoDirection.current = travel;
    setSlide(index);
    requestSlides(active, index);
  };

  const navigateTabs = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % services.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + services.length) % services.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = services.length - 1;
    else return;
    event.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  };

  // Finish each reveal, then use only the latest request. Rapid hover never
  // kills a half-revealed layer or builds a backlog of obsolete animations.
  useEffect(() => {
    const wrap = layers.current;
    if (!wrap) return;
    let pending: { key: string; ready: boolean; travel: 1 | -1 } | null = null;
    let timeline: gsap.core.Timeline | null = null;
    let disposed = false;

    const settle = (key: string) => {
      Array.from(wrap.children).forEach((layer) => {
        const selected = (layer as HTMLElement).dataset.slide === key;
        gsap.set(layer, {
          visibility: selected ? "visible" : "hidden",
          yPercent: 0,
          zIndex: selected ? 1 : 0,
          clipPath: "none",
        });
        gsap.set(layer.querySelector("[data-inner]"), { scale: 1, yPercent: 0 });
      });
    };

    const playLatest = () => {
      if (disposed || timeline || !pending?.ready || pending.key === shownKey.current) return;
      const { key, travel } = pending;
      const next = wrap.querySelector<HTMLElement>(`[data-slide="${key}"]`);
      if (!next) return;
      const inner = next.querySelector<HTMLElement>("[data-inner]");
      settle(shownKey.current);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        shownKey.current = key;
        settle(key);
        return;
      }

      // Keep the outgoing image still and reveal along the angled edge.
      gsap.set(next, {
        visibility: "visible",
        zIndex: 2,
        clipPath: travel === 1
          ? "polygon(0% 100%, 100% 106%, 100% 106%, 0% 100%)"
          : "polygon(0% -6%, 100% 0%, 100% 0%, 0% -6%)",
      });
      gsap.set(inner, { scale: 1.04 });
      timeline = gsap.timeline({
        onComplete: () => {
          if (disposed) return;
          shownKey.current = key;
          settle(key);
          timeline = null;
          playLatest();
        },
      });
      timeline.to(next, {
        clipPath: travel === 1
          ? "polygon(0% -6%, 100% 0%, 100% 100%, 0% 100%)"
          : "polygon(0% 0%, 100% 0%, 100% 106%, 0% 100%)",
        duration: 0.9,
        ease: "power3.inOut",
      }).to(inner, { scale: 1, duration: 1.1, ease: "power2.out" }, 0);
    };

    requestImage.current = (request) => {
      pending = request;
      playLatest();
    };
    return () => {
      disposed = true;
      timeline?.kill();
      requestImage.current = null;
      settle(shownKey.current);
    };
  }, []);

  // Readiness updates the latest request; unloaded images never cover the old one.
  useEffect(() => {
    requestImage.current?.({ key: currentKey, ready: imageReady, travel: photoDirection.current });
  }, [currentKey, imageReady]);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-service-reveal]", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      });
    });
    return () => media.revert();
  }, { scope: root });

  return (
    <section
      ref={root}
      id="services"
      aria-labelledby="services-title"
      className="relative z-10 scroll-mt-20 bg-cream px-gutter pb-16 pt-20 text-ink md:pb-24 md:pt-24"
    >
      <div data-service-reveal className="flex items-end justify-between gap-6 border-b border-ink/25 pb-5 md:pb-7">
        <p className="max-w-[11rem] text-[0.65rem] uppercase leading-[1.4] tracking-[0.08em] md:max-w-none md:text-xs">
          From the first sketch.<br />To the final detail.
        </p>
        <h2 id="services-title" className="text-right text-[clamp(2.75rem,9vw,8rem)] font-light uppercase leading-[0.85] tracking-[-0.065em]">
          Services
        </h2>
      </div>

      <div className="mt-6 grid gap-6 md:mt-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.65fr)] md:gap-x-[4vw] lg:gap-x-[6vw]">
        <div data-service-reveal className="min-w-0">
          <p className="mb-5 hidden max-w-[19rem] text-sm leading-[1.5] text-ink/65 md:block">
            One considered approach, at every scale. Explore how we shape spaces from the inside out.
          </p>
          <div role="tablist" aria-label="Explore our services" className="grid grid-cols-2 gap-gutter md:grid-cols-1 md:gap-0">
            {services.map((item, index) => {
              const selected = index === active;
              return (
                <button
                  key={item.id}
                  ref={(element) => { tabs.current[index] = element; }}
                  id={`service-tab-${item.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls="service-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(index)}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") select(index);
                  }}
                  onKeyDown={(event) => navigateTabs(event, index)}
                  className={`group relative flex min-h-[88px] min-w-0 flex-col items-start justify-between gap-3 overflow-hidden border p-3 text-left transition-colors duration-300 focus-visible:outline-clay md:min-h-[110px] md:flex-row md:items-center md:justify-start md:gap-5 md:border-x-0 md:border-t-0 md:py-6 ${selected ? "border-clay text-cream delay-[350ms] md:border-transparent" : "border-ink/20 text-ink/65 hover:border-clay hover:text-clay md:border-ink/25"}`}
                >
                  <span aria-hidden="true" className={`absolute inset-0 bg-clay transition-transform duration-[900ms] ease-[cubic-bezier(0.87,0,0.13,1)] motion-reduce:transition-none ${selected ? (direction === 1 ? "origin-top scale-y-100" : "origin-bottom scale-y-100") : (direction === 1 ? "origin-bottom scale-y-0" : "origin-top scale-y-0")}`} />
                  <span className="relative text-[0.65rem] tabular-nums tracking-[0.08em] md:self-start md:pt-1 md:text-xs">{item.number}</span>
                  <span className="relative max-w-full text-[clamp(0.85rem,3.6vw,1.15rem)] font-normal uppercase leading-[1.1] tracking-[-0.045em] md:text-[clamp(1.25rem,2.3vw,2.5rem)]">{item.title}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-8 hidden text-[0.65rem] uppercase tracking-[0.08em] text-ink/50 md:block">Four disciplines. One design language.</p>
        </div>

        <div
          data-service-reveal
          id="service-panel"
          role="tabpanel"
          aria-labelledby={`service-tab-${service.id}`}
          tabIndex={0}
          className="min-w-0 focus-visible:outline-clay"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-[#ab7653] md:aspect-[3/2]" aria-busy={!imageReady}>
            <div ref={layers} className="absolute inset-0" aria-hidden="true">
              {services.map((item, serviceIndex) => item.images.map((src, imageIndex) => {
                const key = `${serviceIndex}-${imageIndex}`;
                if (!seen.includes(key)) return null;
                return (
                  <div key={src} data-slide={key} className={`absolute inset-0 overflow-hidden bg-[#ab7653] ${key === "0-0" ? "" : "invisible"}`}>
                    <div data-inner className="absolute inset-0">
                      <Image
                        observeSection
                        src={src}
                        alt=""
                        fill
                        quality={90}
                        sizes="(min-width: 768px) 64vw, 100vw"
                        className="object-cover"
                        onLoad={() => setLoaded((previous) => previous.includes(key) ? previous : [...previous, key])}
                      />
                    </div>
                  </div>
                );
              }))}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/65 to-transparent" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-3 text-cream md:px-5 md:py-4">
              <p className="text-[0.65rem] uppercase tracking-[0.08em] tabular-nums">{service.number} / {service.title}</p>
              <p className="ml-3 shrink-0 text-[0.65rem] tabular-nums" aria-label={`Image ${slide + 1} of ${service.images.length}`}>{String(slide + 1).padStart(2, "0")} / {String(service.images.length).padStart(2, "0")}</p>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-ink/20 py-1">
            <div className="flex" role="group" aria-label="Choose a service image">
              {service.images.map((_, index) => (
                <button key={index} type="button" aria-label={`Show image ${index + 1} of ${service.title}`} aria-pressed={slide === index} onClick={() => selectImage(index)} className="group flex h-11 w-9 items-center justify-center focus-visible:outline-clay md:w-10">
                  <span aria-hidden="true" className={`h-[2px] w-6 transition-colors duration-300 ${slide === index ? "bg-clay" : "bg-ink/20 group-hover:bg-ink/60"}`} />
                </button>
              ))}
            </div>
            <div className="flex" role="group" aria-label="Browse service images">
              <button type="button" aria-label="Previous service image" onClick={() => selectImage((slide - 1 + service.images.length) % service.images.length, -1)} className="min-h-11 px-2 text-[0.65rem] uppercase tracking-[0.06em] transition-colors hover:text-clay focus-visible:outline-clay">Previous</button>
              <button type="button" aria-label="Next service image" onClick={() => selectImage((slide + 1) % service.images.length, 1)} className="min-h-11 px-2 text-[0.65rem] uppercase tracking-[0.06em] transition-colors hover:text-clay focus-visible:outline-clay">Next</button>
            </div>
          </div>

          <div className="mt-5 flex flex-col items-start gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
            <p className="max-w-[35rem] text-sm leading-[1.5] tracking-[-0.015em] md:text-[clamp(0.875rem,1.1vw,1.0625rem)]">{service.text}</p>
            <div data-service-cta className="shrink-0">
              <Button href={service.href} className="whitespace-nowrap">{service.href.startsWith("/") ? "Explore service" : "Let’s talk"}</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
