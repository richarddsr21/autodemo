"use client";

import { Download, Loader2, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { buttonClass } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FieldError, inputLight, labelLight } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { zodResolver } from "@/lib/forms";
import type { Settings } from "@/lib/models";
import { useMaintenance } from "./use-maintenance";
import { useSettingsMutations, useSettingsQuery } from "./use-settings";

const url = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\/\S+\.\S+/.test(v), "Endereço inválido (deve começar por https://).");

const schema = z.object({
  nome: z.string().trim().min(2, "Indique o nome do stand.").max(40, "Nome demasiado longo."),
  slogan: z.string().trim().max(160, "Frase demasiado longa."),
  telefone: z.string().trim().min(9, "Indique o telefone."),
  whatsapp: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().min(11, "Indique o número com indicativo, ex.: 351912345678.").max(15, "Número demasiado longo.")),
  email: z.email("E-mail inválido."),
  morada: z.string().trim().max(120, "Morada demasiado longa."),
  codigoPostal: z.string().trim().regex(/^\d{4}-\d{3}$/, "Código postal no formato 0000-000."),
  localidade: z.string().trim().min(2, "Indique a localidade."),
  horario: z
    .array(z.object({ dias: z.string().trim().min(1, "Indique os dias."), horas: z.string().trim().min(1, "Indique o horário.") }))
    .min(1, "Indique pelo menos uma linha de horário."),
  redes: z.object({ instagram: url, facebook: url }),
  heroTitulo: z.string().trim().min(2, "Indique o título.").max(40, "Título demasiado longo."),
  heroDestaque: z.string().trim().min(2, "Indique o destaque.").max(40, "Texto demasiado longo."),
  heroSubtitulo: z.string().trim().max(220, "Subtítulo demasiado longo."),
  sobreTitulo: z.string().trim().min(2, "Indique o título.").max(80, "Título demasiado longo."),
  sobreTexto: z.string().trim().min(10, "Escreva um pequeno texto.").max(1500, "Texto demasiado longo."),
  simuladorTaxa: z
    .string()
    .trim()
    .transform((v) => Number(v.replace(",", ".")))
    .pipe(z.number({ error: "Taxa inválida." }).min(0, "Taxa inválida.").max(30, "Taxa inválida.")),
});

type Valores = z.input<typeof schema>;

const toValores = (s: Settings): Valores => ({
  ...s,
  horario: s.horario.map((h) => ({ ...h })),
  redes: { ...s.redes },
  simuladorTaxa: String(s.simuladorTaxa).replace(".", ","),
});

