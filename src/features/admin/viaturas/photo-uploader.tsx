"use client";

import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { useId, useState, type DragEvent } from "react";
import { CarImage } from "@/components/ui/car-image";
import { useToast } from "@/components/ui/toast";
import { resizeImage } from "@/lib/images";
import { MAX_FOTOS } from "./car-schema";

function mover<T>(lista: T[], de: number, para: number): T[] {
  const copia = [...lista];
  const [item] = copia.splice(de, 1);
  copia.splice(para, 0, item);
  return copia;
}

const iconBtn =
  "flex size-8 items-center justify-center rounded-lg bg-white/95 text-ink shadow-sm transition-colors hover:bg-gold hover:text-on-gold disabled:opacity-40 disabled:hover:bg-white/95 disabled:hover:text-ink";

/**
 * Fotografias da viatura: arrastar e largar ou escolher ficheiros,
 * redimensionadas no navegador (máx. 1600 px). A primeira é a capa.
 */
export function PhotoUploader({
  value,
  onChange,
  erro,
}: {
  value: string[];
  onChange: (fotos: string[]) => void;
  erro?: string;
}) {
  const id = useId();
  const toast = useToast();
  const [sobre, setSobre] = useState(false);
  const [progresso, setProgresso] = useState<{ feito: number; total: number } | null>(null);
  const [aArrastar, setAArrastar] = useState<number | null>(null);

  const adicionar = async (ficheiros: FileList | File[]) => {
    const lista = [...ficheiros].filter((f) => f.type.startsWith("image/"));
    if (lista.length === 0) {
      toast("Escolha ficheiros de imagem (JPG, PNG ou WebP).", "erro");
      return;
    }
    const espaco = MAX_FOTOS - value.length;
    if (espaco <= 0) {
      toast(`Já tem ${MAX_FOTOS} fotografias, o máximo permitido.`, "erro");
      return;
    }
    const aProcessar = lista.slice(0, espaco);
    if (lista.length > espaco) toast(`Só foram adicionadas ${espaco} fotografias (máximo ${MAX_FOTOS}).`, "erro");

    const novas: string[] = [];
    setProgresso({ feito: 0, total: aProcessar.length });
    for (const [i, f] of aProcessar.entries()) {
      try {
        novas.push(await resizeImage(f));
      } catch (e) {
        toast(e instanceof Error ? e.message : `Não foi possível processar "${f.name}".`, "erro");
      }
      setProgresso({ feito: i + 1, total: aProcessar.length });
    }
    setProgresso(null);
    if (novas.length) onChange([...value, ...novas]);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setSobre(false);
    if (e.dataTransfer.files.length) void adicionar(e.dataTransfer.files);
  };

  // Reordenar arrastando miniaturas (desktop); no telemóvel usam-se as setas.
  const onItemDrop = (para: number) => (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (aArrastar !== null && aArrastar !== para) onChange(mover(value, aArrastar, para));
    setAArrastar(null);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (aArrastar === null) setSobre(true);
        }}
        onDragLeave={() => setSobre(false)}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
          sobre ? "border-gold bg-gold/10" : erro ? "border-red-400 bg-red-50" : "border-ink/20 bg-light hover:border-gold-ink"
        }`}
        data-erro={erro ? true : undefined}
      >
        {progresso ? (
          <>
            <Loader2 className="size-8 animate-spin text-gold-ink" aria-hidden="true" />
            <p className="mt-3 font-medium" role="status">
              A preparar fotografias… {progresso.feito} de {progresso.total}
            </p>
          </>
        ) : (
          <>
            <span className="flex size-12 items-center justify-center rounded-full bg-gold/15 text-gold-ink">
              <ImagePlus className="size-6" aria-hidden="true" />
            </span>
            <p className="mt-3 font-medium">
              Arraste as fotografias para aqui ou{" "}
              <label htmlFor={id} className="cursor-pointer font-semibold text-gold-ink underline underline-offset-4 hover:text-ink">
                escolha do dispositivo
              </label>
            </p>
            <p className="mt-1 text-sm text-muted-ink">
              Até {MAX_FOTOS} fotografias. São reduzidas automaticamente para carregar rápido.
            </p>
          </>
        )}
        <input
          id={id}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          disabled={!!progresso}
          onChange={(e) => {
            if (e.target.files) void adicionar(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
      {erro && <p className="mt-2 text-sm text-red-700">{erro}</p>}

      {value.length > 0 && (
        <>
          <p className="mt-5 mb-3 text-sm text-muted-ink">
            {value.length} {value.length === 1 ? "fotografia" : "fotografias"} · a primeira é a capa. Arraste para reordenar.
          </p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {value.map((src, i) => (
              <li
                key={`${i}-${src.slice(-24)}`}
                draggable
                onDragStart={() => setAArrastar(i)}
                onDragEnd={() => setAArrastar(null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onItemDrop(i)}
                className={`group relative aspect-[4/3] cursor-grab overflow-hidden rounded-xl border-2 bg-[#ECEAE4] active:cursor-grabbing ${
                  i === 0 ? "border-gold" : "border-transparent"
                } ${aArrastar === i ? "opacity-40" : ""}`}
              >
                <CarImage src={src} alt={`Fotografia ${i + 1}`} fill sizes="240px" className="pointer-events-none object-cover" />
                {i === 0 && (
                  <span className="absolute top-2 left-2 rounded-full bg-gold px-2.5 py-0.5 text-xs font-semibold text-on-gold">
                    Capa
                  </span>
                )}
                <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-1">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className={iconBtn}
                      disabled={i === 0}
                      onClick={() => onChange(mover(value, i, i - 1))}
                      aria-label={`Mover fotografia ${i + 1} para trás`}
                    >
                      <ArrowLeft className="size-4" />
                    </button>
                    <button
                      type="button"
                      className={iconBtn}
                      disabled={i === value.length - 1}
                      onClick={() => onChange(mover(value, i, i + 1))}
                      aria-label={`Mover fotografia ${i + 1} para a frente`}
                    >
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                  <div className="flex gap-1">
                    {i !== 0 && (
                      <button
                        type="button"
                        className={iconBtn}
                        onClick={() => onChange(mover(value, i, 0))}
                        aria-label={`Usar fotografia ${i + 1} como capa`}
                        title="Usar como capa"
                      >
                        <Star className="size-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      className={`${iconBtn} hover:bg-red-600 hover:text-white`}
                      onClick={() => onChange(value.filter((_, j) => j !== i))}
                      aria-label={`Remover fotografia ${i + 1}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
