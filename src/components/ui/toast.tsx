"use client";

import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type ToastTipo = "sucesso" | "erro";
interface Toast {
  id: number;
  tipo: ToastTipo;
  texto: string;
}

const ToastContext = createContext<((texto: string, tipo?: ToastTipo) => void) | null>(null);

/** Avisos curtos no topo do ecrã ("Viatura guardada", ...); em baixo tapariam as barras de ações. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const fechar = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const mostrar = useCallback(
    (texto: string, tipo: ToastTipo = "sucesso") => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t.slice(-2), { id, tipo, texto }]);
      setTimeout(() => fechar(id), 4000);
    },
    [fechar],
  );
  const value = useMemo(() => mostrar, [mostrar]);

  return (
    <ToastContext value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 top-4 z-[70] flex flex-col items-center gap-2 sm:inset-x-auto sm:top-6 sm:right-6 sm:items-end"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.tipo === "erro" ? "alert" : "status"}
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text shadow-[var(--shadow-float)]"
          >
            {t.tipo === "sucesso" ? (
              <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-gold" aria-hidden="true" />
            ) : (
              <AlertCircle className="mt-0.5 size-4.5 shrink-0 text-red-400" aria-hidden="true" />
            )}
            <p className="flex-1">{t.texto}</p>
            <button type="button" onClick={() => fechar(t.id)} aria-label="Fechar aviso" className="text-muted hover:text-text">
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast tem de ser usado dentro de <ToastProvider>.");
  return ctx;
}
