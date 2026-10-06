"use client";

import { ArrowRight } from "lucide-react";
import { DataError } from "@/components/ui/data-error";
import Link from "next/link";
import { container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CarCard, CarCardSkeleton } from "@/features/catalogo/car-card";
import { useCars } from "@/features/catalogo/use-cars";

const TOTAL = 4;

export function FeaturedCars() {
  const { data, loading, error } = useCars({ estados: ["disponivel"] });
  // Primeiro as viaturas destacadas; completa com as mais recentes.
  const carros = [...(data ?? [])].sort((a, b) => Number(b.destaque) - Number(a.destaque)).slice(0, TOTAL);

  return (
    <section aria-labelledby="destaques-titulo" className={`${container} pb-20 sm:pb-24`}>
      <SectionHeading
        id="destaques-titulo"
        tone="light"
        eyebrow="Selecionadas para si"
        title="Viaturas em destaque"
        action={
          <Link
            href="/comprar"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-gold-ink transition-colors hover:text-ink"
          >
            Ver todas
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        }
      />
      <div className="reveal mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {loading && !data
          ? Array.from({ length: TOTAL }, (_, i) => <CarCardSkeleton key={i} />)
          : carros.map((car) => <CarCard key={car.id} car={car} />)}
      </div>
      {error && !data && <DataError className="mt-10" />}
      {!loading && !error && carros.length === 0 && (
        <p className="mt-10 rounded-2xl border border-dashed border-line-ink p-10 text-center text-muted-ink">
          De momento não há viaturas em destaque. Volte em breve!
        </p>
      )}
    </section>
  );
}
