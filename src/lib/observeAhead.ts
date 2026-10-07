// Images share a viewport observer, including hidden slides in one section.
const targets = new Map<Element, Set<() => void>>();
let observer: IntersectionObserver | null = null;
let resizeTimer: ReturnType<typeof setTimeout> | undefined;

function connect() {
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const callbacks = targets.get(entry.target);
        targets.delete(entry.target);
        observer?.unobserve(entry.target);
        callbacks?.forEach((load) => load());
      }
      if (!targets.size) disconnect();
    },
    { rootMargin: `${Math.round(window.innerHeight * 0.8)}px 0px` },
  );
  targets.forEach((_, target) => observer?.observe(target));
}

function resize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(connect, 150);
}

function disconnect() {
  observer?.disconnect();
  observer = null;
  clearTimeout(resizeTimer);
  window.removeEventListener("resize", resize);
}

export function observeAhead(target: Element, load: () => void) {
  const callbacks = targets.get(target) ?? new Set<() => void>();
  callbacks.add(load);
  targets.set(target, callbacks);
  if (!observer) {
    window.addEventListener("resize", resize);
    connect();
  } else {
    observer.observe(target);
  }
  return () => {
    callbacks.delete(load);
    if (!callbacks.size && targets.get(target) === callbacks) {
      targets.delete(target);
      observer?.unobserve(target);
    }
    if (!targets.size) disconnect();
  };
}
