"use client";

import { CalendarRange, SlidersHorizontal, X } from "lucide-react";
import { DataError } from "@/components/ui/data-error";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { container } from "@/components/ui/container";
import { selectLight } from "@/components/ui/form";
import { Sheet } from "@/components/ui/sheet";
import { diasEntre } from "@/lib/dates";
import { formatData, formatEuro, formatKm } from "@/lib/format";
import { CAIXA_LABEL, CATEGORIA_LABEL, COMBUSTIVEL_LABEL, type Car, type Ordenacao, type TipoCarro } from "@/lib/models";
import { CarCard, CarCardSkeleton } from "./car-card";
import {
  countActive,
  parseCatalogParams,
  toCarFilter,
  toSearchString,
  type CatalogParams,
  type FilterKey,
} from "./catalog-params";
import type { CatalogInitialData } from "./catalog-initial";
import { FilterPanel } from "./filter-panel";
import { useCars } from "./use-cars";

const ORDENS: Record<TipoCarro, { value: Ordenacao; label: string }[]> = {
  venda: [
    { value: "recentes", label: "Mais recentes" },
    { value: "preco-asc", label: "Preço: mais baixo" },
    { value: "preco-desc", label: "Preço: mais alto" },
    { value: "ano-desc", label: "Ano: mais novo" },
    { value: "km-asc", label: "Menos quilómetros" },
  ],
  aluguer: [
    { value: "recentes", label: "Mais recentes" },
    { value: "preco-asc", label: "Preço/dia: mais baixo" },
    { value: "preco-desc", label: "Preço/dia: mais alto" },
  ],
};

function chipLabel(key: FilterKey, p: CatalogParams, tipo: TipoCarro): string {
  switch (key) {
    case "marca":
      return p.marca ?? "";
    case "categoria":
      return p.categoria ? CATEGORIA_LABEL[p.categoria] : "";
    case "combustivel":
      return p.combustivel ? COMBUSTIVEL_LABEL[p.combustivel] : "";
    case "caixa":
      return p.caixa ? CAIXA_LABEL[p.caixa] : "";
    case "precoMin":
      return `Desde ${formatEuro(p.precoMin ?? 0)}`;
    case "precoMax":
      return tipo === "venda" ? `Até ${formatEuro(p.precoMax ?? 0)}` : `Até ${formatEuro(p.precoMax ?? 0)}/dia`;
    case "anoMin":
      return `Desde ${p.anoMin}`;
    case "kmMax":
      return `Até ${formatKm(p.kmMax ?? 0)}`;
    case "lugaresMin":
      return `${p.lugaresMin}+ lugares`;
  }
}

const ordemEstado = (c: Car) => (c.estado === "disponivel" ? 0 : 1);

