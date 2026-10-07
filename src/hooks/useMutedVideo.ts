"use client";

import { useEffect, type RefObject } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * React doesn't always render the `muted` attribute, which makes browsers
 * block autoplay. Force it on the element and start playback.
 */
export function useMutedVideo(ref: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    const works = document.getElementById("works");
    let covered = !!works && works.getBoundingClientRect().top <= 0;
    const sync = () => {
      if (covered || document.hidden || document.querySelector('[role="dialog"][aria-modal="true"]')) {
        el.pause();
      } else {
        el.play().catch(() => {});
      }
    };
    const trigger = works ? ScrollTrigger.create({
      trigger: works,
      start: "top top",
      end: "max",
      onEnter: () => { covered = true; sync(); },
      onLeaveBack: () => { covered = false; sync(); },
      onRefresh: () => { covered = works.getBoundingClientRect().top <= 0; sync(); },
    }) : null;
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      trigger?.kill();
      document.removeEventListener("visibilitychange", sync);
      el.pause();
    };
  }, [ref]);
}
