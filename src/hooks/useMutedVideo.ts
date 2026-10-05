"use client";

import { useEffect, type RefObject } from "react";

/**
 * React doesn't always render the `muted` attribute, which makes browsers
 * block autoplay. Force it on the element and start playback.
 */
export function useMutedVideo(ref: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.play().catch(() => {});
  }, [ref]);
}
