"use client";

import { Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { container } from "@/components/ui/container";
import { FeatureIcon } from "@/components/ui/feature-icon";
import { useSettings } from "@/features/definicoes/use-settings";

export function TopBar() {
  const { telefone } = useSettings();
  return (
    <div className="border-b border-line bg-bg text-xs text-muted">
      <div className={`${container} flex h-10 items-center justify-between gap-4`}>
        <ul className="flex items-center gap-6 overflow-hidden">
          {siteConfig.vantagensTopo.map((v, i) => (
            <li key={v.texto} className={`items-center gap-2 whitespace-nowrap ${i === 0 ? "flex" : "hidden md:flex"}`}>
              <FeatureIcon name={v.icone} className="size-3.5 text-gold" aria-hidden="true" />
              {v.texto}
            </li>
          ))}
        </ul>
        <a
          href={`tel:${telefone.replace(/\s/g, "")}`}
          className="flex shrink-0 items-center gap-2 font-medium text-text transition-colors hover:text-gold"
        >
          <Phone className="size-3.5 text-gold" aria-hidden="true" />
          {telefone}
        </a>
      </div>
    </div>
  );
}
