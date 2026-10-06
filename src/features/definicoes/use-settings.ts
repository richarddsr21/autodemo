"use client";

import { siteConfig } from "@/config/site";
import type { Settings } from "@/lib/models";
import { useRepoQuery, useRepositories, type QueryState } from "@/lib/repository/provider";

/**
 * Definições do site. Enquanto carrega devolve os valores de `site.ts`,
 * para que o HTML inicial já tenha conteúdo.
 */
export function useSettings(): Settings {
  return useSettingsQuery().data ?? siteConfig.defaults;
}

/** Definições guardadas, com estado de carregamento (data é undefined até ler). */
export function useSettingsQuery(): QueryState<Settings> {
  return useRepoQuery("settings", "settings", (r) => r.settings.get());
}

export function useSettingsMutations() {
  const { repos, bus } = useRepositories();
  return {
    update: (input: Partial<Settings>) =>
      repos.settings.update(input).then((s) => {
        bus.emit("settings");
        return s;
      }),
  };
}
