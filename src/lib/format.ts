import type { Car } from "@/lib/models";

const euro = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const numero = new Intl.NumberFormat("pt-PT");

export const formatEuro = (valor: number) => euro.format(valor);
export const formatKm = (km: number) => `${numero.format(km)} km`;
export const formatNumero = (n: number) => numero.format(n);

export function nomeCarro(car: Pick<Car, "marca" | "modelo">): string {
  return `${car.marca} ${car.modelo}`;
}

export function nomeCompleto(car: Pick<Car, "marca" | "modelo" | "versao">): string {
  return [car.marca, car.modelo, car.versao].filter(Boolean).join(" ");
}

export function formatData(iso: string): string {
  // Datas sem hora (AAAA-MM-DD) formatam-se sem conversão de fuso horário.
  const soData = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (soData) return `${soData[3]}/${soData[2]}/${soData[1]}`;
  return new Date(iso).toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" });
}
