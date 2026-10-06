"use client";

import { AlertTriangle, RotateCw } from "lucide-react";
import { buttonClass } from "./button";

/** Mensagem quando os dados não puderam ser carregados. */
export function DataError({ className = "" }: { className?: string }) {
  return (
    <div role="alert" className={`rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-ink ${className}`}>
      <AlertTriangle className="mx-auto size-8 text-red-700" aria-hidden="true" />
      <p className="mt-3 font-semibold">Não foi possível carregar os dados</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-ink">
        O navegador demorou demasiado a responder. Feche outros separadores deste site e recarregue a página.
      </p>
      <button type="button" onClick={() => window.location.reload()} className={buttonClass("outlineInk", "md", "mt-5 bg-light-surface")}>
        <RotateCw className="size-4" aria-hidden="true" />
        Recarregar
      </button>
    </div>
  );
}
