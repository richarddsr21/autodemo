"use client";

import { Cog, Fuel, Heart, Users } from "lucide-react";
import Link from "next/link";
import { CarImage } from "@/components/ui/car-image";
import { formatEuro, formatKm, nomeCarro } from "@/lib/format";
import { CAIXA_LABEL, CATEGORIA_LABEL, COMBUSTIVEL_LABEL, type Car } from "@/lib/models";
import { useFavorites } from "./favorites";

export function CarCard({ car, preload = false, query = "" }: { car: Car; preload?: boolean; query?: string }) {
  const { isFavorite, toggle } = useFavorites();
  const favorito = isFavorite(car.id);
  const indisponivel = car.estado === "vendido" || car.estado === "alugado";
  const selo = car.estado === "vendido" ? "Vendido" : car.estado === "alugado" ? "Alugado" : null;
  const nome = nomeCarro(car);

  const specs = [
    { Icon: Users, label: `${car.lugares} lugares` },
    { Icon: Cog, label: CAIXA_LABEL[car.caixa] },
    { Icon: Fuel, label: COMBUSTIVEL_LABEL[car.combustivel] },
  ];

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line-ink bg-light-surface shadow-[var(--shadow-soft)] transition-all duration-200 ${indisponivel ? "" : "hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_18px_40px_-20px_rgb(0_0_0/0.35)]"}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#ECEAE4]">
        <CarImage
          src={car.fotos[0]}
          alt={`${nome} ${car.versao ?? ""}, ${car.ano}`.trim()}
          fill
          fetchPriority={preload ? "high" : "auto"}
          loading={preload ? "eager" : "lazy"}
          sizes="(min-width: 1280px) 300px, (min-width: 640px) 50vw, 100vw"
          className={`object-cover transition-transform duration-500 ${indisponivel ? "grayscale-[60%]" : "group-hover:scale-105"}`}
        />
        <span className="absolute top-3 left-3 rounded-full bg-bg/80 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-text backdrop-blur-sm">
          {car.tipo === "venda" ? "Venda" : "Aluguer"}
        </span>
        {selo && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg/45">
            <span className="-rotate-6 rounded-lg border-2 border-gold bg-bg/85 px-5 py-2 font-display text-lg font-semibold tracking-[0.2em] text-gold uppercase">
              {selo}
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={() => toggle(car.id)}
          aria-pressed={favorito}
          aria-label={favorito ? `Remover ${nome} dos favoritos` : `Adicionar ${nome} aos favoritos`}
          className="absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur-sm transition-colors hover:text-gold-ink"
        >
          <Heart className={`size-4.5 ${favorito ? "fill-gold text-gold-ink" : ""}`} aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-ink uppercase">
          {CATEGORIA_LABEL[car.categoria]} · {car.ano}
          {car.tipo === "venda" && ` · ${formatKm(car.km)}`}
        </p>
        <h3 className="mt-1.5 text-lg leading-snug font-semibold text-ink">
          {indisponivel ? (
            nome
          ) : (
            <Link href={`/carro/${car.slug}${query}`} className="after:absolute after:inset-0 focus-visible:outline-none">
              {nome}
            </Link>
          )}
        </h3>
        {car.versao && <p className="line-clamp-1 text-sm text-muted-ink">{car.versao}</p>}

        <ul className="mt-4 mb-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-ink">
          {specs.map(({ Icon, label }) => (
            <li key={label} className="flex items-center gap-1.5">
              <Icon className="size-3.5 text-gold-ink" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line-ink pt-4">
          <p className="text-ink">
            {car.tipo === "venda" ? (
              <span className="font-display text-2xl font-semibold">{car.precoVenda ? formatEuro(car.precoVenda) : "Sob consulta"}</span>
            ) : (
              <>
                <span className="font-display text-2xl font-semibold">{car.precoDia ? formatEuro(car.precoDia) : "—"}</span>
                <span className="text-sm text-muted-ink"> /dia</span>
              </>
            )}
          </p>
          <span
            aria-hidden="true"
            className={`inline-flex h-9 items-center rounded-lg border px-3.5 text-xs font-semibold transition-colors duration-200 ${indisponivel ? "border-line-ink text-muted-ink" : "border-ink/15 text-ink group-hover:border-gold group-hover:bg-gold group-hover:text-on-gold"}`}
          >
            {indisponivel ? "Indisponível" : "Ver detalhes"}
          </span>
        </div>
      </div>
    </article>
  );
}

export function CarCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line-ink bg-light-surface" aria-hidden="true">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#ECEAE4]">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
      <div className="space-y-3 p-5">
        <div className="h-3 w-24 rounded bg-[#ECEAE4]" />
        <div className="h-5 w-40 rounded bg-[#ECEAE4]" />
        <div className="h-3 w-32 rounded bg-[#ECEAE4]" />
        <div className="h-8 w-full rounded bg-[#ECEAE4]" />
      </div>
    </div>
  );
}

/** Grelha de esqueletos (fallback enquanto o catálogo carrega). */
export function CatalogSkeleton() {
  return (
    <div className="bg-light">
      <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:px-8 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <CarCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
