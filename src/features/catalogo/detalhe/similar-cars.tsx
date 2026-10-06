"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { precoDe } from "@/lib/repository/filter";
import type { Car } from "@/lib/models";
import { CarCard } from "../car-card";
import { useCars } from "../use-cars";

/** Até 4 viaturas do mesmo tipo: primeiro da mesma categoria, depois por preço mais próximo. */
export function SimilarCars({ car }: { car: Car }) {
  const { data } = useCars({ tipo: car.tipo, estados: ["disponivel"] });
  const preco = precoDe(car);
  const semelhantes = (data ?? [])
    .filter((c) => c.id !== car.id)
    .sort(
      (a, b) =>
        Number(b.categoria === car.categoria) - Number(a.categoria === car.categoria) ||
        Math.abs(precoDe(a) - preco) - Math.abs(precoDe(b) - preco),
    )
    .slice(0, 4);

  if (semelhantes.length === 0) return null;
  const href = car.tipo === "venda" ? "/comprar" : "/alugar";

  return (
    <section aria-labelledby="semelhantes-titulo" className="border-t border-line-ink py-14 sm:py-16">
      <div className={container}>
        <SectionHeading
          id="semelhantes-titulo"
          tone="light"
          eyebrow="Também pode gostar"
          title="Viaturas semelhantes"
          action={
            <Link href={href} className="group inline-flex items-center gap-2 text-sm font-semibold text-gold-ink hover:text-ink">
              Ver todas
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          }
        />
        <div className="reveal mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {semelhantes.map((c) => (
            <CarCard key={c.id} car={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
