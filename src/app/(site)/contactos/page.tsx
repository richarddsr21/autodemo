import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ContactView } from "@/features/definicoes/contact-view";

export const metadata: Metadata = {
  title: "Contactos",
  description: "Fale connosco: telefone, WhatsApp, e-mail, morada e horário do stand.",
  alternates: { canonical: "/contactos" },
};

export default function ContactosPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Início" }, { label: "Contactos" }]}
        title="Contactos"
        subtitle="Visite-nos no stand ou fale connosco por telefone, WhatsApp ou e-mail."
      />
      <ContactView />
    </>
  );
}
