"use client";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { CarImage } from "@/components/ui/car-image";

const arrowClass =
  "flex size-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-md backdrop-blur-sm transition-colors hover:bg-gold hover:text-on-gold";

/** Muda de foto com gesto de deslizar (telemóvel). */
function useSwipe(onPrev: () => void, onNext: () => void) {
  const inicio = useRef<number | null>(null);
  return {
    onTouchStart: (e: TouchEvent) => {
      inicio.current = e.touches[0]?.clientX ?? null;
    },
    onTouchEnd: (e: TouchEvent) => {
      const x0 = inicio.current;
      const x1 = e.changedTouches[0]?.clientX;
      inicio.current = null;
      if (x0 === null || x1 === undefined || Math.abs(x1 - x0) < 40) return;
      if (x1 < x0) onNext();
      else onPrev();
    },
  };
}

export function Gallery({ fotos, nome, selo }: { fotos: string[]; nome: string; selo?: string | null }) {
  const [atual, setAtual] = useState(0);
  const [ampliada, setAmpliada] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const total = fotos.length;
  const indice = Math.min(atual, Math.max(total - 1, 0));
  const anterior = () => setAtual((i) => (i - 1 + total) % total);
  const seguinte = () => setAtual((i) => (i + 1) % total);
  const swipe = useSwipe(anterior, seguinte);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (ampliada && !d.open) d.showModal();
    if (!ampliada && d.open) d.close();
  }, [ampliada]);

  const onKey = (e: KeyboardEvent) => {
    if (total < 2) return;
    if (e.key === "ArrowLeft") anterior();
    if (e.key === "ArrowRight") seguinte();
  };

  const altFoto = (i: number) => `${nome}, fotografia ${i + 1} de ${total}`;

  return (
    <div>
      <div
        className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-line-ink bg-[#ECEAE4]"
        onKeyDown={onKey}
        {...swipe}
      >
        <CarImage
          key={fotos[indice]}
          src={fotos[indice]}
          alt={altFoto(indice)}
          fill
          fetchPriority={indice === 0 ? "high" : "auto"}
          loading={indice === 0 ? "eager" : "lazy"}
          sizes="(min-width: 1024px) 760px, 100vw"
          className={`object-cover ${selo ? "grayscale-[50%]" : ""}`}
        />
        {total > 0 && (
          <button
            type="button"
            onClick={() => setAmpliada(true)}
            className="absolute inset-0 cursor-zoom-in"
            aria-label="Ampliar fotografia"
          />
        )}
        {selo && (
          <span className="pointer-events-none absolute top-4 left-4 rounded-lg border-2 border-gold bg-bg/85 px-4 py-1.5 font-display text-base font-semibold tracking-[0.2em] text-gold uppercase">
            {selo}
          </span>
        )}
        {total > 1 && (
          <>
            <button type="button" onClick={anterior} aria-label="Fotografia anterior" className={`${arrowClass} absolute top-1/2 left-3 -translate-y-1/2`}>
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" onClick={seguinte} aria-label="Fotografia seguinte" className={`${arrowClass} absolute top-1/2 right-3 -translate-y-1/2`}>
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
        <div className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-2">
          {total > 0 && (
            <span className="rounded-full bg-bg/75 px-3 py-1 text-xs font-medium text-text backdrop-blur-sm">
              {indice + 1} / {total}
            </span>
          )}
          <span className="hidden size-8 items-center justify-center rounded-full bg-bg/75 text-text backdrop-blur-sm sm:flex">
            <Expand className="size-4" aria-hidden="true" />
          </span>
        </div>
      </div>

      {total > 1 && (
        <ul className="mt-3 flex gap-2.5 overflow-x-auto pb-1" aria-label="Miniaturas">
          {fotos.map((src, i) => (
            <li key={`${src}-${i}`} className="shrink-0">
              <button
                type="button"
                onClick={() => setAtual(i)}
                aria-label={`Ver fotografia ${i + 1}`}
                aria-current={i === indice}
                className={`relative block aspect-[4/3] w-20 overflow-hidden rounded-lg border-2 transition-all sm:w-24 ${
                  i === indice ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <CarImage src={src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Lightbox */}
      <dialog
        ref={dialogRef}
        aria-label={`Fotografias de ${nome}`}
        onClose={() => setAmpliada(false)}
        onKeyDown={onKey}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-black/95 p-0 text-text backdrop:bg-black/80"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm text-muted">
              {nome} · {indice + 1} / {total}
            </p>
            <button
              type="button"
              onClick={() => setAmpliada(false)}
              aria-label="Fechar"
              autoFocus
              className="flex size-11 items-center justify-center rounded-full border border-line transition-colors hover:border-gold hover:text-gold"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="relative flex-1" {...swipe}>
            {ampliada && (
              <CarImage key={fotos[indice]} src={fotos[indice]} alt={altFoto(indice)} fill sizes="100vw" className="object-contain" />
            )}
            {total > 1 && (
              <>
                <button type="button" onClick={anterior} aria-label="Fotografia anterior" className={`${arrowClass} absolute top-1/2 left-3 -translate-y-1/2 sm:left-6`}>
                  <ChevronLeft className="size-5" />
                </button>
                <button type="button" onClick={seguinte} aria-label="Fotografia seguinte" className={`${arrowClass} absolute top-1/2 right-3 -translate-y-1/2 sm:right-6`}>
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
          </div>
          <ul className="flex justify-center gap-2 overflow-x-auto px-4 py-4">
            {fotos.map((src, i) => (
              <li key={`lb-${src}-${i}`} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setAtual(i)}
                  aria-label={`Ver fotografia ${i + 1}`}
                  aria-current={i === indice}
                  className={`relative block aspect-[4/3] w-16 overflow-hidden rounded-md border-2 ${i === indice ? "border-gold" : "border-transparent opacity-60"}`}
                >
                  <CarImage src={src} alt="" fill sizes="64px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </div>
  );
}
