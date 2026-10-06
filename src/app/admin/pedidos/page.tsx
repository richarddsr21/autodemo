import type { Metadata } from "next";
import { PedidosAdmin } from "@/features/pedidos/pedidos-admin";

export const metadata: Metadata = { title: "Pedidos" };

export default function PedidosPage() {
  return <PedidosAdmin />;
}
