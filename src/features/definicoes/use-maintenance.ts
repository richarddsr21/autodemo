"use client";

import { useRepositories } from "@/lib/repository/provider";

export function useMaintenance() {
  const { repos, bus } = useRepositories();
  return {
    resetToSample: async () => {
      await repos.maintenance.resetToSample();
      bus.emit("cars", "requests", "settings");
    },
    /** Descarrega todos os dados num ficheiro JSON. */
    exportJson: async () => {
      const dados = await repos.maintenance.exportAll();
      const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dados-stand-${dados.exportadoEm.slice(0, 10)}.json`;
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
  };
}
