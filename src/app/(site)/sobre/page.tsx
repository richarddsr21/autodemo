import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { AboutView } from "@/features/definicoes/about-view";

export const metadata: Metadata = {
  title: "Sobre nós",
  description: "Conheça o nosso stand de venda e aluguer de automóveis feito de confiança, transparência e proximidade.",
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <>
      <PageHeader crumbs={[{ href: "/", label: "Início" }, { label: "Sobre" }]} title="Sobre nós" subtitle="Quem somos e como trabalhamos." />
      <AboutView />
    </>
  );
}
