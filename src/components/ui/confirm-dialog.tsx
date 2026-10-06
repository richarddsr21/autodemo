"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect, useRef } from "react";
import { buttonClass } from "./button";

/** Pedido de confirmação antes de ações irreversíveis (ex.: apagar). */
export function ConfirmDialog({
  open,
  titulo,
  texto,
  confirmar = "Confirmar",
  perigo = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  titulo: string;
  texto: string;
  confirmar?: string;
  perigo?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onCancel}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      aria-labelledby="confirmar-titulo"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-light-surface p-0 text-ink shadow-[var(--shadow-float)] backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        <div className="flex gap-4">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-full ${perigo ? "bg-red-100 text-red-700" : "bg-gold/15 text-gold-ink"}`}
          >
            <AlertTriangle className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="confirmar-titulo" className="text-lg font-semibold">
              {titulo}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-ink">{texto}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className={buttonClass("outlineInk", "lg")} autoFocus>
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={perigo ? buttonClass("primary", "lg", "bg-red-700 text-white hover:bg-red-800") : buttonClass("primary", "lg")}
          >
            {confirmar}
          </button>
        </div>
      </div>
    </dialog>
  );
}
