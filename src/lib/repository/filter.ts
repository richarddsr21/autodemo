import type { Car, CarFilter, EstadoCarro } from "@/lib/models";

const ESTADOS_PUBLICOS: EstadoCarro[] = ["disponivel", "vendido", "alugado"];

/** Preço relevante para ordenar/filtrar: venda ou dia, conforme o tipo. */
export function precoDe(car: Car): number {
  return (car.tipo === "venda" ? car.precoVenda : car.precoDia) ?? 0;
}

function normalizar(texto: string): string {
  return texto
    .toLocaleLowerCase("pt-PT")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Filtro e ordenação em memória (usado pela implementação local). */
export function applyCarFilter(cars: Car[], filter: CarFilter = {}): Car[] {
  const estados = filter.estados ?? ESTADOS_PUBLICOS;
  const texto = filter.texto ? normalizar(filter.texto.trim()) : "";

  const result = cars.filter((car) => {
    if (!estados.includes(car.estado)) return false;
    if (filter.tipo && car.tipo !== filter.tipo) return false;
    if (filter.marca && normalizar(car.marca) !== normalizar(filter.marca)) return false;
    if (filter.categoria && car.categoria !== filter.categoria) return false;
    if (filter.combustivel && car.combustivel !== filter.combustivel) return false;
    if (filter.caixa && car.caixa !== filter.caixa) return false;
    if (filter.precoMin !== undefined && precoDe(car) < filter.precoMin) return false;
    if (filter.precoMax !== undefined && precoDe(car) > filter.precoMax) return false;
    if (filter.anoMin !== undefined && car.ano < filter.anoMin) return false;
    if (filter.kmMax !== undefined && car.km > filter.kmMax) return false;
    if (filter.lugaresMin !== undefined && car.lugares < filter.lugaresMin) return false;
    if (filter.destaque !== undefined && car.destaque !== filter.destaque) return false;
    if (texto && !normalizar(`${car.marca} ${car.modelo} ${car.versao ?? ""}`).includes(texto)) return false;
    return true;
  });

  const ordenar = filter.ordenar ?? "recentes";
  result.sort((a, b) => {
    switch (ordenar) {
      case "preco-asc":
        return precoDe(a) - precoDe(b);
      case "preco-desc":
        return precoDe(b) - precoDe(a);
      case "ano-desc":
        return b.ano - a.ano;
      case "km-asc":
        return a.km - b.km;
      default:
        return b.criadoEm.localeCompare(a.criadoEm);
    }
  });

  return filter.limite !== undefined ? result.slice(0, filter.limite) : result;
}
