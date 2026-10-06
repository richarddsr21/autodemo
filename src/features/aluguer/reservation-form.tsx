"use client";

import { CalendarCheck, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod/mini";
import { WhatsappIcon } from "@/components/ui/brand-icons";
import { buttonClass } from "@/components/ui/button";
import { FieldError, inputLight, labelLight } from "@/components/ui/form";
import { useSettings } from "@/features/definicoes/use-settings";
import { usePedidoMutations } from "@/features/pedidos/use-pedidos";
import { diasEntre, hojeISO, isISODate } from "@/lib/dates";
import { formatEuro } from "@/lib/format";
import { nomeSchema, telefoneSchema, zodResolver } from "@/lib/forms";
import type { Car } from "@/lib/models";
import { mensagens, openWhatsapp, whatsappLink } from "@/lib/whatsapp";

const schema = z
  .object({
    nome: nomeSchema,
    telefone: telefoneSchema,
    levantamento: z.string().check(z.refine(isISODate, "Escolha a data de levantamento.")),
    devolucao: z.string().check(z.refine(isISODate, "Escolha a data de devolução.")),
    mensagem: z.optional(z.string().check(z.trim(), z.maxLength(500, "Mensagem demasiado longa."))),
  })
  .check(
    z.refine((v) => v.levantamento >= hojeISO(), {
      path: ["levantamento"],
      message: "O levantamento não pode ser no passado.",
    }),
    z.refine((v) => v.devolucao > v.levantamento, {
      path: ["devolucao"],
      message: "A devolução tem de ser depois do levantamento.",
    }),
  );

type Valores = z.infer<typeof schema>;

/** Pedido de reserva: grava no painel e abre o WhatsApp com a mensagem pronta. */
export function ReservationForm({ car, carUrl }: { car: Car; carUrl: string }) {
  const settings = useSettings();
  const { create } = usePedidoMutations();
  const [enviado, setEnviado] = useState(false);
  const indisponivel = car.estado !== "disponivel";

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Valores>({
    resolver: zodResolver(schema),
    defaultValues: { nome: "", telefone: "", levantamento: "", devolucao: "", mensagem: "" },
  });

  // Datas vindas da pesquisa (?levantamento=...&devolucao=...).
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const lev = sp.get("levantamento");
    const dev = sp.get("devolucao");
    if (isISODate(lev)) setValue("levantamento", lev);
    if (isISODate(dev)) setValue("devolucao", dev);
  }, [setValue]);

  const [levantamento, devolucao] = useWatch({ control, name: ["levantamento", "devolucao"] });
  const dias = diasEntre(levantamento, devolucao);
  const total = car.precoDia ? dias * car.precoDia : 0;

  const onSubmit = async (v: Valores) => {
    const guardar = create({
      tipo: "reserva",
      nome: v.nome,
      telefone: v.telefone,
      carroId: car.id,
      levantamento: v.levantamento,
      devolucao: v.devolucao,
      mensagem: v.mensagem || undefined,
    });
    openWhatsapp(
      whatsappLink(
        settings.whatsapp,
        mensagens.reserva({ ...v, car, total: total || undefined, url: carUrl }),
      ),
    );
    // A mensagem já seguiu pelo WhatsApp; se o registo local falhar, não bloqueia o visitante.
    await guardar.catch((e: unknown) => console.warn("Pedido não registado no painel.", e));
    reset();
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div role="status" className="rounded-2xl border border-gold/40 bg-light p-5">
        <div className="flex gap-3">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gold-ink" aria-hidden="true" />
          <div>
            <p className="font-semibold">Pedido de reserva enviado!</p>
            <p className="mt-1 text-sm text-muted-ink">
              Abrimos o WhatsApp com os detalhes. Vamos confirmar a disponibilidade e as condições consigo.
            </p>
            <button type="button" onClick={() => setEnviado(false)} className="mt-2 text-sm font-semibold text-gold-ink hover:underline">
              Fazer outro pedido
            </button>
          </div>
        </div>
      </div>
    );
  }

  const erro = (k: keyof Valores) => (errors[k] ? `reserva-${k}-erro` : undefined);

  return (
    <form id="reserva" onSubmit={handleSubmit(onSubmit)} noValidate className="scroll-mt-28 space-y-4" aria-labelledby="reserva-titulo">
      <h2 id="reserva-titulo" className="flex items-center gap-2 text-lg font-semibold">
        <CalendarCheck className="size-5 text-gold-ink" aria-hidden="true" />
        Pedir reserva
      </h2>

      {indisponivel && (
        <p className="rounded-xl bg-light p-3 text-sm text-muted-ink">
          Esta viatura está alugada de momento. Pode deixar o pedido para outras datas e confirmamos consigo.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="reserva-levantamento" className={labelLight}>
            Levantamento
          </label>
          <input
            id="reserva-levantamento"
            type="date"
            min={hojeISO()}
            className={inputLight}
            aria-invalid={!!errors.levantamento}
            aria-describedby={erro("levantamento")}
            suppressHydrationWarning
            {...register("levantamento")}
          />
          <FieldError id="reserva-levantamento-erro">{errors.levantamento?.message}</FieldError>
        </div>
        <div>
          <label htmlFor="reserva-devolucao" className={labelLight}>
            Devolução
          </label>
          <input
            id="reserva-devolucao"
            type="date"
            min={levantamento || hojeISO()}
            className={inputLight}
            aria-invalid={!!errors.devolucao}
            aria-describedby={erro("devolucao")}
            suppressHydrationWarning
            {...register("devolucao")}
          />
          <FieldError id="reserva-devolucao-erro">{errors.devolucao?.message}</FieldError>
        </div>
      </div>

      <div>
        <label htmlFor="reserva-nome" className={labelLight}>
          Nome
        </label>
        <input
          id="reserva-nome"
          autoComplete="name"
          className={inputLight}
          aria-invalid={!!errors.nome}
          aria-describedby={erro("nome")}
          {...register("nome")}
        />
        <FieldError id="reserva-nome-erro">{errors.nome?.message}</FieldError>
      </div>
      <div>
        <label htmlFor="reserva-telefone" className={labelLight}>
          Telemóvel
        </label>
        <input
          id="reserva-telefone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          className={inputLight}
          aria-invalid={!!errors.telefone}
          aria-describedby={erro("telefone")}
          {...register("telefone")}
        />
        <FieldError id="reserva-telefone-erro">{errors.telefone?.message}</FieldError>
      </div>
      <div>
        <label htmlFor="reserva-mensagem" className={labelLight}>
          Mensagem <span className="font-normal tracking-normal normal-case text-muted-ink">(opcional)</span>
        </label>
        <textarea
          id="reserva-mensagem"
          rows={3}
          placeholder="Ex.: preciso de cadeira de criança"
          className={`${inputLight} h-auto py-3`}
          aria-invalid={!!errors.mensagem}
          aria-describedby={erro("mensagem")}
          {...register("mensagem")}
        />
        <FieldError id="reserva-mensagem-erro">{errors.mensagem?.message}</FieldError>
      </div>

      <div className="rounded-xl border border-line-ink bg-light p-4" aria-live="polite">
        {dias > 0 && car.precoDia ? (
          <div className="flex items-end justify-between gap-3">
            <p className="text-sm text-muted-ink">
              {dias} {dias === 1 ? "dia" : "dias"} × {formatEuro(car.precoDia)}
            </p>
            <p className="text-right">
              <span className="block text-xs text-muted-ink">Total estimado</span>
              <span className="font-display text-2xl font-semibold">{formatEuro(total)}</span>
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-ink">Escolha as datas para ver o total estimado.</p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} className={buttonClass("primary", "lg", "w-full")}>
        <WhatsappIcon className="size-5" />
        Enviar pedido pelo WhatsApp
      </button>
      <p className="text-center text-xs text-muted-ink">
        Valor indicativo. A reserva só fica confirmada depois da resposta do stand.
      </p>
    </form>
  );
}
