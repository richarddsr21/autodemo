import { sampleCars } from "@/data/seed";
import type { Car, TipoCarro } from "@/lib/models";
import { applyCarFilter } from "@/lib/repository/filter";
import { parseCatalogParams, toCarFilter } from "./catalog-params";

export interface CatalogInitialData {
  carros: Car[];
  todos: Car[];
}

/**
 * Lista inicial do catálogo gerada no servidor (HTML com as viaturas e fotos
 * logo no primeiro carregamento). Na demonstração vem dos dados de exemplo e é
 * substituída pelos dados do navegador assim que estes são lidos; com Supabase
 * passa a vir da base de dados real.
 */
export function catalogInitialData(
  tipo: TipoCarro,
  searchParams: Record<string, string | string[] | undefined>,
): CatalogInitialData {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === "string") sp.set(k, v);
  }
  const params = parseCatalogParams(sp);
  const exemplos = sampleCars();
  return {
    carros: applyCarFilter(exemplos, toCarFilter(tipo, params)),
    todos: applyCarFilter(exemplos, { tipo }),
  };
}
