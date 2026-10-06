import { CalendarCheck, MessageSquare, Tag, type LucideIcon } from "lucide-react";
import { nomeCompleto } from "@/lib/format";
import type { Car, Pedido, TipoPedido } from "@/lib/models";

export const TIPO_PEDIDO: Record<TipoPedido, { label: string; Icon: LucideIcon }> = {
  reserva: { label: "Reserva", Icon: CalendarCheck },
  contacto: { label: "Contacto", Icon: MessageSquare },
  "venda-o-meu-carro": { label: "Vender o meu carro", Icon: Tag },
};

/** Mensagem inicial para responder a um pedido pelo WhatsApp. */
export function respostaPedido(p: Pedido, car: Car | undefined, nomeStand: string): string {
  const primeiroNome = p.nome.trim().split(/\s+/)[0];
  const sobre =
    p.tipo === "venda-o-meu-carro"
      ? " para avaliar o seu carro"
      : car
        ? ` sobre o ${nomeCompleto(car)}`
        : "";
  return `Olá ${primeiroNome}! Fala ${nomeStand}. Recebemos o seu pedido${sobre}.`;
}
