import type { Metadata } from "next";
import { CarForm } from "@/features/admin/viaturas/car-form";

export const metadata: Metadata = { title: "Adicionar viatura" };

export default function NovaViaturaPage() {
  return <CarForm />;
}
