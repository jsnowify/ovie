"use client";

import { useRef, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLenis } from "@/providers/SmoothScroll";
import { contact, site } from "@/config/site";
import { services } from "@/data/services";
import RollText from "@/components/ui/RollText";
import { sectionHref } from "@/lib/navigation";

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const pathname = usePathname();

  const go = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (href === "/" && pathname !== "/") return;
    if (href !== "/" && !href.startsWith("#")) return;
    if (!lenis.current) return;
    event.preventDefault();
    lenis.current.scrollTo(href === "/" ? 0 : href);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          panel.current,
          { y: () => -Math.min(window.innerHeight * 0.45, (panel.current?.offsetHeight ?? 0) * 0.4) },
          {
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "top top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <footer
      ref={root}
      id="contact"
      aria-labelledby="contact-title"
      className="relative z-10 overflow-hidden bg-cream px-gutter pb-gutter pt-16 text-cream md:pt-24"
    >
      <div ref={panel} className="overflow-hidden bg-clay px-6 pb-5 pt-8 sm:px-10 md:px-[4vw] md:pt-[3vw]">
        <div className="grid gap-10 py-12 md:grid-cols-[1.5fr_1fr] md:gap-[6vw] md:py-[6vw]">
          <div data-footer-reveal>
            <p className="mb-5 text-sm font-light md:mb-8">{contact.eyebrow}</p>
            <h2 id="contact-title" className="text-[clamp(2.75rem,6.8vw,8rem)] font-light leading-[1.02] tracking-[-0.065em]">
              Let’s shape<br />what’s next.
            </h2>
          </div>

          <div data-footer-reveal className="flex flex-col items-start justify-end md:pb-1">
            <p className="max-w-[30ch] text-sm font-light leading-relaxed text-cream/80 md:text-base">
              {contact.text}
            </p>
            <Link
              href="/contact/"
              className="group mt-7 flex min-h-14 w-full max-w-sm items-center justify-between gap-6 border-b border-cream/50 pb-4 text-lg tracking-[-0.04em] transition-colors hover:border-cream motion-reduce:transition-none md:mt-10 md:text-xl"
            >
              <span>Start a conversation</span>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cream/40 transition-colors group-hover:bg-cream group-hover:text-clay motion-reduce:transition-none">
                <Arrow className="h-5 w-5" />
              </span>
            </Link>
            <span className="group/roll mt-5 inline-block py-1 text-sm text-cream/80 hover:text-cream">
              <RollText underline>{contact.email}</RollText>
            </span>
          </div>
        </div>

        <div data-footer-reveal className="grid gap-8 border-y border-cream/30 py-8 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_auto] md:gap-[6vw]">
          <nav aria-labelledby="footer-services-title">
            <h3 id="footer-services-title" className="mb-4 text-[0.65rem] uppercase tracking-[0.14em] text-cream/60">Services</h3>
            <ul className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-1 lg:grid-cols-2">
              {services.map((service) => (
                <li key={service.id}>
                  <Link href={service.href.startsWith("/") ? service.href : sectionHref("#services", pathname)} onClick={(event) => go(event, service.href.startsWith("/") ? service.href : sectionHref("#services", pathname))} className="group/roll inline-block py-2">
                    <RollText underline>{service.title}</RollText>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-labelledby="footer-explore-title">
            <h3 id="footer-explore-title" className="mb-4 text-[0.65rem] uppercase tracking-[0.14em] text-cream/60">Explore</h3>
            <ul className="grid grid-cols-[max-content_max-content] items-center gap-x-6 gap-y-1 text-sm">
              {contact.nav.filter((item) => item.href !== "/" && item.href !== "#services").map((item) => (
                <li key={item.label} className={item.label === "Contact" ? "col-start-2 row-start-1" : "col-start-1"}>
                  <Link href={sectionHref(item.href, pathname)} onClick={(event) => go(event, sectionHref(item.href, pathname))} className="group/roll inline-block py-2">
                    <RollText underline>{item.label}</RollText>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link href={pathname} onClick={(event) => { if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && lenis.current) { event.preventDefault(); lenis.current.scrollTo(0); } }} className="group flex min-h-10 items-center gap-3 self-start text-xs uppercase tracking-[0.04em] sm:col-span-2 md:col-span-1">
            Back to top
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="M4 4h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 20V10m-6 6 6-6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none" />
            </svg>
          </Link>
        </div>

        <Link
          href="/"
          onClick={(event) => go(event, "/")}
          aria-label="Ovie Studio home"
          className="mt-8 flex items-center justify-between gap-[4vw] rounded-sm md:mt-[3vw]"
        >
          <span aria-hidden="true" className="block text-[clamp(5rem,23vw,26rem)] font-semibold leading-[0.85] tracking-[-0.075em]">OVIE</span>
          <span
            aria-hidden="true"
            className="block h-[16vw] max-h-64 w-[16vw] max-w-64 shrink-0 bg-cream"
            style={{ WebkitMask: "url(/ovie.svg) center / contain no-repeat", mask: "url(/ovie.svg) center / contain no-repeat" }}
          />
        </Link>

        <div className="mt-7 flex flex-wrap justify-between gap-x-6 gap-y-2 text-[0.65rem] font-light text-cream/70 md:mt-10 md:text-xs">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <p>Space. Structure. Substance.</p>
        </div>
        <p className="mt-4 max-w-[70ch] text-[0.65rem] font-light leading-relaxed text-cream/70 md:text-xs">
          Created by <a href="https://snowi-cambronero.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-cream underline decoration-cream/40 underline-offset-4 transition-colors hover:decoration-cream">Snowi Cambronero</a> as a showcase project for my portfolio. Ovie is a concept, not an operating architecture studio.
        </p>
      </div>
    </footer>
  );
}

