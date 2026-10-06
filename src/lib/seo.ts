import { siteConfig } from "@/config/site";
import { nomeCompleto } from "@/lib/format";
import type { Car } from "@/lib/models";

const COMBUSTIVEL_SCHEMA: Record<Car["combustivel"], string> = {
  gasolina: "Gasoline",
  diesel: "Diesel",
  híbrido: "Hybrid",
  elétrico: "Electric",
};

/** JSON-LD schema.org/Vehicle para a página de uma viatura. */
export function vehicleJsonLd(car: Car) {
  const url = `${siteConfig.url}/carro/${car.slug}`;
  const preco = car.tipo === "venda" ? car.precoVenda : car.precoDia;
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${nomeCompleto(car)} ${car.ano}`,
    url,
    image: car.fotos.filter((f) => f.startsWith("http")),
    description: car.descricao,
    brand: { "@type": "Brand", name: car.marca },
    model: car.modelo,
    vehicleModelDate: String(car.ano),
    mileageFromOdometer: { "@type": "QuantitativeValue", value: car.km, unitCode: "KMT" },
    fuelType: COMBUSTIVEL_SCHEMA[car.combustivel],
    vehicleTransmission: car.caixa === "manual" ? "Manual" : "Automatic",
    color: car.cor,
    numberOfDoors: car.portas,
    seatingCapacity: car.lugares,
    ...(preco
      ? {
          offers: {
            "@type": "Offer",
            url,
            price: preco,
            priceCurrency: "EUR",
            ...(car.tipo === "aluguer" && {
              priceSpecification: { "@type": "UnitPriceSpecification", price: preco, priceCurrency: "EUR", unitCode: "DAY" },
            }),
            availability:
              car.estado === "disponivel" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
            seller: { "@type": "AutoDealer", "@id": `${siteConfig.url}/#stand`, name: siteConfig.defaults.nome },
          },
        }
      : {}),
  };
}

/** Serializa JSON-LD de forma segura para <script>. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
