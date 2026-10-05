// Keeps the homepage scroll position across a browser refresh.
// - While the page is scrolled we save window.scrollY in sessionStorage.
// - The Loader restores it (behind the loading screen) after a reload.
// - Saving only starts AFTER the restore, so the initial scrollY of 0 never
//   overwrites the saved value.

import type Lenis from "lenis";

const KEY = "page-scroll";
let saving = false;
let restored = false;

export const readSavedScroll = (): number => {
  try {
    return Number(sessionStorage.getItem(KEY)) || 0;
  } catch {
    return 0;
  }
};

const write = () => {
  try {
    sessionStorage.setItem(KEY, String(Math.round(window.scrollY)));
  } catch {}
};

/** Only a reload / back-forward restores. A fresh visit starts at the top. */
const isReload = () => {
  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  return nav?.type === "reload" || nav?.type === "back_forward";
};

/** Take over scroll restoration from the browser (it would fight Lenis). */
export const takeOverScrollRestoration = () => {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
};

/** True if the last restoreScroll() actually moved the page. */
export const didRestoreScroll = () => restored;

/** Jump to the saved position (instantly) after a refresh, then start saving. */
export const restoreScroll = (lenis?: Lenis | null) => {
  const y = isReload() ? readSavedScroll() : 0;
  restored = y > 0;
  if (y > 0) {
    if (lenis) {
      lenis.scrollTo(y, { immediate: true, force: true });
    } else {
      window.scrollTo(0, y);
    }
  }
  startSavingScroll();
};

export const startSavingScroll = () => {
  if (saving) return;
  saving = true;
  let raf = 0;
  window.addEventListener(
    "scroll",
    () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        write();
      });
    },
    { passive: true },
  );
  // Last chance before the refresh actually happens.
  window.addEventListener("pagehide", write);
};
