import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { CatalogSkeleton } from "@/features/catalogo/car-card";
import { catalogInitialData } from "@/features/catalogo/catalog-initial";
import { CatalogView } from "@/features/catalogo/catalog-view";

export const metadata: Metadata = {
  title: "Comprar viaturas",
  description: "Viaturas usadas e seminovas à venda, revistas e com garantia. Filtre por marca, preço, ano e combustível.",
  alternates: { canonical: "/comprar" },
};

export default async function ComprarPage({ searchParams }: PageProps<"/comprar">) {
  const initial = catalogInitialData("venda", await searchParams);
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Início" }, { label: "Comprar" }]}
        title="Viaturas à venda"
        subtitle="Stock selecionado, revisto e com garantia. Encontrou a sua? Fale connosco no WhatsApp em segundos."
      />
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogView tipo="venda" initial={initial} />
      </Suspense>
    </>
  );
}
