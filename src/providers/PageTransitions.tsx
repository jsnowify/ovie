"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "@/providers/SmoothScroll";

type Pending = { pathname: string; url: URL; restore?: number; finish: () => void };

export default function PageTransitions({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();
  const currentPath = useRef(pathname);
  const pending = useRef<Pending | null>(null);
  const active = useRef<ViewTransition | null>(null);
  const positions = useRef(new Map<string, number>());

  useLayoutEffect(() => {
    currentPath.current = pathname;
    const navigation = pending.current;
    if (!navigation || navigation.pathname !== pathname) return;

    lenis.current?.resize();
    const id = decodeURIComponent(navigation.url.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    // Position the incoming page before its snapshot is taken.
    if (lenis.current) {
      lenis.current.scrollTo(navigation.restore ?? target ?? 0, { immediate: true, force: true });
    } else if (navigation.restore !== undefined) {
      window.scrollTo(0, navigation.restore);
    } else if (target) {
      target.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
    ScrollTrigger.refresh();
    navigation.finish();
  }, [pathname, lenis]);

  useEffect(() => {
    const canSlide = () => typeof document.startViewTransition === "function"
      && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const slide = (url: URL, back: boolean, navigate?: () => void) => {
      positions.current.set(currentPath.current, window.scrollY);
      active.current?.skipTransition();
      pending.current?.finish();
      document.documentElement.dataset.pageSlide = back ? "back" : "forward";
      const transition = document.startViewTransition(() => new Promise<void>((resolve) => {
        // Release the snapshot if a navigation is interrupted or delayed.
        const timer = window.setTimeout(finish, 4000);
        function finish() {
          window.clearTimeout(timer);
          if (pending.current?.finish === finish) pending.current = null;
          resolve();
        }
        pending.current = { pathname: url.pathname, url, restore: back ? positions.current.get(url.pathname) : undefined, finish };
        navigate?.();
        if (currentPath.current === url.pathname) finish();
      }));
      active.current = transition;
      void transition.ready.catch(() => {});
      void transition.finished.catch(() => {}).then(() => {
        if (active.current !== transition) return;
        active.current = null;
        delete document.documentElement.dataset.pageSlide;
      });
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !canSlide()) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self") || link.rel.includes("external")) return;
      const url = new URL(link.href);
      if (url.origin !== window.location.origin || url.pathname === currentPath.current) return;
      event.preventDefault();
      slide(url, false, () => router.push(`${url.pathname}${url.search}${url.hash}`, { scroll: false }));
    };

    const onHistory = () => {
      const url = new URL(window.location.href);
      if (url.pathname !== currentPath.current && canSlide()) slide(url, true);
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onHistory, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onHistory, true);
      active.current?.skipTransition();
      pending.current?.finish();
      delete document.documentElement.dataset.pageSlide;
    };
  }, [router]);

  return <>{children}</>;
}
