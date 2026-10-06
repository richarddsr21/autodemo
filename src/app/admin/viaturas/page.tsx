import type { Metadata } from "next";
import { CarList } from "@/features/admin/viaturas/car-list";

export const metadata: Metadata = { title: "Viaturas" };

export default function ViaturasPage() {
  return <CarList />;
}
