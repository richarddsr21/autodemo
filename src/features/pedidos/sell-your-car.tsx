"use client";

import { CarFront, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod/mini";
import { WhatsappIcon } from "@/components/ui/brand-icons";
import { buttonClass } from "@/components/ui/button";
import { useSettings } from "@/features/definicoes/use-settings";
import { nomeSchema, telefoneSchema, zodResolver } from "@/lib/forms";
import { mensagens, openWhatsapp, whatsappLink } from "@/lib/whatsapp";
import { usePedidoMutations } from "./use-pedidos";

const schema = z.object({ nome: nomeSchema, telefone: telefoneSchema });
type Valores = z.infer<typeof schema>;

const inputClass =
  "h-12 w-full rounded-xl border bg-light px-4 text-sm text-ink placeholder:text-muted-ink/80 transition-colors focus:border-gold-ink focus:outline-none";

/** Bloco "Quer vender o seu carro?": grava o pedido e abre o WhatsApp. */
export function SellYourCar() {
  const settings = useSettings();
  const { create } = usePedidoMutations();
  const [enviado, setEnviado] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Valores>({ resolver: zodResolver(schema), defaultValues: { nome: "", telefone: "" } });

  const onSubmit = async (v: Valores) => {
    const guardar = create({ tipo: "venda-o-meu-carro", nome: v.nome, telefone: v.telefone, mensagem: "Pedido de avaliação de viatura." });
    openWhatsapp(whatsappLink(settings.whatsapp, mensagens.vender(v)));
    // A mensagem já seguiu pelo WhatsApp; se o registo local falhar, não bloqueia o visitante.
    await guardar.catch((e: unknown) => console.warn("Pedido não registado no painel.", e));
    reset();
    setEnviado(true);
  };

  return (
    <div className="reveal grid gap-8 rounded-3xl border border-line-ink bg-light-surface p-6 shadow-[var(--shadow-soft)] sm:p-10 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:gap-12">
      <div className="flex gap-5">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-bg text-gold">
          <CarFront className="size-7" aria-hidden="true" />
        </span>
        <div>
          <h2 id="vender-titulo" className="text-2xl font-semibold text-ink sm:text-3xl">
            Quer vender o seu carro?
          </h2>
          <p className="mt-2 leading-relaxed text-muted-ink">
            Avaliamos a sua viatura sem compromisso. Deixe o contacto e continuamos a conversa pelo WhatsApp.
          </p>
        </div>
      </div>

      {enviado ? (
        <div role="status" className="flex items-start gap-3 rounded-2xl border border-gold/40 bg-light p-5 text-ink">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gold-ink" aria-hidden="true" />
          <div>
            <p className="font-semibold">Pedido registado!</p>
            <p className="text-sm text-muted-ink">Abrimos o WhatsApp com a mensagem pronta. Responderemos com a maior brevidade.</p>
            <button type="button" onClick={() => setEnviado(false)} className="mt-2 text-sm font-semibold text-gold-ink underline-offset-4 hover:underline">
              Enviar outro pedido
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate aria-labelledby="vender-titulo" className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-start">
          <div>
            <label htmlFor="vender-nome" className="sr-only">
              Nome
            </label>
            <input
              id="vender-nome"
              autoComplete="name"
              placeholder="O seu nome"
              aria-invalid={!!errors.nome}
              aria-describedby={errors.nome ? "vender-nome-erro" : undefined}
              className={`${inputClass} ${errors.nome ? "border-red-600" : "border-line-ink"}`}
              {...register("nome")}
            />
            {errors.nome && (
              <p id="vender-nome-erro" className="mt-1.5 text-xs text-red-700">
                {errors.nome.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="vender-telefone" className="sr-only">
              Telemóvel
            </label>
            <input
              id="vender-telefone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Telemóvel"
              aria-invalid={!!errors.telefone}
              aria-describedby={errors.telefone ? "vender-telefone-erro" : undefined}
              className={`${inputClass} ${errors.telefone ? "border-red-600" : "border-line-ink"}`}
              {...register("telefone")}
            />
            {errors.telefone && (
              <p id="vender-telefone-erro" className="mt-1.5 text-xs text-red-700">
                {errors.telefone.message}
              </p>
            )}
          </div>
          <button type="submit" disabled={isSubmitting} className={buttonClass("primary", "md", "h-12")}>
            <WhatsappIcon className="size-4" />
            Pedir avaliação
          </button>
        </form>
      )}
    </div>
  );
}
