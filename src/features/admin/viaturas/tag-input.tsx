"use client";

import { Plus, X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { inputLight } from "@/components/ui/form";

const SUGESTOES = [
  "Ar condicionado",
  "GPS",
  "Bluetooth",
  "Apple CarPlay",
  "Android Auto",
  "Cruise control",
  "Câmara de marcha-atrás",
  "Sensores de estacionamento",
  "Faróis LED",
  "Bancos aquecidos",
  "Teto panorâmico",
  "Jantes de liga leve",
];

/** Lista de etiquetas (equipamento): Enter ou vírgula para adicionar. */
export function TagInput({ id, value, onChange }: { id: string; value: string[]; onChange: (v: string[]) => void }) {
  const [texto, setTexto] = useState("");

  const adicionar = (t: string) => {
    const limpo = t.trim().replace(/,$/, "").trim();
    if (!limpo) return;
    const existe = value.some((v) => v.toLocaleLowerCase("pt-PT") === limpo.toLocaleLowerCase("pt-PT"));
    if (!existe) onChange([...value, limpo]);
    setTexto("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      adicionar(texto);
    } else if (e.key === "Backspace" && texto === "" && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  const sugestoes = SUGESTOES.filter((s) => !value.some((v) => v.toLocaleLowerCase("pt-PT") === s.toLocaleLowerCase("pt-PT")));

  return (
    <div>
      {value.length > 0 && (
        <ul className="mb-3 flex flex-wrap gap-2" aria-label="Equipamento adicionado">
          {value.map((t) => (
            <li key={t} className="inline-flex items-center gap-1 rounded-full bg-ink py-1 pr-1 pl-3 text-sm text-light">
              {t}
              <button
                type="button"
                onClick={() => onChange(value.filter((v) => v !== t))}
                aria-label={`Remover ${t}`}
                className="flex size-6 items-center justify-center rounded-full hover:bg-white/15"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          id={id}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ex.: Bancos em pele"
          className={inputLight}
          enterKeyHint="done"
        />
        <button
          type="button"
          onClick={() => adicionar(texto)}
          className="flex h-12 shrink-0 items-center gap-1.5 rounded-xl border border-line-ink bg-light-surface px-4 text-sm font-semibold hover:border-gold-ink"
        >
          <Plus className="size-4" aria-hidden="true" />
          Adicionar
        </button>
      </div>
      {sugestoes.length > 0 && (
        <div className="mt-3">
          <p className="mb-2 text-xs text-muted-ink">Sugestões:</p>
          <div className="flex flex-wrap gap-1.5">
            {sugestoes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => adicionar(s)}
                className="rounded-full border border-dashed border-ink/25 px-2.5 py-1 text-xs text-muted-ink transition-colors hover:border-gold-ink hover:text-ink"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
