import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { CatalogSkeleton } from "@/features/catalogo/car-card";
import { catalogInitialData } from "@/features/catalogo/catalog-initial";
import { CatalogView } from "@/features/catalogo/catalog-view";

export const metadata: Metadata = {
  title: "Alugar viaturas",
  description: "Aluguer de viaturas ao dia, com seguro incluído e levantamento rápido. Peça a sua reserva por WhatsApp.",
  alternates: { canonical: "/alugar" },
};

export default async function AlugarPage({ searchParams }: PageProps<"/alugar">) {
  const initial = catalogInitialData("aluguer", await searchParams);
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Início" }, { label: "Alugar" }]}
        title="Aluguer de viaturas"
        subtitle="Escolha a viatura, indique as datas e receba a confirmação pelo WhatsApp. Seguro incluído, sem custos escondidos."
      />
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogView tipo="aluguer" initial={initial} />
      </Suspense>
    </>
  );
}
