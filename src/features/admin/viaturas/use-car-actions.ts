"use client";

import {
  BadgeCheck,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  KeyRound,
  Pencil,
  RotateCcw,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { MenuItem } from "@/components/ui/menu";
import { useToast } from "@/components/ui/toast";
import { useCarMutations } from "@/features/catalogo/use-cars";
import { toCarInput } from "@/lib/car-input";
import { nomeCarro } from "@/lib/format";
import type { Car, CarInput, EstadoCarro } from "@/lib/models";

const MENSAGEM_ESTADO: Record<EstadoCarro, string> = {
  disponivel: "está agora disponível no site",
  vendido: "foi marcada como vendida",
  alugado: "foi marcada como alugada",
  escondido: "foi escondida do site",
};

/** Ações rápidas sobre uma viatura, com aviso de confirmação no ecrã. */
export function useCarActions() {
  const { update, create, remove } = useCarMutations();
  const toast = useToast();
  const router = useRouter();

  const executar = async (acao: () => Promise<unknown>, sucesso: string) => {
    try {
      await acao();
      toast(sucesso);
    } catch {
      toast("Não foi possível concluir a ação. Tente novamente.", "erro");
    }
  };

  const setEstado = (car: Car, estado: EstadoCarro) =>
    executar(() => update(car.id, { estado }), `${nomeCarro(car)} ${MENSAGEM_ESTADO[estado]}.`);

  const toggleDestaque = (car: Car) =>
    executar(
      () => update(car.id, { destaque: !car.destaque }),
      car.destaque ? `${nomeCarro(car)} deixou de estar em destaque.` : `${nomeCarro(car)} está agora em destaque.`,
    );

  const duplicar = (car: Car) => {
    const copia: CarInput = { ...toCarInput(car), destaque: false, estado: "escondido" };
    return executar(() => create(copia), `Cópia de ${nomeCarro(car)} criada (escondida). Edite-a e mostre-a no site.`);
  };

  const apagar = (car: Car) => executar(() => remove(car.id), `${nomeCarro(car)} foi apagada.`);

  /** Itens do menu "⋯" de uma viatura. `pedirApagar` abre a confirmação. */
  const menuItems = (car: Car, pedirApagar: (car: Car) => void): MenuItem[] => {
    const items: MenuItem[] = [
      { label: "Editar", Icon: Pencil, onSelect: () => router.push(`/admin/viaturas/${car.id}`) },
    ];
    if (car.tipo === "venda") {
      items.push(
        car.estado === "vendido"
          ? { label: "Voltar a pôr à venda", Icon: RotateCcw, onSelect: () => setEstado(car, "disponivel") }
          : { label: "Marcar como vendido", Icon: BadgeCheck, onSelect: () => setEstado(car, "vendido") },
      );
    } else {
      items.push(
        car.estado === "alugado"
          ? { label: "Marcar como disponível", Icon: RotateCcw, onSelect: () => setEstado(car, "disponivel") }
          : { label: "Marcar como alugado", Icon: KeyRound, onSelect: () => setEstado(car, "alugado") },
      );
    }
    items.push(
      car.estado === "escondido"
        ? { label: "Mostrar no site", Icon: Eye, onSelect: () => setEstado(car, "disponivel") }
        : { label: "Esconder do site", Icon: EyeOff, onSelect: () => setEstado(car, "escondido") },
      car.destaque
        ? { label: "Remover destaque", Icon: StarOff, onSelect: () => toggleDestaque(car) }
        : { label: "Destacar na página inicial", Icon: Star, onSelect: () => toggleDestaque(car) },
      { label: "Duplicar", Icon: Copy, onSelect: () => duplicar(car) },
    );
    if (car.estado !== "escondido") {
      items.push({
        label: "Ver no site",
        Icon: ExternalLink,
        onSelect: () => window.open(`/carro/${car.slug}`, "_blank", "noopener"),
      });
    }
    items.push({ label: "Apagar", Icon: Trash2, onSelect: () => pedirApagar(car), perigo: true });
    return items;
  };

  return { setEstado, toggleDestaque, duplicar, apagar, menuItems };
}
