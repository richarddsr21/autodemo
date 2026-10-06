"use client";

import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Controller, useForm, useWatch, type FieldErrors } from "react-hook-form";
import { buttonClass } from "@/components/ui/button";
import { FieldError, inputLight, labelLight, selectLight } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";
import { useCarMutations } from "@/features/catalogo/use-cars";
import { nomeCarro } from "@/lib/format";
import { zodResolver } from "@/lib/forms";
import {
  CAIXAS,
  CAIXA_LABEL,
  CATEGORIAS,
  CATEGORIA_LABEL,
  COMBUSTIVEIS,
  COMBUSTIVEL_LABEL,
  ESTADO_LABEL,
  TIPOS_CARRO,
  type Car,
  type CarInput,
} from "@/lib/models";
import { carSchema, EMPTY_FORM, ESTADOS_POR_TIPO, toFormValues, type CarFormValues } from "./car-schema";
import { PhotoUploader } from "./photo-uploader";
import { TagInput } from "./tag-input";

const MARCAS = [
  "Audi", "BMW", "Citroën", "Dacia", "Fiat", "Ford", "Honda", "Hyundai", "Kia", "Land Rover", "Mazda",
  "Mercedes-Benz", "Mini", "Nissan", "Opel", "Peugeot", "Porsche", "Renault", "Seat", "Skoda", "Tesla",
  "Toyota", "Volkswagen", "Volvo",
];

