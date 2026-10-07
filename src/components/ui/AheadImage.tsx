"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { useLoader } from "@/providers/LoaderProvider";
import { observeAhead } from "@/lib/observeAhead";

type Props = ImageProps & {
  /** Start this image during the loader, without blocking the hero. */
  initial?: boolean;
  /** Animated or hidden slides load when their section approaches. */
  observeSection?: boolean;
};

/** Fill images retain their original quality and responsive source selection. */
export default function AheadImage({
  initial = false,
  observeSection = false,
  alt,
  ...props
}: Props) {
  const anchor = useRef<HTMLSpanElement>(null);
  const [requested, setRequested] = useState(false);
  const { ready } = useLoader();
  const load = initial || requested;

  useEffect(() => {
    if (load || !ready || !anchor.current) return;
    if (!("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => setRequested(true));
      return () => cancelAnimationFrame(frame);
    }

    const target = observeSection
      ? anchor.current.closest("section") ?? anchor.current
      : anchor.current;
    return observeAhead(target, () => setRequested(true));
  }, [load, ready, observeSection]);

  return (
    <span ref={anchor} className="absolute inset-0 block">
      {load && <Image {...props} alt={alt} loading="eager" />}
    </span>
  );
}
