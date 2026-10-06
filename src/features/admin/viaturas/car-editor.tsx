"use client";

import Link from "next/link";
import { DataError } from "@/components/ui/data-error";
import { buttonClass } from "@/components/ui/button";
import { useCarById } from "@/features/catalogo/use-cars";
import { CarForm } from "./car-form";

/** Carrega a viatura pelo id e abre o formulário de edição. */
export function CarEditor({ id }: { id: string }) {
  const { data: car, loading, error } = useCarById(id);

  if (error && car === undefined) return <DataError className="mx-auto max-w-4xl" />;

  if (loading && car === undefined) {
    return (
      <div className="mx-auto max-w-4xl space-y-6" aria-busy="true" aria-label="A carregar viatura">
        <div className="h-10 w-72 animate-pulse rounded-lg bg-ink/10" />
        <div className="h-48 animate-pulse rounded-2xl bg-ink/10" />
        <div className="h-72 animate-pulse rounded-2xl bg-ink/10" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-semibold">Viatura não encontrada</h1>
        <p className="mt-2 text-muted-ink">Pode ter sido apagada.</p>
        <Link href="/admin/viaturas" className={buttonClass("primary", "lg", "mt-6")}>
          Voltar às viaturas
        </Link>
      </div>
    );
  }

  return <CarForm key={car.id} car={car} />;
}
