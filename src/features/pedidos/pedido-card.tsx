"use client";

import { Check, Phone, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import { WhatsappIcon } from "@/components/ui/brand-icons";
import { buttonClass } from "@/components/ui/button";
import { diasEntre } from "@/lib/dates";
import { formatData, formatEuro, nomeCompleto } from "@/lib/format";
import type { Car, Pedido } from "@/lib/models";
import { telefoneParaWhatsapp, whatsappLink } from "@/lib/whatsapp";
import { respostaPedido, TIPO_PEDIDO } from "./pedido-meta";

function hora(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
}

/** Um pedido no painel, com ações para responder e marcar como tratado. */
export function PedidoCard({
  pedido: p,
  car,
  nomeStand,
  onTratado,
  onApagar,
  compacto = false,
}: {
  pedido: Pedido;
  car?: Car;
  nomeStand: string;
  onTratado: (tratado: boolean) => void;
  onApagar?: () => void;
  compacto?: boolean;
}) {
  const { label, Icon } = TIPO_PEDIDO[p.tipo];
  const dias = p.levantamento && p.devolucao ? diasEntre(p.levantamento, p.devolucao) : 0;
  const total = dias && car?.precoDia ? dias * car.precoDia : 0;

  return (
    <article className={`flex flex-col gap-4 sm:flex-row ${compacto ? "" : "p-5"} ${p.tratado ? "opacity-70" : ""}`}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-ink">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">{p.nome}</h3>
          {p.tratado ? (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">Tratado</span>
          ) : (
            <span className="rounded-full bg-gold px-2 py-0.5 text-[11px] font-semibold text-on-gold">Por tratar</span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-muted-ink">
          {label} · {formatData(p.criadoEm)} às {hora(p.criadoEm)}
        </p>
        {!compacto && (
          <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
            <div className="flex gap-2">
              <dt className="text-muted-ink">Telemóvel:</dt>
              <dd>
                <a href={`tel:${p.telefone.replace(/\s/g, "")}`} className="font-medium hover:text-gold-ink">
                  {p.telefone}
                </a>
              </dd>
            </div>
            {car && (
              <div className="flex gap-2">
                <dt className="text-muted-ink">Viatura:</dt>
                <dd className="min-w-0">
                  <Link href={`/admin/viaturas/${car.id}`} className="font-medium hover:text-gold-ink">
                    {nomeCompleto(car)}
                  </Link>
                </dd>
              </div>
            )}
            {p.levantamento && p.devolucao && (
              <div className="flex gap-2 sm:col-span-2">
                <dt className="text-muted-ink">Datas:</dt>
                <dd>
                  {formatData(p.levantamento)} → {formatData(p.devolucao)}
                  {dias > 0 && ` (${dias} ${dias === 1 ? "dia" : "dias"}${total ? ` · ${formatEuro(total)} estimado` : ""})`}
                </dd>
              </div>
            )}
          </dl>
        )}
        {!compacto && p.mensagem && (
          <p className="mt-3 rounded-xl bg-light px-4 py-3 text-sm whitespace-pre-line">“{p.mensagem}”</p>
        )}
        {compacto && car && <p className="text-sm text-muted-ink">{nomeCompleto(car)}</p>}
      </div>
      <div className="flex flex-wrap items-start gap-2 sm:flex-col sm:items-stretch">
        <a
          href={whatsappLink(telefoneParaWhatsapp(p.telefone), respostaPedido(p, car, nomeStand))}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass("whatsapp", "md")}
        >
          <WhatsappIcon className="size-4" />
          Responder no WhatsApp
        </a>
        {!compacto && (
          <a href={`tel:${p.telefone.replace(/\s/g, "")}`} className={buttonClass("outlineInk", "md", "sm:hidden")}>
            <Phone className="size-4" aria-hidden="true" />
            Ligar
          </a>
        )}
        <button type="button" onClick={() => onTratado(!p.tratado)} className={buttonClass("outlineInk", "md")}>
          {p.tratado ? <RotateCcw className="size-4" aria-hidden="true" /> : <Check className="size-4" aria-hidden="true" />}
          {p.tratado ? "Marcar por tratar" : "Marcar como tratado"}
        </button>
        {onApagar && (
          <button type="button" onClick={onApagar} className={buttonClass("outlineInk", "md", "text-red-700 hover:border-red-600 hover:text-red-700")}>
            <Trash2 className="size-4" aria-hidden="true" />
            Apagar
          </button>
        )}
      </div>
    </article>
  );
}
