import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { FavoritesView } from "@/features/catalogo/favorites-view";

export const metadata: Metadata = {
  title: "Os meus favoritos",
  robots: { index: false },
};

export default function FavoritosPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Início" }, { label: "Favoritos" }]}
        title="Os meus favoritos"
        subtitle="As viaturas que guardou para ver com calma."
      />
      <FavoritesView />
    </>
  );
}
