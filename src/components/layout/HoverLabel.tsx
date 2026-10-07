"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Decorative action hint. One delegated listener also covers dynamic dialogs. */
export default function HoverLabel() {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const hint = root.current;
    const text = hint?.querySelector("[data-hover-text]");
    const motion = hint?.querySelector<HTMLElement>("[data-hover-motion]");
    if (!hint || !text || !motion) return;
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let delay = 0;
    let active: HTMLElement | null = null;
    let x = 0;
    let y = 0;
    let width = 0;
    let currentX = 0;
    let currentY = 0;
    let previousTime = 0;
    const hide = () => {
      active = null;
      motion.dataset.visible = "false";
      motion.style.opacity = "0";
      motion.style.transform = "translateY(8px) scale(0.96)";
      window.clearTimeout(delay);
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const position = (time: number) => {
      frame = 0;
      const left = Math.max(8, Math.min(x + 18, innerWidth - width - 8));
      const top = Math.max(8, y + 22 + 42 > innerHeight ? y - 54 : y + 22);
      const elapsed = Math.min(64, previousTime ? time - previousTime : 16.67);
      previousTime = time;
      const ease = reduced.matches ? 1 : 1 - Math.exp(-elapsed / 85);
      currentX += (left - currentX) * ease;
      currentY += (top - currentY) * ease;
      currentX = Math.max(8, Math.min(currentX, innerWidth - width - 8));
      currentY = Math.max(8, Math.min(currentY, innerHeight - 48));
      hint.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      if (active && (Math.abs(left - currentX) > 0.1 || Math.abs(top - currentY) > 0.1)) frame = requestAnimationFrame(position);
    };
    const move = (event: PointerEvent) => {
      if (!media.matches || event.pointerType !== "mouse") { hide(); return; }
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-project-id], a[href]:not([data-rise]), [data-hover-label]:not(button)") : null;
      if (!target || target.closest("[inert], [data-hover-disabled]") || target.matches(":disabled, [aria-disabled=true]")) { hide(); return; }
      x = event.clientX;
      y = event.clientY;
      if (target !== active) {
        hide();
        active = target;
        const label = target.dataset.hoverLabel || (target.dataset.projectId ? "View case study" : target.getAttribute("aria-label") || target.querySelector(".sr-only")?.textContent || target.textContent?.replace(/\s+/g, " ").trim() || "Explore");
        text.textContent = label.length > 42 ? `${label.slice(0, 39)}…` : label;
        width = hint.offsetWidth;
        currentX = Math.max(8, Math.min(x + 18, innerWidth - width - 8));
        currentY = Math.max(8, y + 64 > innerHeight ? y - 54 : y + 22);
        previousTime = 0;
        position(performance.now());
        delay = window.setTimeout(() => {
          if (active !== target) return;
          motion.dataset.visible = "true";
          motion.style.opacity = "1";
          motion.style.transform = "translateY(0) scale(1)";
        }, reduced.matches ? 0 : 180);
      }
      if (!frame) frame = requestAnimationFrame(position);
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", hide);
    document.addEventListener("pointerdown", hide);
    document.addEventListener("scroll", hide, { passive: true, capture: true });
    window.addEventListener("blur", hide);
    media.addEventListener("change", hide);
    return () => {
      hide();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      document.removeEventListener("pointerdown", hide);
      document.removeEventListener("scroll", hide, true);
      window.removeEventListener("blur", hide);
      media.removeEventListener("change", hide);
    };
  }, [pathname]);

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[10000] max-w-[calc(100vw-16px)] text-black" style={{ viewTransitionName: "hover-label" }}>
      <div data-hover-motion data-visible="false" className="flex origin-top-left gap-2 opacity-0 transition-[opacity,transform] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none" style={{ transform: "translateY(8px) scale(0.96)" }}>
      <span data-hover-text className="flex min-h-10 items-center bg-[#dededb] px-4 text-[0.8rem] font-normal uppercase leading-none tracking-[-0.055em]">View case study</span>
      <span data-hover-arrow className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden bg-[#dededb]"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6"><path d="M5 19 19 5M6 5h13v13" stroke="currentColor" strokeWidth="1.5" /></svg></span>
      </div>
    </div>
  );
}
