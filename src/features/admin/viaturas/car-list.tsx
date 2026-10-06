"use client";

import { Pencil, Plus, Search, Star } from "lucide-react";
import { DataError } from "@/components/ui/data-error";
import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { CarImage } from "@/components/ui/car-image";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { inputLight, selectLight } from "@/components/ui/form";
import { ActionMenu } from "@/components/ui/menu";
import { useCars } from "@/features/catalogo/use-cars";
import { formatEuro, nomeCarro } from "@/lib/format";
import { ESTADOS_CARRO, ESTADO_LABEL, type Car, type EstadoCarro, type TipoCarro } from "@/lib/models";
import { PlanUsage } from "../plan-usage";
import { EstadoBadge } from "./estado-badge";
import { useCarActions } from "./use-car-actions";

function preco(car: Car) {
  return car.tipo === "venda"
    ? car.precoVenda
      ? formatEuro(car.precoVenda)
      : "—"
    : car.precoDia
      ? `${formatEuro(car.precoDia)}/dia`
      : "—";
}

const TIPOS: { value: TipoCarro | ""; label: string }[] = [
  { value: "", label: "Todas" },
  { value: "venda", label: "Venda" },
  { value: "aluguer", label: "Aluguer" },
];

export function CarList() {
  const [texto, setTexto] = useState("");
  const [tipo, setTipo] = useState<TipoCarro | "">("");
  const [estado, setEstado] = useState<EstadoCarro | "">("");
  const [aApagar, setAApagar] = useState<Car | null>(null);
  const textoAdiado = useDeferredValue(texto);

  const { data: todas } = useCars({ estados: [...ESTADOS_CARRO] });
  const { data, loading, error } = useCars({
    estados: estado ? [estado] : [...ESTADOS_CARRO],
    tipo: tipo || undefined,
    texto: textoAdiado || undefined,
  });
  const acoes = useCarActions();
  const carros = data ?? [];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Viaturas</h1>
          <p className="mt-1 text-muted-ink">Adicione, edite e marque viaturas como vendidas ou alugadas.</p>
        </div>
        <Link href="/admin/viaturas/nova" className={buttonClass("primary", "lg", "hidden sm:inline-flex")}>
          <Plus className="size-5" aria-hidden="true" />
          Adicionar viatura
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border border-line-ink bg-light-surface p-5">
        <PlanUsage total={todas?.length ?? 0} />
      </div>

      {/* Pesquisa e filtros */}
      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-muted-ink" aria-hidden="true" />
          <label htmlFor="pesquisa-viaturas" className="sr-only">
            Pesquisar viaturas
          </label>
          <input
            id="pesquisa-viaturas"
            type="search"
            placeholder="Pesquisar por marca ou modelo…"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className={`${inputLight} bg-light-surface pl-11`}
          />
        </div>
        <div className="flex gap-3">
          <div role="group" aria-label="Tipo" className="flex shrink-0 rounded-xl border border-line-ink bg-light-surface p-1">
            {TIPOS.map((t) => (
              <button
                key={t.value}
                type="button"
                aria-pressed={tipo === t.value}
                onClick={() => setTipo(t.value)}
                className={`h-10 rounded-lg px-3.5 text-sm font-medium transition-colors ${tipo === t.value ? "bg-ink text-light" : "text-ink hover:bg-light"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <label htmlFor="filtro-estado" className="sr-only">
            Estado
          </label>
          <select
            id="filtro-estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value as EstadoCarro | "")}
            className={`${selectLight} min-w-0 flex-1 bg-light-surface md:w-44 md:flex-none`}
          >
            <option value="">Todos os estados</option>
            {ESTADOS_CARRO.map((e) => (
              <option key={e} value={e}>
                {ESTADO_LABEL[e]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-ink" aria-live="polite">
        {loading && !data ? "A carregar…" : `${carros.length} ${carros.length === 1 ? "viatura" : "viaturas"}`}
      </p>

      {/* Lista: tabela no desktop */}
      <div className="mt-3 hidden rounded-2xl border border-line-ink bg-light-surface md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line-ink text-xs tracking-[0.08em] text-muted-ink uppercase">
            <tr>
              <th scope="col" className="px-5 py-3.5 font-semibold">
                Viatura
              </th>
              <th scope="col" className="px-3 py-3.5 font-semibold">
                Tipo
              </th>
              <th scope="col" className="px-3 py-3.5 font-semibold">
                Preço
              </th>
              <th scope="col" className="px-3 py-3.5 font-semibold">
                Estado
              </th>
              <th scope="col" className="px-3 py-3.5 text-center font-semibold">
                Destaque
              </th>
              <th scope="col" className="px-5 py-3.5 text-right font-semibold">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-ink">
            {carros.map((car) => (
              <tr key={car.id} className="transition-colors hover:bg-light/60">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-[#ECEAE4]">
                      <CarImage src={car.fotos[0]} alt="" fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <Link href={`/admin/viaturas/${car.id}`} className="font-semibold hover:text-gold-ink">
                        {nomeCarro(car)}
                      </Link>
                      <p className="truncate text-muted-ink">
                        {[car.versao, car.ano].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">{car.tipo === "venda" ? "Venda" : "Aluguer"}</td>
                <td className="px-3 py-3 font-semibold whitespace-nowrap">{preco(car)}</td>
                <td className="px-3 py-3">
                  <EstadoBadge estado={car.estado} />
                </td>
                <td className="px-3 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => acoes.toggleDestaque(car)}
                    aria-pressed={car.destaque}
                    aria-label={car.destaque ? `Remover destaque de ${nomeCarro(car)}` : `Destacar ${nomeCarro(car)}`}
                    className="inline-flex size-9 items-center justify-center rounded-lg hover:bg-light"
                  >
                    <Star className={`size-5 ${car.destaque ? "fill-gold text-gold-ink" : "text-ink/30"}`} />
                  </button>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/viaturas/${car.id}`} className={buttonClass("outlineInk", "sm", "h-10")}>
                      <Pencil className="size-4" aria-hidden="true" />
                      Editar
                    </Link>
                    <ActionMenu label={`Mais ações para ${nomeCarro(car)}`} items={acoes.menuItems(car, setAApagar)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lista: cartões no telemóvel */}
      <ul className="mt-3 space-y-3 md:hidden">
        {carros.map((car) => (
          <li key={car.id} className="rounded-2xl border border-line-ink bg-light-surface p-3">
            <div className="flex gap-3">
              <div className="relative h-20 w-26 shrink-0 overflow-hidden rounded-xl bg-[#ECEAE4]">
                <CarImage src={car.fotos[0]} alt="" fill sizes="104px" className="object-cover" />
                {car.destaque && (
                  <span className="absolute top-1.5 left-1.5 flex size-6 items-center justify-center rounded-full bg-bg/80">
                    <Star className="size-3.5 fill-gold text-gold" aria-label="Em destaque" />
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{nomeCarro(car)}</p>
                <p className="truncate text-sm text-muted-ink">
                  {car.tipo === "venda" ? "Venda" : "Aluguer"} · {car.ano}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{preco(car)}</span>
                  <EstadoBadge estado={car.estado} />
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Link href={`/admin/viaturas/${car.id}`} className={buttonClass("outlineInk", "md", "flex-1")}>
                <Pencil className="size-4" aria-hidden="true" />
                Editar
              </Link>
              <ActionMenu label={`Mais ações para ${nomeCarro(car)}`} items={acoes.menuItems(car, setAApagar)} />
            </div>
          </li>
        ))}
      </ul>

      {error && !data && <DataError className="mt-3" />}
      {!loading && !error && carros.length === 0 && (
        <div className="mt-3 rounded-2xl border border-dashed border-ink/20 bg-light-surface px-6 py-14 text-center">
          <p className="font-semibold">Nenhuma viatura encontrada</p>
          <p className="mt-1 text-sm text-muted-ink">Altere a pesquisa ou adicione uma nova viatura.</p>
          <Link href="/admin/viaturas/nova" className={buttonClass("primary", "md", "mt-5")}>
            <Plus className="size-4" aria-hidden="true" />
            Adicionar viatura
          </Link>
        </div>
      )}

      <ConfirmDialog
        open={!!aApagar}
        perigo
        titulo="Apagar esta viatura?"
        texto={aApagar ? `${nomeCarro(aApagar)} vai ser removida do site e do painel. Esta ação não pode ser desfeita.` : ""}
        confirmar="Sim, apagar"
        onCancel={() => setAApagar(null)}
        onConfirm={() => {
          if (aApagar) acoes.apagar(aApagar);
          setAApagar(null);
        }}
      />
    </div>
  );
}
