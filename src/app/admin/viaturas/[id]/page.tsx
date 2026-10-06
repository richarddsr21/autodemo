import type { Metadata } from "next";
import { CarEditor } from "@/features/admin/viaturas/car-editor";

export const metadata: Metadata = { title: "Editar viatura" };

export default async function EditarViaturaPage({ params }: PageProps<"/admin/viaturas/[id]">) {
  const { id } = await params;
  return <CarEditor id={decodeURIComponent(id)} />;
}
