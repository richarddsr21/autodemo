"use client";

import { ArrowRight, KeyRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import { useSettings } from "@/features/definicoes/use-settings";
import { SearchBox } from "./search-box";

export function Hero() {
  const s = useSettings();
  // No desktop o hero ocupa o ecrã visível (menos barra superior, header e a margem da pesquisa),
  // para a caixa de pesquisa aparecer sem scroll. Em ecrãs baixos (variante short:) compacta o texto.
  return (
    <section
      aria-labelledby="hero-titulo"
      className="relative isolate flex flex-col bg-bg lg:min-h-[calc(100svh-7rem-3rem)]"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src={siteConfig.imagens.hero}
          alt=""
          fill
          fetchPriority="high"
          loading="eager"
          sizes="100vw"
          quality={60}
          className="-z-10 object-cover object-[68%_center] opacity-90"
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-bg via-bg/80 to-bg/10"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-bg to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-bg/70 to-transparent"
          aria-hidden="true"
        />
      </div>

      <div
        className={`${container} hero-in flex flex-1 flex-col justify-center pt-14 pb-10 sm:pt-20 lg:py-12 short:py-8`}
      >
        <p className="mb-5 inline-flex short:hidden w-fit items-center gap-2 rounded-full border border-gold/30 bg-bg/40 px-3.5 py-1.5 text-xs font-medium tracking-[0.18em] text-gold uppercase backdrop-blur-sm">
          <span className="size-1.5 rounded-full bg-gold" aria-hidden="true" />
          Stand de automóveis
        </p>
        <h1
          id="hero-titulo"
          className="max-w-3xl text-5xl leading-[1.05] font-semibold text-text sm:text-6xl lg:text-7xl short:text-6xl"
        >
          {s.heroTitulo}
          <span className="block text-gold">{s.heroDestaque}</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-text/80 sm:text-lg short:mt-4 short:text-base">
          {s.heroSubtitulo}
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row short:mt-6">
          <Link
            href="/comprar"
            className={buttonClass("primary", "lg", "group")}
          >
            Ver viaturas à venda
            <ArrowRight
              className="size-5 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
          <Link
            href="/alugar"
            className={buttonClass(
              "outline",
              "lg",
              "bg-bg/30 backdrop-blur-sm",
            )}
          >
            <KeyRound className="size-5" aria-hidden="true" />
            Alugar uma viatura
          </Link>
        </div>
      </div>

      <div className={`${container} relative z-10 translate-y-8`}>
        <SearchBox />
      </div>
    </section>
  );
}
