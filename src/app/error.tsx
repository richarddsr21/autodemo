"use client";

import { RotateCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { buttonClass } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-bg px-4 py-16 text-center">
      <p className="font-display text-sm font-semibold tracking-[0.25em] text-gold uppercase">Algo correu mal</p>
      <h1 className="mt-3 text-4xl font-semibold">Não foi possível mostrar esta página</h1>
      <p className="mt-4 max-w-md text-muted">Tente novamente. Se o problema continuar, contacte-nos pelo WhatsApp.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className={buttonClass("primary", "lg")}>
          <RotateCw className="size-5" aria-hidden="true" />
          Tentar novamente
        </button>
        <Link href="/" className={buttonClass("outline", "lg")}>
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
