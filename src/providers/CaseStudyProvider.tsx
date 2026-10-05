"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CaseStudy, { scrollKey } from "@/components/case-study/CaseStudy";
import { projects, type Project } from "@/data/projects";
import { useLoader } from "@/providers/LoaderProvider";
import { useLenis } from "@/providers/SmoothScroll";
import { didRestoreScroll } from "@/lib/pageScroll";

type Active = {
  project: Project;
  origin: HTMLElement;
  /** Set when reopened after a refresh: skips the expand animation */
  restored?: { scroll: number };
};
type CaseStudyState = { open: (project: Project, origin: HTMLElement) => void };

const CaseStudyContext = createContext<CaseStudyState>({ open: () => {} });

/** `open(project, element)` expands that work from `element` into its case study. */
export const useCaseStudy = () => useContext(CaseStudyContext);

// The open case study lives in the URL (#work=<id>), so a refresh can reopen it.
const HASH_PREFIX = "#work=";

const readHashId = () => {
  const { hash } = window.location;
  return hash.startsWith(HASH_PREFIX)
    ? decodeURIComponent(hash.slice(HASH_PREFIX.length))
    : null;
};

// replaceState (not pushState): no extra history entry, same back-button
// behavior as before.
const writeHash = (id: string | null) => {
  const { pathname, search } = window.location;
  const hash = id ? `${HASH_PREFIX}${encodeURIComponent(id)}` : "";
  window.history.replaceState(null, "", `${pathname}${search}${hash}`);
};

export default function CaseStudyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [active, setActive] = useState<Active | null>(null);
  const activeRef = useRef<Active | null>(null);
  const { ready } = useLoader();
  const lenisRef = useLenis();
  const restoreTried = useRef(false);

  const open = useCallback((project: Project, origin: HTMLElement) => {
    if (activeRef.current) return;
    activeRef.current = { project, origin };
    setActive(activeRef.current);
    writeHash(project.id);
  }, []);

  const handleClosed = useCallback(() => {
    const current = activeRef.current;
    activeRef.current = null;
    setActive(null);
    writeHash(null);
    try {
      if (current) sessionStorage.removeItem(scrollKey(current.project.id));
    } catch {}
    current?.origin.focus({ preventScroll: true }); // give focus back to the work
  }, []);

  // After a refresh: once the loader starts lifting, reopen the case study
  // that was open (same project, same scroll position), without the expand
  // animation. It mounts under the loader, so the loader lifts onto it.
  useEffect(() => {
    if (!ready || restoreTried.current) return;
    restoreTried.current = true;

    const id = readHashId();
    if (!id) return;

    const project = projects.find((p) => p.id === id);
    const origin = document.querySelector<HTMLElement>(
      `[data-project-id="${CSS.escape(id)}"]`,
    );
    if (!project || !origin || activeRef.current) {
      writeHash(null); // unknown id: drop it from the URL
      return;
    }

    // Put the page behind it on that work, so closing shrinks onto the card.
    // (Skipped when the Loader already restored the exact scroll position.)
    const lenis = lenisRef.current;
    if (didRestoreScroll()) {
      // page is already where it was
    } else if (lenis) {
      lenis.scrollTo(origin, {
        immediate: true,
        offset: -(window.innerHeight - origin.offsetHeight) / 2,
      });
    } else {
      origin.scrollIntoView({ block: "center" });
    }

    let scroll = 0;
    try {
      scroll = Number(sessionStorage.getItem(scrollKey(id))) || 0;
    } catch {}

    activeRef.current = { project, origin, restored: { scroll } };
    setActive(activeRef.current);
  }, [ready, lenisRef]);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <CaseStudyContext.Provider value={value}>
      {children}
      {active && (
        <CaseStudy
          key={active.project.id}
          project={active.project}
          origin={active.origin}
          instant={!!active.restored}
          initialScroll={active.restored?.scroll}
          onClosed={handleClosed}
        />
      )}
    </CaseStudyContext.Provider>
  );
}
