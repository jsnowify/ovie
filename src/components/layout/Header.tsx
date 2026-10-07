"use client";

import { useCallback, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import Logo from "@/components/ui/Logo";
import MenuButton from "@/components/ui/MenuButton";
import MenuPanel from "@/components/layout/MenuPanel";
import { useLoader } from "@/providers/LoaderProvider";
import { useOverLight } from "@/hooks/useOverLight";

export default function Header() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const logoControl = useRef<HTMLDivElement>(null);
  const menuControl = useRef<HTMLDivElement>(null);
  const logoOnLight = useOverLight(logoControl);
  const menuOnLight = useOverLight(menuControl);
  const { ready } = useLoader();

  useGSAP(
    () => {
      if (!ready) return; // wait for the loader
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Logo and menu button rise up (no fade). The header clips them
        // while they travel, then the clip is removed so focus rings aren't cut off.
        const header = root.current;
        gsap.set(header, { overflow: "hidden" });
        gsap.from("[data-rise]", {
          yPercent: 110,
          duration: 1,
          delay: 1.1,
          ease: "power4.out",
          stagger: 0.1,
          onComplete: () => {
            gsap.set(header, { clearProps: "overflow" });
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  // The open menu is always dark (ink), so keep the header light then.
  const logoTone = open || !logoOnLight ? "text-cream" : "text-ink";
  const menuTone = open || !menuOnLight ? "text-cream" : "text-ink";

  return (
    <>
      <MenuPanel open={open} onClose={close} />

      {/* pointer-events-none so the empty strip never blocks the overlay click */}
      <header
        ref={root}
        data-adaptive-ui
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-gutter pt-5 md:pt-8"
      >
        <div ref={logoControl} data-rise className={`pointer-events-auto transition-colors duration-200 ${logoTone}`}>
          <Logo />
        </div>
        <div ref={menuControl} data-rise className={`pointer-events-auto transition-colors duration-200 ${menuTone}`}>
          <MenuButton open={open} onClick={() => setOpen((v) => !v)} />
        </div>
      </header>
    </>
  );
}
