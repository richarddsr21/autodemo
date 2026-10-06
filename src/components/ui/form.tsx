import type { ReactNode } from "react";

/** Estilos de formulário sobre fundo claro. */
export const inputLight =
  "h-12 w-full rounded-xl border border-line-ink bg-light px-4 text-sm text-ink placeholder:text-muted-ink/80 transition-colors hover:border-ink/25 focus:border-gold-ink focus:outline-none aria-[invalid=true]:border-red-600";

export const selectLight = `${inputLight} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2357534E' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_0.9rem_center] bg-no-repeat pr-10`;

export const labelLight = "mb-1.5 block text-xs font-semibold tracking-[0.08em] text-ink/80 uppercase";

export function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 text-xs text-red-700">
      {children}
    </p>
  );
}

/** Botão-etiqueta para filtros (seleção única ou múltipla). */
export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`h-9 rounded-full border px-3.5 text-sm font-medium transition-colors duration-150 ${
        active ? "border-ink bg-ink text-light" : "border-line-ink bg-light-surface text-ink hover:border-gold-ink"
      }`}
    >
      {children}
    </button>
  );
}
