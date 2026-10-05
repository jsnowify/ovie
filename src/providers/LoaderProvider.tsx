"use client";

import { createContext, useContext, useMemo, useState } from "react";

type LoaderState = { ready: boolean; setReady: (v: boolean) => void };

const LoaderContext = createContext<LoaderState>({
  ready: false,
  setReady: () => {},
});

/** `ready` flips to true as the loader starts lifting. Intro animations wait for it. */
export const useLoader = () => useContext(LoaderContext);

export default function LoaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const value = useMemo(() => ({ ready, setReady }), [ready]);
  return (
    <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>
  );
}
