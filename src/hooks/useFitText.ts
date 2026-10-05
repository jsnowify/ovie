"use client";

import { useLayoutEffect, type RefObject } from "react";

/**
 * Fits a one-line title inside its box without ever cutting it off.
 *
 * The title keeps its normal size (see `.fit-title` in globals.css) whenever it
 * fits. Only when it is too long does the size shrink, by exactly as much as
 * needed, so short titles stay big and long ones still read in full.
 *
 * It works by setting `--fit` (a 0-1 multiplier) on the box. Everything inside
 * is sized from the box's font-size, so letter-spacing and line-height scale
 * with it and the title keeps its proportions.
 *
 * @param boxRef   the element that has the `fit-title` class and the padding
 * @param textRef  the single-line text inside it (the thing that can overflow)
 * @param live     re-fit when the box is resized. Turn off for a copy that
 *                 animates its own width but should keep the size it started with.
 */
export function useFitText(
  boxRef: RefObject<HTMLElement | null>,
  textRef: RefObject<HTMLElement | null>,
  { live = true }: { live?: boolean } = {},
) {
  useLayoutEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text) return;

    const fit = () => {
      // Measure at full size first (no paint happens in between).
      box.style.setProperty("--fit", "1");
      const cs = getComputedStyle(box);
      const available =
        box.clientWidth -
        parseFloat(cs.paddingLeft) -
        parseFloat(cs.paddingRight);
      const needed = text.offsetWidth;
      if (available <= 0 || needed <= 0 || needed <= available) return;
      // 0.99: a little slack so rounding never clips the last letter.
      box.style.setProperty("--fit", String((available / needed) * 0.99));
    };

    fit();

    // The web font changes the width of the text once it has loaded.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) fit();
    });

    if (!live) {
      return () => {
        cancelled = true;
      };
    }

    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [boxRef, textRef, live]);
}
