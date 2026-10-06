"use client";

import { Inbox } from "lucide-react";
import { DataError } from "@/components/ui/data-error";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Chip } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { useCars } from "@/features/catalogo/use-cars";
import { useSettings } from "@/features/definicoes/use-settings";
import { ESTADOS_CARRO, TIPOS_PEDIDO, type Pedido, type TipoPedido } from "@/lib/models";
import { PedidoCard } from "./pedido-card";
import { TIPO_PEDIDO } from "./pedido-meta";
import { usePedidoMutations, usePedidos } from "./use-pedidos";

type FiltroEstado = "por-tratar" | "tratados" | "todos";

const ESTADOS: { value: FiltroEstado; label: string }[] = [
  { value: "por-tratar", label: "Por tratar" },
  { value: "tratados", label: "Tratados" },
  { value: "todos", label: "Todos" },
];

export function PedidosAdmin() {
  const [estado, setEstado] = useState<FiltroEstado>("por-tratar");
  const [tipo, setTipo] = useState<TipoPedido | undefined>();
  const [aApagar, setAApagar] = useState<Pedido | null>(null);
  const { data: todos } = usePedidos();
  const { data, loading, error } = usePedidos({
    tipo,
    tratado: estado === "todos" ? undefined : estado === "tratados",
  });
  const { data: carros } = useCars({ estados: [...ESTADOS_CARRO] });
  const { setTratado, remove } = usePedidoMutations();
  const { nome } = useSettings();
  const toast = useToast();
  const carroPorId = new Map((carros ?? []).map((c) => [c.id, c]));
  const nPorTratar = (todos ?? []).filter((p) => !p.tratado).length;
  const pedidos = data ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-semibold">Pedidos</h1>
      <p className="mt-1 text-muted-ink">Reservas, contactos e pedidos de avaliação feitos no site.</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Estado" className="flex w-fit rounded-xl border border-line-ink bg-light-surface p-1">
          {ESTADOS.map((e) => (
            <button
              key={e.value}
              type="button"
              aria-pressed={estado === e.value}
              onClick={() => setEstado(e.value)}
              className={`flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors ${estado === e.value ? "bg-ink text-light" : "text-ink hover:bg-light"}`}
            >
              {e.label}
              {e.value === "por-tratar" && nPorTratar > 0 && (
                <span className="rounded-full bg-gold px-1.5 text-xs font-semibold text-on-gold">{nPorTratar}</span>
              )}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Tipo de pedido">
          {TIPOS_PEDIDO.map((t) => (
            <Chip key={t} active={tipo === t} onClick={() => setTipo(tipo === t ? undefined : t)}>
              {TIPO_PEDIDO[t].label}
            </Chip>
          ))}
        </div>
      </div>

      <p className="mt-5 text-sm text-muted-ink" aria-live="polite">
        {loading && !data ? "A carregar…" : `${pedidos.length} ${pedidos.length === 1 ? "pedido" : "pedidos"}`}
      </p>

      {error && !data && <DataError className="mt-3" />}
      {pedidos.length > 0 ? (
        <ul className="mt-3 divide-y divide-line-ink rounded-2xl border border-line-ink bg-light-surface">
          {pedidos.map((p) => (
            <li key={p.id}>
              <PedidoCard
                pedido={p}
                car={p.carroId ? carroPorId.get(p.carroId) : undefined}
                nomeStand={nome}
                onTratado={(t) => setTratado(p.id, t).then(() => toast(t ? "Pedido marcado como tratado." : "Pedido marcado como por tratar."))}
                onApagar={() => setAApagar(p)}
              />
            </li>
          ))}
        </ul>
      ) : (
        !loading && !error && (
          <div className="mt-3 rounded-2xl border border-dashed border-ink/20 bg-light-surface px-6 py-14 text-center">
            <Inbox className="mx-auto size-8 text-ink/30" aria-hidden="true" />
            <p className="mt-3 font-semibold">{estado === "por-tratar" ? "Está tudo tratado!" : "Sem pedidos"}</p>
            <p className="mt-1 text-sm text-muted-ink">
              Quando alguém pedir uma reserva, um contacto ou uma avaliação no site, o pedido aparece aqui.
            </p>
          </div>
        )
      )}

      <ConfirmDialog
        open={!!aApagar}
        perigo
        titulo="Apagar este pedido?"
        texto={aApagar ? `O pedido de ${aApagar.nome} vai ser removido. Esta ação não pode ser desfeita.` : ""}
        confirmar="Sim, apagar"
        onCancel={() => setAApagar(null)}
        onConfirm={() => {
          if (aApagar) remove(aApagar.id).then(() => toast("Pedido apagado."));
          setAApagar(null);
        }}
      />
    </div>
  );
}
