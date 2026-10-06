import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { container } from "@/components/ui/container";
import { FeatureIcon } from "@/components/ui/feature-icon";
import { siteConfig } from "@/config/site";

export function RentalBanner() {
  return (
    <section aria-labelledby="aluguer-titulo" className="bg-bg py-20 sm:py-24">
      <div className={container}>
        <div className="reveal relative isolate overflow-hidden rounded-3xl border border-line">
          <Image
            src={siteConfig.imagens.bannerAluguer}
            alt=""
            fill
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="-z-10 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-bg via-bg/90 to-bg/70" aria-hidden="true" />

          <div className="grid gap-10 p-7 sm:p-12 lg:grid-cols-[1fr_1.35fr] lg:items-center lg:gap-14">
            <div>
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-gold uppercase">
                <span className="h-px w-6 bg-gold" aria-hidden="true" />
                Aluguer
              </p>
              <h2 id="aluguer-titulo" className="text-3xl leading-tight font-semibold sm:text-4xl">
                Precisa de carro
                <span className="block text-gold">por uns dias?</span>
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-text/75">
                Férias, trabalho ou enquanto o seu está na oficina: escolha a viatura, diga-nos as datas e tratamos do resto.
              </p>
              <Link href="/alugar" className={buttonClass("primary", "lg", "group mt-8")}>
                Pedir reserva
                <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>

            <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-0">
              {siteConfig.vantagensAluguer.map((v, i) => (
                <li key={v.titulo} className={`flex flex-col items-center text-center sm:px-4 ${i > 0 ? "sm:border-l sm:border-line" : ""}`}>
                  <span className="flex size-12 items-center justify-center rounded-full border border-gold/40 bg-bg/50 text-gold">
                    <FeatureIcon name={v.icone} className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold">{v.titulo}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{v.texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
