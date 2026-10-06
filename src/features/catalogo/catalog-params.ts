import { isISODate } from "@/lib/dates";
import {
  CAIXAS,
  CATEGORIAS,
  COMBUSTIVEIS,
  ORDENACOES,
  type CarFilter,
  type Ordenacao,
  type TipoCarro,
} from "@/lib/models";

/** Filtros do catálogo que vivem no URL (?marca=BMW&precoMax=30000...). */
export type CatalogParams = Pick<
  CarFilter,
  "marca" | "categoria" | "combustivel" | "caixa" | "precoMin" | "precoMax" | "anoMin" | "kmMax" | "lugaresMin"
> & {
  ordenar?: Ordenacao;
  /** Datas do aluguer (não filtram; seguem para o pedido de reserva). */
  levantamento?: string;
  devolucao?: string;
};

export type FilterKey = Exclude<keyof CatalogParams, "ordenar" | "levantamento" | "devolucao">;

function pickEnum<T extends string>(v: string | null, list: readonly T[]): T | undefined {
  return v !== null && (list as readonly string[]).includes(v) ? (v as T) : undefined;
}

function pickNum(v: string | null): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export function parseCatalogParams(sp: URLSearchParams): CatalogParams {
  const p: CatalogParams = {
    marca: sp.get("marca")?.trim() || undefined,
    categoria: pickEnum(sp.get("categoria"), CATEGORIAS),
    combustivel: pickEnum(sp.get("combustivel"), COMBUSTIVEIS),
    caixa: pickEnum(sp.get("caixa"), CAIXAS),
    precoMin: pickNum(sp.get("precoMin")),
    precoMax: pickNum(sp.get("precoMax")),
    anoMin: pickNum(sp.get("anoMin")),
    kmMax: pickNum(sp.get("kmMax")),
    lugaresMin: pickNum(sp.get("lugaresMin")),
    ordenar: pickEnum(sp.get("ordenar"), ORDENACOES),
    levantamento: isISODate(sp.get("levantamento")) ? (sp.get("levantamento") ?? undefined) : undefined,
    devolucao: isISODate(sp.get("devolucao")) ? (sp.get("devolucao") ?? undefined) : undefined,
  };
  return Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) as CatalogParams;
}

export function toSearchString(p: CatalogParams): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(p)) {
    if (v !== undefined && v !== "") sp.set(k, String(v));
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

const FILTER_KEYS: readonly FilterKey[] = [
  "marca",
  "categoria",
  "combustivel",
  "caixa",
  "precoMin",
  "precoMax",
  "anoMin",
  "kmMax",
  "lugaresMin",
];

/** Converte os parâmetros do URL no filtro do repositório (as datas ficam de fora). */
export function toCarFilter(tipo: TipoCarro, p: CatalogParams): CarFilter {
  const filtro: CarFilter = { tipo, ordenar: p.ordenar };
  for (const k of FILTER_KEYS) {
    if (p[k] !== undefined) Object.assign(filtro, { [k]: p[k] });
  }
  return filtro;
}

/** Quantos filtros (não ordenação nem datas) estão ativos. */
export function countActive(p: CatalogParams): number {
  return FILTER_KEYS.filter((k) => p[k] !== undefined).length;
}
