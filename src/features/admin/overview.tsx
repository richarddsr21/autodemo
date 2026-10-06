"use client";

import { BadgeCheck, CalendarCheck, Car, Inbox, KeyRound, Plus, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useCars } from "@/features/catalogo/use-cars";
import { useSettings } from "@/features/definicoes/use-settings";
import { PedidoCard } from "@/features/pedidos/pedido-card";
import { usePedidoMutations, usePedidos } from "@/features/pedidos/use-pedidos";
import { ESTADOS_CARRO, type Car as CarModel } from "@/lib/models";
import { PlanUsage } from "./plan-usage";

function Stat({ label, valor, Icon, href, destaque }: { label: string; valor: number | string; Icon: LucideIcon; href: string; destaque?: boolean }) {
  return (
    <Link
      href={href}
      className={`group rounded-2xl border p-5 transition-colors ${destaque ? "border-gold bg-bg text-text hover:bg-surface" : "border-line-ink bg-light-surface hover:border-gold-ink"}`}
    >
      <Icon className={`size-5 ${destaque ? "text-gold" : "text-gold-ink"}`} aria-hidden="true" />
      <p className="mt-4 font-display text-3xl font-semibold">{valor}</p>
      <p className={`mt-1 text-sm ${destaque ? "text-text/75" : "text-muted-ink"}`}>{label}</p>
    </Link>
  );
}

export function Overview() {
  const { data: carros } = useCars({ estados: [...ESTADOS_CARRO] });
  const { data: pedidos } = usePedidos();
  const { setTratado } = usePedidoMutations();
  const { nome } = useSettings();
  const toast = useToast();

  const lista = carros ?? [];
  const conta = (f: (c: CarModel) => boolean) => (carros ? lista.filter(f).length : "–");
  const porTratar = (pedidos ?? []).filter((p) => !p.tratado);
  const ultimos = (pedidos ?? []).slice(0, 5);
  const carroPorId = new Map(lista.map((c) => [c.id, c]));

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Olá! 👋</h1>
          <p className="mt-1 text-muted-ink">Resumo do stand e dos pedidos mais recentes.</p>
        </div>
        <Link href="/admin/viaturas/nova" className={buttonClass("primary", "lg")}>
          <Plus className="size-5" aria-hidden="true" />
          Adicionar viatura
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <Stat label="À venda" valor={conta((c) => c.tipo === "venda" && c.estado === "disponivel")} Icon={Car} href="/admin/viaturas" />
        <Stat label="Para aluguer" valor={conta((c) => c.tipo === "aluguer" && c.estado === "disponivel")} Icon={KeyRound} href="/admin/viaturas" />
        <Stat label="Vendidas" valor={conta((c) => c.estado === "vendido")} Icon={BadgeCheck} href="/admin/viaturas" />
        <Stat label="Alugadas" valor={conta((c) => c.estado === "alugado")} Icon={CalendarCheck} href="/admin/viaturas" />
        <Stat label="Pedidos por tratar" valor={pedidos ? porTratar.length : "–"} Icon={Inbox} href="/admin/pedidos" destaque />
      </div>

      <div className="mt-6 rounded-2xl border border-line-ink bg-light-surface p-5">
        <PlanUsage total={lista.length} />
      </div>

      <section aria-labelledby="pedidos-titulo" className="mt-8 rounded-2xl border border-line-ink bg-light-surface">
        <div className="flex items-center justify-between border-b border-line-ink px-5 py-4">
          <h2 id="pedidos-titulo" className="text-lg font-semibold">
            Últimos pedidos
          </h2>
          <Link href="/admin/pedidos" className="text-sm font-semibold text-gold-ink hover:text-ink">
            Ver todos
          </Link>
        </div>
        {ultimos.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Inbox className="mx-auto size-8 text-ink/30" aria-hidden="true" />
            <p className="mt-3 font-medium">Ainda não há pedidos</p>
            <p className="mt-1 text-sm text-muted-ink">
              Os pedidos de reserva, contacto e “vender o meu carro” feitos no site aparecem aqui.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line-ink">
            {ultimos.map((p) => (
              <li key={p.id} className="px-5 py-4">
                <PedidoCard
                  compacto
                  pedido={p}
                  car={p.carroId ? carroPorId.get(p.carroId) : undefined}
                  nomeStand={nome}
                  onTratado={(t) => setTratado(p.id, t).then(() => toast(t ? "Pedido marcado como tratado." : "Pedido marcado como por tratar."))}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
