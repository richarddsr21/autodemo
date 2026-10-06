import type { Metadata } from "next";
import { sampleCars } from "@/data/seed";
import { CarDetail } from "@/features/catalogo/detalhe/car-detail";
import { formatEuro, nomeCompleto } from "@/lib/format";
import { jsonLdScript, vehicleJsonLd } from "@/lib/seo";

/*
 * As viaturas de exemplo são geradas estaticamente (com SEO completo).
 * Viaturas criadas no painel vivem no navegador e são carregadas no cliente.
 */

const findSample = (slug: string) => sampleCars().find((c) => c.slug === slug) ?? null;

export function generateStaticParams() {
  return sampleCars().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/carro/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const car = findSample(slug);
  if (!car) return { title: "Viatura" };

  const titulo = `${nomeCompleto(car)} ${car.ano}`;
  const preco =
    car.tipo === "venda"
      ? car.precoVenda && formatEuro(car.precoVenda)
      : car.precoDia && `${formatEuro(car.precoDia)}/dia`;
  const descricao = `${car.tipo === "venda" ? "À venda" : "Para alugar"}${preco ? ` por ${preco}` : ""}. ${car.descricao}`.slice(0, 160);

  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: `/carro/${car.slug}` },
    openGraph: {
      title: titulo,
      description: descricao,
      type: "website",
      images: car.fotos[0] ? [{ url: car.fotos[0], alt: titulo }] : undefined,
    },
  };
}

export default async function CarPage({ params }: PageProps<"/carro/[slug]">) {
  const { slug } = await params;
  const car = findSample(slug);
  return (
    <>
      {car && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(vehicleJsonLd(car)) }} />}
      <CarDetail slug={slug} initialCar={car} />
    </>
  );
}
