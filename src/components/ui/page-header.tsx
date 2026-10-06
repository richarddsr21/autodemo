import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { container } from "./container";

export interface Crumb {
  href?: string;
  label: string;
}

export function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const base = tone === "dark" ? "text-muted" : "text-muted-ink";
  const hover = tone === "dark" ? "hover:text-gold" : "hover:text-gold-ink";
  const current = tone === "dark" ? "text-text" : "text-ink";
  return (
    <nav aria-label="Caminho" className={`text-sm ${base}`}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3.5 opacity-60" aria-hidden="true" />}
            {c.href ? (
              <Link href={c.href} className={`transition-colors ${hover}`}>
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className={`line-clamp-1 ${current}`}>
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Faixa escura no topo das páginas internas. */
export function PageHeader({
  title,
  subtitle,
  crumbs,
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  crumbs: Crumb[];
  children?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden border-b border-line bg-bg">
      <div
        className="pointer-events-none absolute -top-40 right-0 size-[520px] rounded-full bg-gold/10 blur-3xl"
        aria-hidden="true"
      />
      <div className={`${container} relative py-10 sm:py-14`}>
        <Breadcrumbs items={crumbs} />
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-text/75">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
