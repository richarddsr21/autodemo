import { siteConfig } from "@/config/site";

/** "X de 20 viaturas usadas" (limite do plano, apenas informativo). */
export function PlanUsage({ total }: { total: number }) {
  const limite = siteConfig.limiteViaturas;
  const pct = Math.min(100, Math.round((total / limite) * 100));
  const cheio = total >= limite;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <p>
          <strong className="font-semibold">{total}</strong> de {limite} viaturas usadas
        </p>
        <p className="text-muted-ink">Plano Stand {limite}</p>
      </div>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={limite}
        aria-valuenow={total}
        aria-label="Utilização do plano"
      >
        <div className={`h-full rounded-full transition-all ${cheio ? "bg-red-600" : "bg-gold"}`} style={{ width: `${pct}%` }} />
      </div>
      {cheio && <p className="mt-2 text-xs text-red-700">Atingiu o limite do plano. Na versão final pode alterar o plano.</p>}
    </div>
  );
}
