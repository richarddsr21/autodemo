"use client";

export function Switch({
  checked,
  onChange,
  label,
  descricao,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  descricao?: string;
  id: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <label htmlFor={id} className="font-medium text-ink">
          {label}
        </label>
        {descricao && <p className="text-sm text-muted-ink">{descricao}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${checked ? "bg-gold" : "bg-ink/20"}`}
      >
        <span
          className={`absolute top-1 left-1 size-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-5" : ""}`}
        />
      </button>
    </div>
  );
}
