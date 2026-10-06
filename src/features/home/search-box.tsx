"use client";

import { ArrowRight, KeyRound, Search, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useMemo, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { buttonClass } from "@/components/ui/button";
import { useCars } from "@/features/catalogo/use-cars";
import { CATEGORIAS, CATEGORIA_LABEL, COMBUSTIVEIS, COMBUSTIVEL_LABEL } from "@/lib/models";
import { hojeISO } from "@/lib/dates";
import { formatEuro } from "@/lib/format";

const PRECOS = [10000, 15000, 20000, 30000, 40000, 50000, 75000];
const ANOS = [2010, 2014, 2016, 2018, 2020, 2022];

type Separador = "comprar" | "alugar";

const fieldClass =
  "h-12 w-full appearance-none rounded-xl border border-line bg-surface-2 px-3.5 text-sm text-text transition-colors hover:border-gold/50 focus:border-gold focus:outline-none scheme-dark";

function Field({
  label,
  htmlFor,
  className = "",
  children,
}: {
  label: string;
  htmlFor: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}


export function SearchBox() {
  const router = useRouter();
  const id = useId();
  const [tab, setTab] = useState<Separador>("comprar");
  const tabsRef = useRef<Record<Separador, HTMLButtonElement | null>>({ comprar: null, alugar: null });
  const [levantamento, setLevantamento] = useState("");

  const { data: carrosVenda } = useCars({ tipo: "venda" });
  const marcas = useMemo(
    () => [...new Set((carrosVenda ?? []).map((c) => c.marca))].sort((a, b) => a.localeCompare(b, "pt-PT")),
    [carrosVenda],
  );

  const pesquisar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    for (const [k, v] of new FormData(e.currentTarget)) {
      if (typeof v === "string" && v) params.set(k, v);
    }
    const qs = params.toString();
    router.push(`/${tab}${qs ? `?${qs}` : ""}`);
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const next: Separador = tab === "comprar" ? "alugar" : "comprar";
    setTab(next);
    tabsRef.current[next]?.focus();
  };

  const tabs: { key: Separador; label: string; Icon: typeof ShoppingBag }[] = [
    { key: "comprar", label: "Comprar", Icon: ShoppingBag },
    { key: "alugar", label: "Alugar", Icon: KeyRound },
  ];

  return (
    <div className="rounded-2xl border border-line bg-surface p-2 shadow-[var(--shadow-float)] sm:p-3">
      <div role="tablist" aria-label="Tipo de pesquisa" className="flex gap-1 p-1">
        {tabs.map(({ key, label, Icon }) => {
          const ativo = tab === key;
          return (
            <button
              key={key}
              ref={(el) => {
                tabsRef.current[key] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${key}`}
              aria-selected={ativo}
              aria-controls={`${id}-painel`}
              tabIndex={ativo ? 0 : -1}
              onClick={() => setTab(key)}
              onKeyDown={onTabKey}
              className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors duration-200 ${ativo ? "bg-gold text-on-gold" : "text-muted hover:text-text"}`}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>

      <div id={`${id}-painel`} role="tabpanel" aria-labelledby={`${id}-tab-${tab}`}>
      <form
        key={tab}
        onSubmit={pesquisar}
        className={`grid grid-cols-2 gap-3 p-2 lg:items-end ${tab === "comprar" ? "lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]" : "lg:grid-cols-[repeat(3,minmax(0,1fr))_auto]"}`}
      >
        {tab === "comprar" ? (
          <>
            <Field label="Marca" htmlFor={`${id}-marca`}>
              <select id={`${id}-marca`} name="marca" className={fieldClass} defaultValue="">
                <option value="">Todas as marcas</option>
                {marcas.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Preço máximo" htmlFor={`${id}-preco`}>
              <select id={`${id}-preco`} name="precoMax" className={fieldClass} defaultValue="">
                <option value="">Sem limite</option>
                {PRECOS.map((p) => (
                  <option key={p} value={p}>
                    Até {formatEuro(p)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Ano mínimo" htmlFor={`${id}-ano`}>
              <select id={`${id}-ano`} name="anoMin" className={fieldClass} defaultValue="">
                <option value="">Qualquer ano</option>
                {ANOS.map((a) => (
                  <option key={a} value={a}>
                    Desde {a}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Combustível" htmlFor={`${id}-comb`}>
              <select id={`${id}-comb`} name="combustivel" className={fieldClass} defaultValue="">
                <option value="">Todos</option>
                {COMBUSTIVEIS.map((c) => (
                  <option key={c} value={c}>
                    {COMBUSTIVEL_LABEL[c]}
                  </option>
                ))}
              </select>
            </Field>
            <button type="submit" className={buttonClass("primary", "md", "col-span-2 h-12 lg:col-span-1")}>
              <Search className="size-4" aria-hidden="true" />
              Pesquisar
            </button>
          </>
        ) : (
          <>
            <Field label="Tipo de viatura" htmlFor={`${id}-cat`} className="col-span-2 lg:col-span-1">
              <select id={`${id}-cat`} name="categoria" className={fieldClass} defaultValue="">
                <option value="">Todos os tipos</option>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORIA_LABEL[c]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Levantamento" htmlFor={`${id}-lev`}>
              <input
                id={`${id}-lev`}
                type="date"
                name="levantamento"
                min={hojeISO()}
                value={levantamento}
                onChange={(e) => setLevantamento(e.target.value)}
                className={fieldClass}
                suppressHydrationWarning
              />
            </Field>
            <Field label="Devolução" htmlFor={`${id}-dev`}>
              <input
                id={`${id}-dev`}
                type="date"
                name="devolucao"
                min={levantamento || hojeISO()}
                className={fieldClass}
                suppressHydrationWarning
              />
            </Field>
            <button type="submit" className={buttonClass("primary", "md", "col-span-2 h-12 lg:col-span-1 lg:px-7")}>
              Ver disponíveis
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </>
        )}
      </form>
      </div>
    </div>
  );
}
