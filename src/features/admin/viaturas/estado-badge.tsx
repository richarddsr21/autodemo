import { ESTADO_LABEL, type EstadoCarro } from "@/lib/models";

const ESTILO: Record<EstadoCarro, string> = {
  disponivel: "bg-emerald-100 text-emerald-800",
  vendido: "bg-gold/20 text-gold-ink",
  alugado: "bg-sky-100 text-sky-800",
  escondido: "bg-stone-200 text-stone-700",
};

export function EstadoBadge({ estado }: { estado: EstadoCarro }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${ESTILO[estado]}`}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {ESTADO_LABEL[estado]}
    </span>
  );
}
