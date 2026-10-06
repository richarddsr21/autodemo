"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { siteConfig } from "@/config/site";

/** Placeholder elegante (preto e dourado) para quando não há foto ou ela falha. */
export function CarImagePlaceholder({ label }: { label?: string }) {
  return (
    <div
      role="img"
      aria-label={label ?? "Imagem indisponível"}
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_50%_40%,#1f1a10_0%,#0A0A0A_70%)]"
    >
      <svg viewBox="16 30 92 38" className="w-16 text-gold/70" fill="currentColor" aria-hidden="true">
        <path d="M20 56h7c4-9 11-19 25-21h17c11 0 19 7 25 14l7 2c3 1 5 3 5 6v3H20Z" />
        <circle cx="39" cy="60" r="6" />
        <circle cx="83" cy="60" r="6" />
      </svg>
      <span className="text-[11px] tracking-[0.25em] text-gold/60 uppercase">{siteConfig.defaults.nome}</span>
    </div>
  );
}

type CarImageProps = Omit<ImageProps, "src" | "onError"> & { src?: string };

/** `next/image` com recurso ao placeholder se a imagem não carregar. */
export function CarImage({ src, alt, ...props }: CarImageProps) {
  const [falhou, setFalhou] = useState<string | null>(null);
  if (!src || falhou === src) return <CarImagePlaceholder label={alt} />;
  // Fotos carregadas no painel (data:/blob:) não passam pelo otimizador.
  const local = src.startsWith("data:") || src.startsWith("blob:");
  return <Image src={src} alt={alt} unoptimized={local} onError={() => setFalhou(src)} {...props} />;
}
