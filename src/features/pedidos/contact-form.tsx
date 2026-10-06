"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod/mini";
import { WhatsappIcon } from "@/components/ui/brand-icons";
import { buttonClass } from "@/components/ui/button";
import { FieldError, inputLight, labelLight } from "@/components/ui/form";
import { useSettings } from "@/features/definicoes/use-settings";
import { nomeSchema, telefoneSchema, zodResolver } from "@/lib/forms";
import { mensagens, openWhatsapp, whatsappLink } from "@/lib/whatsapp";
import { usePedidoMutations } from "./use-pedidos";

const schema = z.object({
  nome: nomeSchema,
  telefone: telefoneSchema,
  mensagem: z.string().check(z.trim(), z.minLength(5, "Escreva a sua mensagem."), z.maxLength(1000, "Mensagem demasiado longa.")),
});
type Valores = z.infer<typeof schema>;

/** Formulário de contacto: grava o pedido no painel e abre o WhatsApp. */
export function ContactForm() {
  const settings = useSettings();
  const { create } = usePedidoMutations();
  const [enviado, setEnviado] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Valores>({ resolver: zodResolver(schema), defaultValues: { nome: "", telefone: "", mensagem: "" } });

  const onSubmit = async (v: Valores) => {
    const guardar = create({ tipo: "contacto", nome: v.nome, telefone: v.telefone, mensagem: v.mensagem });
    openWhatsapp(whatsappLink(settings.whatsapp, mensagens.contacto(v)));
    // A mensagem já seguiu pelo WhatsApp; se o registo local falhar, não bloqueia o visitante.
    await guardar.catch((e: unknown) => console.warn("Pedido não registado no painel.", e));
    reset();
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div role="status" className="flex gap-3 rounded-2xl border border-gold/40 bg-light p-5">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gold-ink" aria-hidden="true" />
        <div>
          <p className="font-semibold">Mensagem enviada!</p>
          <p className="mt-1 text-sm text-muted-ink">Abrimos o WhatsApp com a sua mensagem. Respondemos com a maior brevidade.</p>
          <button type="button" onClick={() => setEnviado(false)} className="mt-2 text-sm font-semibold text-gold-ink hover:underline">
            Enviar outra mensagem
          </button>
        </div>
      </div>
    );
  }

  const aria = (k: keyof Valores) => ({
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `contacto-${k}-erro` : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contacto-nome" className={labelLight}>
            Nome
          </label>
          <input id="contacto-nome" autoComplete="name" className={inputLight} {...aria("nome")} {...register("nome")} />
          <FieldError id="contacto-nome-erro">{errors.nome?.message}</FieldError>
        </div>
        <div>
          <label htmlFor="contacto-telefone" className={labelLight}>
            Telemóvel
          </label>
          <input id="contacto-telefone" type="tel" inputMode="tel" autoComplete="tel" className={inputLight} {...aria("telefone")} {...register("telefone")} />
          <FieldError id="contacto-telefone-erro">{errors.telefone?.message}</FieldError>
        </div>
      </div>
      <div>
        <label htmlFor="contacto-mensagem" className={labelLight}>
          Mensagem
        </label>
        <textarea
          id="contacto-mensagem"
          rows={5}
          placeholder="Em que podemos ajudar?"
          className={`${inputLight} h-auto py-3`}
          {...aria("mensagem")}
          {...register("mensagem")}
        />
        <FieldError id="contacto-mensagem-erro">{errors.mensagem?.message}</FieldError>
      </div>
      <button type="submit" disabled={isSubmitting} className={buttonClass("primary", "lg", "w-full sm:w-auto")}>
        <WhatsappIcon className="size-5" />
        Enviar pelo WhatsApp
      </button>
    </form>
  );
}
