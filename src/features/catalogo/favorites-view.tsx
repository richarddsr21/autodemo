"use client";

import { Heart } from "lucide-react";
import { DataError } from "@/components/ui/data-error";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { container } from "@/components/ui/container";
import { CarCard, CarCardSkeleton } from "./car-card";
import { useFavorites } from "./favorites";
import { useCars } from "./use-cars";

export function FavoritesView() {
  const { ids } = useFavorites();
  const { data, loading, error } = useCars();
  const favoritos = (data ?? []).filter((c) => ids.includes(c.id));

  return (
    <div className="bg-light text-ink">
      <div className={`${container} py-10 lg:py-14`}>
        {/* Sem favoritos não é preciso esperar pelos dados: mostra logo a mensagem. */}
        {ids.length > 0 && error && !data ? (
          <DataError />
        ) : ids.length > 0 && loading && !data ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <CarCardSkeleton key={i} />
            ))}
          </div>
        ) : favoritos.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-ink/20 bg-light-surface px-6 py-14 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-gold/15 text-gold-ink">
              <Heart className="size-6" aria-hidden="true" />
            </span>
            <p className="mt-4 font-display text-xl font-semibold">Ainda não guardou viaturas</p>
            <p className="mt-2 text-muted-ink">
              Toque no coração <Heart className="inline size-4 align-[-2px]" aria-label="coração" /> de uma viatura para a guardar aqui e
              comparar mais tarde.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/comprar" className={buttonClass("primary", "lg")}>
                Ver viaturas à venda
              </Link>
              <Link href="/alugar" className={buttonClass("outlineInk", "lg")}>
                Ver aluguer
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="font-medium" aria-live="polite">
              {favoritos.length} {favoritos.length === 1 ? "viatura guardada" : "viaturas guardadas"}
            </p>
            <h2 className="sr-only">Viaturas guardadas</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {favoritos.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
            <p className="mt-8 text-sm text-muted-ink">Os favoritos ficam guardados apenas neste dispositivo.</p>
          </>
        )}
      </div>
    </div>
  );
}
