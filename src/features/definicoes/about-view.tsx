"use client";

import { ArrowRight, BadgeCheck, Handshake, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { WhatsappIcon } from "@/components/ui/brand-icons";
import { buttonClass } from "@/components/ui/button";
import { container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { mensagens, whatsappLink } from "@/lib/whatsapp";
import { useSettings } from "./use-settings";

const ICONES_VALORES = [ShieldCheck, BadgeCheck, Handshake];

export function AboutView() {
  const s = useSettings();
  return (
    <>
      <section className="bg-light py-16 text-ink sm:py-20">
        <div className={`${container} grid items-center gap-10 lg:grid-cols-2 lg:gap-16`}>
          <div>
            <SectionHeading tone="light" eyebrow="A nossa história" title={s.sobreTitulo} />
            <p className="mt-6 text-lg leading-relaxed whitespace-pre-line text-ink/80">{s.sobreTexto}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/comprar" className={buttonClass("primary", "lg", "group")}>
                Ver viaturas
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <a href={whatsappLink(s.whatsapp, mensagens.geral(s.nome))} target="_blank" rel="noopener noreferrer" className={buttonClass("outlineInk", "lg")}>
                <WhatsappIcon className="size-5" />
                Falar connosco
              </a>
            </div>
          </div>
          <div className="reveal relative aspect-[4/3] overflow-hidden rounded-3xl border border-line-ink bg-bg">
            <Image src={siteConfig.imagens.sobre} alt={`Viatura no stand ${s.nome}`} fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/70 to-transparent" aria-hidden="true" />
            <p className="absolute bottom-5 left-5 font-display text-2xl font-semibold text-text">
              {s.nome}
              <span className="block text-sm font-normal tracking-[0.2em] text-gold uppercase">Venda &amp; Aluguer</span>
            </p>
          </div>
        </div>
      </section>

      <section aria-label="O stand em números" className="border-y border-line bg-bg py-14">
        <dl className={`${container} reveal grid grid-cols-2 gap-8 lg:grid-cols-4`}>
          {siteConfig.numeros.map((n) => (
            <div key={n.label} className="text-center">
              <dt className="sr-only">{n.label}</dt>
              <dd className="font-display text-4xl font-semibold text-gold sm:text-5xl">{n.valor}</dd>
              <dd className="mt-2 text-sm text-muted">{n.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-light py-16 text-ink sm:py-20">
        <div className={container}>
          <SectionHeading tone="light" eyebrow="Os nossos valores" title="O que nos guia" />
          <ul className="reveal mt-10 grid gap-5 md:grid-cols-3">
            {siteConfig.valores.map((v, i) => {
              const Icon = ICONES_VALORES[i % ICONES_VALORES.length];
              return (
                <li key={v.titulo} className="rounded-2xl border border-line-ink bg-light-surface p-6">
                  <span className="flex size-12 items-center justify-center rounded-full bg-bg text-gold">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold">{v.titulo}</h3>
                  <p className="mt-2 leading-relaxed text-muted-ink">{v.texto}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