function Section({ titulo, descricao, children }: { titulo: string; descricao?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line-ink bg-light-surface p-5 sm:p-6">
      <h2 className="text-lg font-semibold">{titulo}</h2>
      {descricao && <p className="mt-0.5 text-sm text-muted-ink">{descricao}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Campo({
  id,
  label,
  erro,
  className = "",
  children,
}: {
  id: string;
  label: string;
  erro?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelLight}>
        {label}
      </label>
      {children}
      <FieldError id={`${id}-erro`}>{erro}</FieldError>
    </div>
  );
}

/** Formulário de adicionar/editar viatura. */
export function CarForm({ car }: { car?: Car }) {
  const router = useRouter();
  const toast = useToast();
  const { create, update } = useCarMutations();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CarFormValues, unknown, CarInput>({
    resolver: zodResolver(carSchema),
    defaultValues: car ? toFormValues(car) : EMPTY_FORM,
  });

  const tipo = useWatch({ control, name: "tipo" });

  // Avisa antes de sair com alterações por guardar.
  useEffect(() => {
    if (!isDirty || isSubmitting) return;
    const aviso = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", aviso);
    return () => window.removeEventListener("beforeunload", aviso);
  }, [isDirty, isSubmitting]);

  const mudarTipo = (novo: CarFormValues["tipo"]) => {
    setValue("tipo", novo, { shouldDirty: true });
    if (!ESTADOS_POR_TIPO[novo].includes(getValues("estado"))) setValue("estado", "disponivel", { shouldDirty: true });
  };

  const onValid = async (input: CarInput) => {
    try {
      if (car) {
        await update(car.id, input);
        toast(`${nomeCarro(input)} foi atualizada.`);
      } else {
        await create(input);
        toast(
          input.estado === "escondido"
            ? `${nomeCarro(input)} foi adicionada (escondida do site).`
            : `${nomeCarro(input)} foi adicionada e já aparece no site.`,
        );
      }
      router.push("/admin/viaturas");
    } catch {
      toast("Não foi possível guardar. Tente novamente.", "erro");
    }
  };

  const onInvalid = (e: FieldErrors<CarFormValues>) => {
    toast("Faltam dados ou há campos por corrigir. Veja as mensagens a vermelho.", "erro");
    if (e.fotos) document.querySelector("[data-erro]")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const reg = (name: keyof CarFormValues) => ({
    id: `car-${name}`,
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `car-${name}-erro` : undefined,
    ...register(name),
  });

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)} noValidate className="mx-auto max-w-4xl pb-28">
      <Link href="/admin/viaturas" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-ink hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar às viaturas
      </Link>
      <h1 className="mt-3 text-3xl font-semibold">{car ? `Editar ${nomeCarro(car)}` : "Adicionar viatura"}</h1>
      <p className="mt-1 text-muted-ink">
        {car ? "Altere os dados e guarde. As alterações aparecem logo no site." : "Preencha os dados. Os campos com * são obrigatórios."}
      </p>

      <div className="mt-8 space-y-6">
        <Section titulo="Tipo e estado">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className={labelLight} id="car-tipo-label">
                Esta viatura é para *
              </p>
              <div role="radiogroup" aria-labelledby="car-tipo-label" className="grid grid-cols-2 gap-2">
                {TIPOS_CARRO.map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={tipo === t}
                    onClick={() => mudarTipo(t)}
                    className={`h-12 rounded-xl border text-sm font-semibold transition-colors ${tipo === t ? "border-ink bg-ink text-light" : "border-line-ink bg-light hover:border-gold-ink"}`}
                  >
                    {t === "venda" ? "Venda" : "Aluguer"}
                  </button>
                ))}
              </div>
            </div>
            <Campo id="car-estado" label="Estado *" erro={errors.estado?.message}>
              <select className={selectLight} {...reg("estado")}>
                {ESTADOS_POR_TIPO[tipo].map((e) => (
                  <option key={e} value={e}>
                    {ESTADO_LABEL[e]}
                    {e === "escondido" ? " (não aparece no site)" : ""}
                  </option>
                ))}
              </select>
            </Campo>
          </div>
          <div className="mt-5 border-t border-line-ink pt-5">
            <Controller
              control={control}
              name="destaque"
              render={({ field }) => (
                <Switch
                  id="car-destaque"
                  checked={field.value}
                  onChange={field.onChange}
                  label="Destacar na página inicial"
                  descricao="Aparece primeiro em “Viaturas em destaque”."
                />
              )}
            />
          </div>
        </Section>

        <Section titulo="Fotografias *" descricao="A primeira fotografia é a capa que aparece no site.">
          <Controller
            control={control}
            name="fotos"
            render={({ field }) => <PhotoUploader value={field.value} onChange={field.onChange} erro={errors.fotos?.message} />}
          />
        </Section>

        <Section titulo="Identificação">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo id="car-marca" label="Marca *" erro={errors.marca?.message}>
              <input list="lista-marcas" autoComplete="off" placeholder="Ex.: BMW" className={inputLight} {...reg("marca")} />
              <datalist id="lista-marcas">
                {MARCAS.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </Campo>
            <Campo id="car-modelo" label="Modelo *" erro={errors.modelo?.message}>
              <input placeholder="Ex.: Série 3" className={inputLight} {...reg("modelo")} />
            </Campo>
            <Campo id="car-versao" label="Versão" erro={errors.versao?.message}>
              <input placeholder="Ex.: 320d Pack M" className={inputLight} {...reg("versao")} />
            </Campo>
            <div className="grid grid-cols-2 gap-4">
              <Campo id="car-ano" label="Ano *" erro={errors.ano?.message}>
                <input inputMode="numeric" placeholder="2020" className={inputLight} {...reg("ano")} />
              </Campo>
              <Campo id="car-categoria" label="Categoria *" erro={errors.categoria?.message}>
                <select className={selectLight} {...reg("categoria")}>
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORIA_LABEL[c]}
                    </option>
                  ))}
                </select>
              </Campo>
            </div>
          </div>
        </Section>

        <Section titulo="Características">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Campo id="car-km" label="Quilómetros *" erro={errors.km?.message}>
              <input inputMode="numeric" placeholder="Ex.: 85000" className={inputLight} {...reg("km")} />
            </Campo>
            <Campo id="car-combustivel" label="Combustível *" erro={errors.combustivel?.message}>
              <select className={selectLight} {...reg("combustivel")}>
                {COMBUSTIVEIS.map((c) => (
                  <option key={c} value={c}>
                    {COMBUSTIVEL_LABEL[c]}
                  </option>
                ))}
              </select>
            </Campo>
            <Campo id="car-caixa" label="Caixa *" erro={errors.caixa?.message}>
              <select className={selectLight} {...reg("caixa")}>
                {CAIXAS.map((c) => (
                  <option key={c} value={c}>
                    {CAIXA_LABEL[c]}
                  </option>
                ))}
              </select>
            </Campo>
            <Campo id="car-potenciaCv" label="Potência (cv)" erro={errors.potenciaCv?.message}>
              <input inputMode="numeric" placeholder="Ex.: 150" className={inputLight} {...reg("potenciaCv")} />
            </Campo>
            <Campo id="car-cor" label="Cor *" erro={errors.cor?.message}>
              <input placeholder="Ex.: Cinzento" className={inputLight} {...reg("cor")} />
            </Campo>
            <div className="grid grid-cols-2 gap-4">
              <Campo id="car-lugares" label="Lugares *" erro={errors.lugares?.message}>
                <input inputMode="numeric" className={inputLight} {...reg("lugares")} />
              </Campo>
              <Campo id="car-portas" label="Portas *" erro={errors.portas?.message}>
                <input inputMode="numeric" className={inputLight} {...reg("portas")} />
              </Campo>
            </div>
          </div>
        </Section>

        <Section titulo="Preço">
          {tipo === "venda" ? (
            <Campo id="car-precoVenda" label="Preço de venda (€) *" erro={errors.precoVenda?.message} className="sm:max-w-xs">
              <div className="relative">
                <input inputMode="numeric" placeholder="Ex.: 24900" className={`${inputLight} pr-10`} {...reg("precoVenda")} />
                <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted-ink">€</span>
              </div>
            </Campo>
          ) : (
            <Campo id="car-precoDia" label="Preço por dia (€) *" erro={errors.precoDia?.message} className="sm:max-w-xs">
              <div className="relative">
                <input inputMode="numeric" placeholder="Ex.: 45" className={`${inputLight} pr-16`} {...reg("precoDia")} />
                <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted-ink">€/dia</span>
              </div>
            </Campo>
          )}
        </Section>

        <Section titulo="Descrição e equipamento">
          <Campo id="car-descricao" label="Descrição" erro={errors.descricao?.message}>
            <textarea
              rows={5}
              placeholder="Estado da viatura, revisões, histórico, garantia…"
              className={`${inputLight} h-auto py-3 leading-relaxed`}
              {...reg("descricao")}
            />
          </Campo>
          <div className="mt-5">
            <label htmlFor="car-equipamento" className={labelLight}>
              Equipamento
            </label>
            <Controller
              control={control}
              name="equipamento"
              render={({ field }) => <TagInput id="car-equipamento" value={field.value} onChange={field.onChange} />}
            />
          </div>
        </Section>
      </div>

      {/* Barra de gravação */}
      <div className="fixed inset-x-0 bottom-[61px] z-20 border-t border-line-ink bg-light-surface/95 px-4 py-3 backdrop-blur-md lg:bottom-0 lg:left-[260px]">
        <div className="mx-auto flex max-w-4xl items-center justify-end gap-3">
          {isDirty && <p className="mr-auto hidden text-sm text-muted-ink sm:block">Tem alterações por guardar.</p>}
          <Link href="/admin/viaturas" className={buttonClass("outlineInk", "lg")}>
            Cancelar
          </Link>
          <button type="submit" disabled={isSubmitting} className={buttonClass("primary", "lg", "min-w-40")}>
            {isSubmitting ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <Save className="size-5" aria-hidden="true" />}
            {car ? "Guardar alterações" : "Guardar viatura"}
          </button>
        </div>
      </div>
    </form>
  );
}