function Section({ titulo, descricao, children }: { titulo: string; descricao?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line-ink bg-light-surface p-5 sm:p-6">
      <h2 className="text-lg font-semibold">{titulo}</h2>
      {descricao && <p className="mt-0.5 text-sm text-muted-ink">{descricao}</p>}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function SettingsPage() {
  // O formulário só monta depois de ler as definições guardadas.
  const { data } = useSettingsQuery();
  if (!data) {
    return <div className="mx-auto h-96 max-w-4xl animate-pulse rounded-2xl bg-ink/10" aria-busy="true" aria-label="A carregar definições" />;
  }
  return <SettingsForm initial={data} />;
}

function SettingsForm({ initial }: { initial: Settings }) {
  const { update } = useSettingsMutations();
  const { resetToSample, exportJson } = useMaintenance();
  const toast = useToast();
  const [confirmarRepor, setConfirmarRepor] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<Valores, unknown, Settings>({ resolver: zodResolver(schema), defaultValues: toValores(initial) });
  const horario = useFieldArray({ control, name: "horario" });

  const guardar = async (v: Settings) => {
    const novas = await update(v);
    reset(toValores(novas));
    toast("Definições guardadas. O site já foi atualizado.");
  };

  const campo = (name: Parameters<typeof register>[0], label: string, erro?: string, opts: { full?: boolean; area?: boolean; dica?: string; tipo?: string } = {}) => {
    const id = `def-${name.replace(/\./g, "-")}`;
    return (
      <div className={opts.full ? "sm:col-span-2" : ""}>
        <label htmlFor={id} className={labelLight}>
          {label}
        </label>
        {opts.area ? (
          <textarea id={id} rows={5} aria-invalid={!!erro} className={`${inputLight} h-auto py-3 leading-relaxed`} {...register(name)} />
        ) : (
          <input id={id} type={opts.tipo ?? "text"} aria-invalid={!!erro} className={inputLight} {...register(name)} />
        )}
        {opts.dica && !erro && <p className="mt-1.5 text-xs text-muted-ink">{opts.dica}</p>}
        <FieldError id={`${id}-erro`}>{erro}</FieldError>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl pb-28">
      <h1 className="text-3xl font-semibold">Definições do site</h1>
      <p className="mt-1 text-muted-ink">O que alterar aqui muda logo em todo o site: contactos, horário e textos.</p>

      <form
        id="form-definicoes"
        onSubmit={handleSubmit(guardar, () => toast("Há campos por corrigir. Veja as mensagens a vermelho.", "erro"))}
        noValidate
        className="mt-8 space-y-6"
      >
        <Section titulo="Stand">
          {campo("nome", "Nome do stand", errors.nome?.message)}
          {campo("email", "E-mail", errors.email?.message, { tipo: "email" })}
          {campo("slogan", "Frase de apresentação (rodapé)", errors.slogan?.message, { full: true })}
        </Section>

        <Section titulo="Contactos" descricao="Usados nos botões de chamada e de WhatsApp de todo o site.">
          {campo("telefone", "Telefone (como aparece no site)", errors.telefone?.message, { dica: "Ex.: +351 912 345 678", tipo: "tel" })}
          {campo("whatsapp", "Número de WhatsApp", errors.whatsapp?.message, { dica: "Com indicativo, sem espaços. Ex.: 351912345678", tipo: "tel" })}
          {campo("morada", "Rua e número", errors.morada?.message, { full: true, dica: "Opcional." })}
          {campo("codigoPostal", "Código postal", errors.codigoPostal?.message)}
          {campo("localidade", "Localidade", errors.localidade?.message)}
          {campo("redes.instagram", "Instagram (endereço)", errors.redes?.instagram?.message, { tipo: "url" })}
          {campo("redes.facebook", "Facebook (endereço)", errors.redes?.facebook?.message, { tipo: "url", dica: "Deixe vazio se não tiver." })}
        </Section>

        <section className="rounded-2xl border border-line-ink bg-light-surface p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Horário</h2>
          <ul className="mt-5 space-y-3">
            {horario.fields.map((f, i) => (
              <li key={f.id} className="grid grid-cols-[1fr_1fr_auto] items-start gap-2 sm:gap-3">
                <div>
                  <label htmlFor={`hor-dias-${i}`} className="sr-only">
                    Dias
                  </label>
                  <input id={`hor-dias-${i}`} placeholder="Ex.: Segunda a sexta" className={inputLight} aria-invalid={!!errors.horario?.[i]?.dias} {...register(`horario.${i}.dias`)} />
                  <FieldError id={`hor-dias-${i}-erro`}>{errors.horario?.[i]?.dias?.message}</FieldError>
                </div>
                <div>
                  <label htmlFor={`hor-horas-${i}`} className="sr-only">
                    Horas
                  </label>
                  <input id={`hor-horas-${i}`} placeholder="Ex.: 09:00 – 19:00" className={inputLight} aria-invalid={!!errors.horario?.[i]?.horas} {...register(`horario.${i}.horas`)} />
                  <FieldError id={`hor-horas-${i}-erro`}>{errors.horario?.[i]?.horas?.message}</FieldError>
                </div>
                <button
                  type="button"
                  onClick={() => horario.remove(i)}
                  disabled={horario.fields.length === 1}
                  aria-label={`Remover linha ${i + 1} do horário`}
                  className="flex size-12 items-center justify-center rounded-xl border border-line-ink text-muted-ink hover:border-red-600 hover:text-red-700 disabled:opacity-40"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => horario.append({ dias: "", horas: "" })} className={buttonClass("outlineInk", "md", "mt-3")}>
            <Plus className="size-4" aria-hidden="true" />
            Adicionar linha
          </button>
        </section>

        <Section titulo="Página inicial" descricao="Título grande e texto do topo da página inicial.">
          {campo("heroTitulo", "Título (1.ª linha)", errors.heroTitulo?.message)}
          {campo("heroDestaque", "Título (2.ª linha, a dourado)", errors.heroDestaque?.message)}
          {campo("heroSubtitulo", "Subtítulo", errors.heroSubtitulo?.message, { full: true, area: true })}
        </Section>

        <Section titulo="Página “Sobre”">
          {campo("sobreTitulo", "Título", errors.sobreTitulo?.message, { full: true })}
          {campo("sobreTexto", "Texto", errors.sobreTexto?.message, { full: true, area: true })}
        </Section>

        <Section titulo="Simulador de prestação" descricao="Taxa anual de exemplo usada no simulador das viaturas à venda.">
          {campo("simuladorTaxa", "Taxa de juro anual (%)", errors.simuladorTaxa?.message, { dica: "Ex.: 8,9" })}
        </Section>
      </form>

      <section className="mt-6 rounded-2xl border border-line-ink bg-light-surface p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Dados da demonstração</h2>
        <p className="mt-0.5 text-sm text-muted-ink">Exporte uma cópia de segurança ou volte ao estado inicial da demonstração.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => exportJson().then(() => toast("Ficheiro de dados descarregado."))} className={buttonClass("outlineInk", "lg")}>
            <Download className="size-5" aria-hidden="true" />
            Exportar dados (JSON)
          </button>
          <button type="button" onClick={() => setConfirmarRepor(true)} className={buttonClass("outlineInk", "lg", "text-red-700 hover:border-red-600 hover:text-red-700")}>
            <RotateCcw className="size-5" aria-hidden="true" />
            Repor dados de exemplo
          </button>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-[61px] z-20 border-t border-line-ink bg-light-surface/95 px-4 py-3 backdrop-blur-md lg:bottom-0 lg:left-[260px]">
        <div className="mx-auto flex max-w-4xl items-center justify-end gap-3">
          {isDirty && <p className="mr-auto hidden text-sm text-muted-ink sm:block">Tem alterações por guardar.</p>}
          <button type="button" disabled={!isDirty} onClick={() => reset()} className={buttonClass("outlineInk", "lg")}>
            Descartar
          </button>
          <button type="submit" form="form-definicoes" disabled={isSubmitting || !isDirty} className={buttonClass("primary", "lg", "min-w-40")}>
            {isSubmitting ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <Save className="size-5" aria-hidden="true" />}
            Guardar
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmarRepor}
        perigo
        titulo="Repor os dados de exemplo?"
        texto="As viaturas, os pedidos e as definições voltam ao estado inicial da demonstração. O que adicionou ou alterou será perdido."
        confirmar="Sim, repor"
        onCancel={() => setConfirmarRepor(false)}
        onConfirm={async () => {
          setConfirmarRepor(false);
          await resetToSample();
          toast("Dados de exemplo repostos.");
          window.location.reload();
        }}
      />
    </div>
  );
}
