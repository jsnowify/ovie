"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLenis } from "@/providers/SmoothScroll";
import { menu } from "@/config/site";
import RollText from "@/components/ui/RollText";

type Props = { open: boolean; onClose: () => void };

const EASE = "ease-[cubic-bezier(0.76,0,0.24,1)]";

const itemClass =
  "group/roll py-1 text-left text-[clamp(2.25rem,5vw,3.5rem)] font-light uppercase tracking-[-0.04em]";

export default function MenuPanel({ open, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const lenisRef = useLenis();
  const [servicesOpen, setServicesOpen] = useState(false);

  // Build the enter/exit timeline once. Exit = the same timeline played in reverse.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const reduce = Boolean(ctx.conditions?.reduce);

          const tl = gsap.timeline({
            paused: true,
            onReverseComplete: () => {
              gsap.set(root.current, { autoAlpha: 0 });
              setServicesOpen(false);
            },
          });

          if (reduce) {
            tl.fromTo(
              "[data-overlay]",
              { opacity: 0 },
              { opacity: 1, duration: 0.2 },
              0,
            ).fromTo(
              "[data-panel]",
              { opacity: 0 },
              { opacity: 1, duration: 0.2 },
              0,
            );
          } else {
            tl.fromTo(
              "[data-overlay]",
              { opacity: 0 },
              { opacity: 1, duration: 0.7, ease: "power2.out" },
              0,
            )
              .fromTo(
                "[data-panel]",
                { xPercent: 100 },
                { xPercent: 0, duration: 0.9, ease: "power4.inOut" },
                0,
              )
              .fromTo(
                "[data-item]",
                { yPercent: 110 },
                {
                  yPercent: 0,
                  duration: 0.9,
                  ease: "power4.out",
                  stagger: 0.07,
                },
                0.35,
              );
          }

          tlRef.current = tl;
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  // Play on open, reverse on close (slightly faster exit).
  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (open) {
      gsap.set(root.current, { autoAlpha: 1 });
      tl.timeScale(1).play();
    } else if (tl.progress() > 0) {
      tl.timeScale(1.4).reverse();
    }
  }, [open]);

  // Lock page scroll (Lenis) while the menu is open.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenisRef]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    onClose();
    const lenis = lenisRef.current;
    lenis?.start();
    lenis?.scrollTo(href);
  };

  return (
    <div
      ref={root}
      id="site-menu"
      className="invisible fixed inset-0 z-40"
      aria-hidden={!open}
    >
      {/* Overlay: click outside the panel to close */}
      <div
        data-overlay
        onClick={onClose}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
      />

      <nav
        data-panel
        aria-label="Main"
        className="absolute inset-y-0 right-0 flex w-full flex-col bg-ink px-8 pb-10 pt-28 text-cream sm:w-[28rem] lg:w-[34rem]"
      >
        <ul className="flex flex-col">
          {menu.map((item) =>
            item.children ? (
              <li
                key={item.label}
                data-open={servicesOpen}
                onMouseLeave={() => setServicesOpen(false)}
                className="group/services"
              >
                <div className="overflow-hidden">
                  <div data-item>
                    <button
                      type="button"
                      aria-expanded={servicesOpen}
                      aria-controls="menu-services"
                      onClick={() => setServicesOpen((v) => !v)}
                      className={`flex w-full items-center justify-between ${itemClass}`}
                    >
                      <RollText underline className="leading-[1.1]">
                        {item.label}
                      </RollText>
                      {/* Plus: sized to the text, same 2px weight as the underline.
                          On expand it turns half a turn while the vertical bar
                          collapses, so it ends as a minus. */}
                      <span
                        aria-hidden="true"
                        className={`relative mr-1 block h-[0.45em] w-[0.45em] transition-transform duration-500 ${EASE} group-hover/services:rotate-180 group-has-[:focus-visible]/services:rotate-180 group-data-[open=true]/services:rotate-180 motion-reduce:transition-none`}
                      >
                        <span className="absolute inset-x-0 top-1/2 block h-[2px] -translate-y-1/2 bg-cream" />
                        <span
                          className={`absolute inset-y-0 left-1/2 block w-[2px] -translate-x-1/2 bg-cream transition-transform duration-500 ${EASE} group-hover/services:scale-y-0 group-has-[:focus-visible]/services:scale-y-0 group-data-[open=true]/services:scale-y-0 motion-reduce:transition-none`}
                        />
                      </span>
                    </button>
                  </div>
                </div>

                {/* Expansion: animates 0 -> auto height with the same ease */}
                <div
                  id="menu-services"
                  className={`grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ${EASE} group-hover/services:grid-rows-[1fr] group-has-[:focus-visible]/services:grid-rows-[1fr] group-data-[open=true]/services:grid-rows-[1fr] motion-reduce:transition-none`}
                >
                  <ul className="min-h-0 overflow-hidden">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <a
                          href={child.href}
                          onClick={(e) => go(e, child.href)}
                          className="group/sub relative inline-block py-1.5 pl-1 text-lg font-light text-cream/70 transition-colors duration-300 hover:text-cream"
                        >
                          {child.label}
                          {/* Underline: draws in from the left, out to the right */}
                          <span
                            aria-hidden="true"
                            className={`absolute bottom-1.5 left-1 right-0 block h-px origin-right scale-x-0 bg-cream transition-transform duration-500 ${EASE} group-hover/sub:origin-left group-hover/sub:scale-x-100 group-focus-visible/sub:origin-left group-focus-visible/sub:scale-x-100 motion-reduce:transition-none`}
                          />
                        </a>
                      </li>
                    ))}
                    <li aria-hidden="true" className="h-3" />
                  </ul>
                </div>
              </li>
            ) : (
              <li key={item.label} className="overflow-hidden">
                <div data-item>
                  <a
                    href={item.href}
                    onClick={(e) => go(e, item.href!)}
                    className={`inline-block ${itemClass}`}
                  >
                    <RollText underline className="leading-[1.1]">
                      {item.label}
                    </RollText>
                  </a>
                </div>
              </li>
            ),
          )}
        </ul>
      </nav>
    </div>
  );
}
