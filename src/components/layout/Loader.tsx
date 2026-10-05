"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLoader } from "@/providers/LoaderProvider";

const MIN_MS = 1.6; // never flash by faster than this (seconds)
const MAX_MS = 7; // never hang longer than this (seconds)

export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const { setReady } = useLoader();
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const html = document.documentElement;
      html.style.overflow = "hidden";
      window.scrollTo(0, 0);

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const p = { v: 0 };
      let alive = true;
      let minElapsed = false;
      let assetsReady = false;
      let finished = false;

      const render = () => {
        const v = Math.round(p.v);
        if (count.current) count.current.textContent = String(v);
        if (mark.current) mark.current.style.backgroundSize = `100% ${p.v}%`;
      };

      const finish = () => {
        html.style.overflow = "";
        setDone(true);
      };

      const exit = () => {
        if (reduce) {
          setReady(true);
          gsap.to(root.current, {
            autoAlpha: 0,
            duration: 0.4,
            onComplete: finish,
          });
          return;
        }
        gsap
          .timeline({ onComplete: finish })
          .to("[data-loader-content]", {
            yPercent: -25,
            autoAlpha: 0,
            duration: 0.5,
            ease: "power3.in",
          })
          // The panel lifts away and the hero intro starts right as it does.
          .to(
            root.current,
            { yPercent: -100, duration: 1, ease: "power4.inOut" },
            0.35,
          )
          .add(() => setReady(true), 0.45);
      };

      const maybeFinish = () => {
        if (finished || !alive || !minElapsed || !assetsReady) return;
        finished = true;
        crawl?.kill();
        gsap.to(p, {
          v: 100,
          duration: reduce ? 0.01 : 0.7,
          ease: "power2.inOut",
          onUpdate: render,
          onComplete: () => {
            render();
            exit();
          },
        });
      };

      // Fake-but-smooth progress that crawls toward 85% until real assets are in.
      const crawl = reduce
        ? null
        : gsap.to(p, {
            v: 85,
            duration: 2.4,
            ease: "power2.out",
            onUpdate: render,
          });

      gsap.delayedCall(MIN_MS, () => {
        minElapsed = true;
        maybeFinish();
      });
      gsap.delayedCall(MAX_MS, () => {
        assetsReady = true;
        maybeFinish();
      });

      // Real assets: fonts + the hero video being able to play.
      const tasks: Promise<unknown>[] = [document.fonts.ready];
      const video = document.querySelector<HTMLVideoElement>("[data-video]");
      if (video && video.readyState < 3) {
        tasks.push(
          new Promise((resolve) => {
            video.addEventListener("canplay", resolve, { once: true });
            video.addEventListener("error", resolve, { once: true });
          }),
        );
      }
      Promise.all(tasks).then(() => {
        assetsReady = true;
        maybeFinish();
      });

      return () => {
        alive = false;
        html.style.overflow = "";
      };
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[100] bg-ink text-cream"
    >
      <div data-loader-content className="absolute inset-0">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            ref={mark}
            className="loader-mark aspect-square h-[clamp(5rem,14vw,9rem)]"
          />
        </div>

        <span
          ref={count}
          aria-hidden="true"
          className="absolute bottom-6 right-gutter text-[clamp(4rem,14vw,11rem)] font-light leading-none tracking-[-0.06em] tabular-nums md:bottom-8"
        >
          0
        </span>
      </div>
    </div>
  );
}
