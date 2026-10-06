"use client";

import { MoreHorizontal, type LucideIcon } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export interface MenuItem {
  label: string;
  Icon: LucideIcon;
  onSelect: () => void;
  perigo?: boolean;
}

/** Menu de ações (botão "⋯"). Fecha com Esc ou clique fora. */
export function ActionMenu({ label, items }: { label: string; items: MenuItem[] }) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!aberto) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setAberto(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setAberto(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    ref.current?.querySelector<HTMLButtonElement>("[role=menuitem]")?.focus();
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [aberto]);

  const onMenuKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const botoes = [...(ref.current?.querySelectorAll<HTMLButtonElement>("[role=menuitem]") ?? [])];
    const i = botoes.indexOf(document.activeElement as HTMLButtonElement);
    const next = e.key === "ArrowDown" ? (i + 1) % botoes.length : (i - 1 + botoes.length) % botoes.length;
    botoes[next]?.focus();
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={aberto}
        aria-controls={id}
        onClick={() => setAberto((v) => !v)}
        className="flex size-10 items-center justify-center rounded-lg border border-line-ink bg-light-surface text-ink transition-colors hover:border-gold-ink"
      >
        <MoreHorizontal className="size-5" />
      </button>
      {aberto && (
        <div
          id={id}
          role="menu"
          onKeyDown={onMenuKey}
          className="absolute right-0 z-30 mt-2 w-60 overflow-hidden rounded-xl border border-line-ink bg-light-surface py-1.5 shadow-[var(--shadow-float)]"
        >
          {items.map(({ label: l, Icon, onSelect, perigo }) => (
            <button
              key={l}
              type="button"
              role="menuitem"
              onClick={() => {
                setAberto(false);
                onSelect();
              }}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-light focus:bg-light focus:outline-none ${perigo ? "text-red-700" : "text-ink"}`}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
