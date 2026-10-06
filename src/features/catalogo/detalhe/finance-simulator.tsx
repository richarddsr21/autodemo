"use client";

import { Calculator, Info } from "lucide-react";
import { useId, useState } from "react";
import { WhatsappIcon } from "@/components/ui/brand-icons";
import { buttonClass } from "@/components/ui/button";
import { inputLight, labelLight } from "@/components/ui/form";
import { useSettings } from "@/features/definicoes/use-settings";
import { prestacaoMensal } from "@/lib/finance";
import { formatEuro, nomeCompleto } from "@/lib/format";
import type { Car } from "@/lib/models";
import { whatsappLink } from "@/lib/whatsapp";

const PRAZOS = [12, 24, 36, 48, 60, 72, 84, 96];
const passo = (preco: number) => (preco > 20000 ? 500 : 250);

/** Simulador de prestação (valor indicativo). */
export function FinanceSimulator({ car }: { car: Car & { precoVenda: number } }) {
  const id = useId();
  const settings = useSettings();
  const preco = car.precoVenda;
  const arredonda = (v: number) => Math.round(v / passo(preco)) * passo(preco);

  const [entrada, setEntrada] = useState(() => arredonda(preco * 0.2));
  const [meses, setMeses] = useState(60);
  const [taxaTexto, setTaxaTexto] = useState<string | null>(null);
  // Até o visitante mexer na taxa, usa a das definições do stand.
  const taxa = taxaTexto === null ? settings.simuladorTaxa : Number(taxaTexto.replace(",", ".")) || 0;

  const entradaValida = Math.min(Math.max(entrada, 0), preco);
  const financiado = preco - entradaValida;
  const prestacao = prestacaoMensal(financiado, meses, taxa);
  const totalPago = prestacao * meses + entradaValida;

  const mensagem = [
    `Olá! Gostaria de uma proposta de financiamento para o ${nomeCompleto(car)} de ${car.ano} (${formatEuro(preco)}).`,
    `Entrada: ${formatEuro(entradaValida)} · Prazo: ${meses} meses`,
    `Prestação simulada: ${formatEuro(Math.round(prestacao))}/mês`,
  ].join("\n");

  return (
    <section aria-labelledby={`${id}-titulo`} className="rounded-2xl border border-line-ink bg-light-surface p-5 sm:p-6">
      <h2 id={`${id}-titulo`} className="flex items-center gap-2 text-2xl font-semibold">
        <Calculator className="size-6 text-gold-ink" aria-hidden="true" />
        Simulador de prestação
      </h2>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_260px]">
        <div className="space-y-6">
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor={`${id}-entrada`} className={labelLight}>
                Entrada
              </label>
              <span className="text-sm font-semibold">{formatEuro(entradaValida)}</span>
            </div>
            <input
              id={`${id}-entrada`}
              type="range"
              min={0}
              max={arredonda(preco * 0.9)}
              step={passo(preco)}
              value={entradaValida}
              onChange={(e) => setEntrada(Number(e.target.value))}
              className="w-full accent-[var(--gold-ink)]"
              aria-valuetext={formatEuro(entradaValida)}
            />
            <div className="flex justify-between text-xs text-muted-ink">
              <span>{formatEuro(0)}</span>
              <span>{formatEuro(arredonda(preco * 0.9))}</span>
            </div>
          </div>

          <fieldset>
            <legend className={labelLight}>Prazo</legend>
            <div className="mt-1 flex flex-wrap gap-2">
              {PRAZOS.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={meses === p}
                  onClick={() => setMeses(p)}
                  className={`h-10 min-w-14 rounded-lg border px-3 text-sm font-medium transition-colors ${meses === p ? "border-ink bg-ink text-light" : "border-line-ink hover:border-gold-ink"}`}
                >
                  {p} m
                </button>
              ))}
            </div>
          </fieldset>

          <div className="max-w-48">
            <label htmlFor={`${id}-taxa`} className={labelLight}>
              Taxa anual (TAN)
            </label>
            <div className="relative">
              <input
                id={`${id}-taxa`}
                inputMode="decimal"
                value={taxaTexto ?? String(settings.simuladorTaxa).replace(".", ",")}
                onChange={(e) => setTaxaTexto(e.target.value.replace(/[^\d.,]/g, ""))}
                className={`${inputLight} pr-10`}
              />
              <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted-ink">%</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl bg-bg p-5 text-text">
          <div aria-live="polite">
            <p className="text-sm text-muted">Prestação estimada</p>
            <p className="mt-1 font-display text-4xl font-semibold text-gold">
              {formatEuro(Math.round(prestacao))}
              <span className="text-base font-normal text-muted">/mês</span>
            </p>
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Valor financiado</dt>
                <dd>{formatEuro(financiado)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Prazo</dt>
                <dd>{meses} meses</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Total estimado</dt>
                <dd>{formatEuro(Math.round(totalPago))}</dd>
              </div>
            </dl>
          </div>
          <a
            href={whatsappLink(settings.whatsapp, mensagem)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("primary", "md", "mt-6 w-full")}
          >
            <WhatsappIcon className="size-4" />
            Pedir proposta
          </a>
        </div>
      </div>

      <p className="mt-5 flex gap-2 text-xs leading-relaxed text-muted-ink">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        Valor indicativo, sujeito a aprovação da entidade financeira. Não inclui seguros, impostos nem outros encargos; a TAEG
        efetiva será indicada na proposta.
      </p>
    </section>
  );
}