export function CatalogView({ tipo, initial }: { tipo: TipoCarro; initial?: CatalogInitialData }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useMemo(() => parseCatalogParams(new URLSearchParams(searchParams.toString())), [searchParams]);
  const [gaveta, setGaveta] = useState(false);

  const { data, loading, error } = useCars(toCarFilter(tipo, params), initial?.carros);
  const { data: todos } = useCars({ tipo }, initial?.todos);
  // Viaturas disponíveis primeiro; vendidas/alugadas ficam visíveis no fim.
  const carros = useMemo(() => [...(data ?? [])].sort((a, b) => ordemEstado(a) - ordemEstado(b)), [data]);
  const marcas = useMemo(
    () => [...new Set((todos ?? []).map((c) => c.marca))].sort((a, b) => a.localeCompare(b, "pt-PT")),
    [todos],
  );

  const navegar = (next: CatalogParams) => router.replace(`${pathname}${toSearchString(next)}`, { scroll: false });
  const setFiltro = <K extends FilterKey>(key: K, value: CatalogParams[K] | undefined) =>
    navegar({ ...params, [key]: value });
  const limpar = () =>
    navegar({ ordenar: params.ordenar, levantamento: params.levantamento, devolucao: params.devolucao });

  const ativos = (Object.keys(params) as (keyof CatalogParams)[]).filter(
    (k): k is FilterKey => k !== "ordenar" && k !== "levantamento" && k !== "devolucao",
  );
  const nAtivos = countActive(params);
  const dias = params.levantamento && params.devolucao ? diasEntre(params.levantamento, params.devolucao) : 0;
  const queryDatas =
    tipo === "aluguer" && params.levantamento
      ? toSearchString({ levantamento: params.levantamento, devolucao: params.devolucao })
      : "";
  const total = carros.length;
  const contagem = loading && !data ? "A carregar…" : `${total} ${total === 1 ? "viatura" : "viaturas"}`;

  const painel = <FilterPanel tipo={tipo} params={params} marcas={marcas} onChange={setFiltro} />;

  return (
    <div className="bg-light text-ink">
      <div className={`${container} grid gap-8 py-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-14`}>
        {/* Filtros: painel lateral no desktop */}
        <aside className="hidden lg:block" aria-label="Filtros">
          <div className="sticky top-24 rounded-2xl border border-line-ink bg-light-surface p-5 shadow-[var(--shadow-soft)]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold">
                <SlidersHorizontal className="size-4 text-gold-ink" aria-hidden="true" />
                Filtros
              </h2>
              {nAtivos > 0 && (
                <button type="button" onClick={limpar} className="text-sm font-medium text-gold-ink hover:underline">
                  Limpar
                </button>
              )}
            </div>
            {painel}
          </div>
        </aside>

        <div>
          {tipo === "aluguer" && params.levantamento && (
            <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-gold/40 bg-light-surface p-4 text-sm">
              <CalendarRange className="size-5 text-gold-ink" aria-hidden="true" />
              <p className="flex-1">
                <strong>{formatData(params.levantamento)}</strong>
                {params.devolucao && (
                  <>
                    {" "}
                    → <strong>{formatData(params.devolucao)}</strong>
                    {dias > 0 && ` · ${dias} ${dias === 1 ? "dia" : "dias"}`}
                  </>
                )}
                <span className="block text-muted-ink">
                  As datas seguem para o pedido de reserva. A disponibilidade é confirmada pelo stand.
                </span>
              </p>
              <button
                type="button"
                onClick={() => navegar({ ...params, levantamento: undefined, devolucao: undefined })}
                className="font-medium text-gold-ink hover:underline"
              >
                Alterar datas
              </button>
            </div>
          )}

          {/* Barra de resultados */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-medium" aria-live="polite">
              {contagem}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGaveta(true)}
                className={buttonClass("outlineInk", "md", "bg-light-surface lg:hidden")}
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                Filtros
                {nAtivos > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-gold text-[11px] text-on-gold">
                    {nAtivos}
                  </span>
                )}
              </button>
              <label htmlFor="ordenar" className="sr-only">
                Ordenar por
              </label>
              <select
                id="ordenar"
                className={`${selectLight} h-11 w-auto bg-light-surface`}
                value={params.ordenar ?? "recentes"}
                onChange={(e) => navegar({ ...params, ordenar: e.target.value as Ordenacao })}
              >
                {ORDENS[tipo].map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {ativos.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Filtros ativos">
              {ativos.map((k) => (
                <li key={k}>
                  <button
                    type="button"
                    onClick={() => setFiltro(k, undefined)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full bg-ink px-3 text-xs font-medium text-light transition-colors hover:bg-ink/85"
                    aria-label={`Remover filtro ${chipLabel(k, params, tipo)}`}
                  >
                    {chipLabel(k, params, tipo)}
                    <X className="size-3.5" aria-hidden="true" />
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={limpar} className="h-8 px-2 text-xs font-semibold text-gold-ink hover:underline">
                  Limpar tudo
                </button>
              </li>
            </ul>
          )}

          {error && !data && <DataError className="mt-6" />}

          <h2 className="sr-only">Resultados</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {loading && !data
              ? Array.from({ length: 6 }, (_, i) => <CarCardSkeleton key={i} />)
              : carros.map((car, i) => <CarCard key={car.id} car={car} preload={i < 2} query={queryDatas} />)}
          </div>

          {!loading && !error && total === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-ink/20 bg-light-surface px-6 py-14 text-center">
              <p className="font-display text-xl font-semibold">Nenhuma viatura corresponde à pesquisa</p>
              <p className="mx-auto mt-2 max-w-md text-muted-ink">
                Experimente alargar os filtros ou fale connosco: muitas viaturas chegam antes de serem publicadas.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {nAtivos > 0 && (
                  <button type="button" onClick={limpar} className={buttonClass("primary")}>
                    Limpar filtros
                  </button>
                )}
                <Link href="/contactos" className={buttonClass("outlineInk")}>
                  Falar connosco
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filtros: gaveta no telemóvel */}
      <Sheet
        open={gaveta}
        onClose={() => setGaveta(false)}
        title="Filtros"
        footer={
          <div className="flex gap-3">
            <button type="button" onClick={limpar} disabled={nAtivos === 0} className={buttonClass("outlineInk", "lg", "flex-1")}>
              Limpar
            </button>
            <button type="button" onClick={() => setGaveta(false)} className={buttonClass("primary", "lg", "flex-[2]")}>
              Ver {total} {total === 1 ? "resultado" : "resultados"}
            </button>
          </div>
        }
      >
        {painel}
      </Sheet>
    </div>
  );
}
