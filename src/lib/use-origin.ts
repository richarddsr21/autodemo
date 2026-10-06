"use client";

import { useSyncExternalStore } from "react";
import { siteConfig } from "@/config/site";

const noop = () => () => {};

/** Origem do site (ex.: https://www.o-meu-stand.pt). No servidor usa o URL de site.ts. */
export function useOrigin(): string {
  return useSyncExternalStore(
    noop,
    () => window.location.origin,
    () => siteConfig.url,
  );
}
