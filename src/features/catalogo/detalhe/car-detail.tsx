"use client";

import {
  BadgeCheck,
  CalendarDays,
  CarFront,
  Check,
  Cog,
  DoorOpen,
  Fuel,
  Gauge,
  HandCoins,
  Heart,
  Palette,
  Phone,
  RefreshCcw,
  ShieldCheck,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { WhatsappIcon } from "@/components/ui/brand-icons";
import { buttonClass } from "@/components/ui/button";
import { DataError } from "@/components/ui/data-error";
import { container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/page-header";
import { ReservationForm } from "@/features/aluguer/reservation-form";
import { useSettings } from "@/features/definicoes/use-settings";
import { formatEuro, formatKm, nomeCarro } from "@/lib/format";
import { CAIXA_LABEL, CATEGORIA_LABEL, COMBUSTIVEL_LABEL, type Car } from "@/lib/models";
import { useOrigin } from "@/lib/use-origin";
import { mensagens, whatsappLink } from "@/lib/whatsapp";
import { useFavorites } from "../favorites";
import { useCar } from "../use-cars";
import { FinanceSimulator } from "./finance-simulator";
import { Gallery } from "./gallery";
import { SimilarCars } from "./similar-cars";

function Preco({ car, className = "" }: { car: Car; className?: string }) {
  if (car.tipo === "venda") {
    return <span className={className}>{car.precoVenda ? formatEuro(car.precoVenda) : "Sob consulta"}</span>;
  }
  return (
    <span className={className}>
      {car.precoDia ? formatEuro(car.precoDia) : "—"}
      <span className="text-base font-normal text-muted-ink"> /dia</span>
    </span>
  );
}

export function CarDetail({ slug, initialCar }: { slug: string; initialCar: Car | null }) {
  const { data, loading, error } = useCar(slug);
  // Enquanto os dados locais carregam, mostra a versão gerada no servidor (dados de exemplo).
  const car = data === undefined ? initialCar : data;
  const settings = useSettings();
  const origin = useOrigin();
  const { isFavorite, toggle } = useFavorites();

  if (!car || car.estado === "escondido") {
    if (error && data === undefined) {
      return (
        <div className={`${container} bg-light py-16`}>
          <DataError />
        </div>
      );
    }
    if (loading) return <DetailSkeleton />;
    return <NotFound />;
  }

  const nome = nomeCarro(car);
  const url = `${origin}/carro/${car.slug}`;
  const wa = whatsappLink(settings.whatsapp, mensagens.sobreCarro(car, url));
  const tel = `tel:${settings.telefone.replace(/\s/g, "")}`;
  const selo = car.estado === "vendido" ? "Vendido" : car.estado === "alugado" ? "Alugado" : null;
  const favorito = isFavorite(car.id);
  const lista = car.tipo === "venda" ? { href: "/comprar", label: "Comprar" } : { href: "/alugar", label: "Alugar" };

  const ficha: { Icon: LucideIcon; label: string; valor: string }[] = [
    { Icon: CalendarDays, label: "Ano", valor: String(car.ano) },
    { Icon: Gauge, label: "Quilómetros", valor: formatKm(car.km) },
    { Icon: Fuel, label: "Combustível", valor: COMBUSTIVEL_LABEL[car.combustivel] },
    { Icon: Cog, label: "Caixa", valor: CAIXA_LABEL[car.caixa] },
    ...(car.potenciaCv ? [{ Icon: Zap, label: "Potência", valor: `${car.potenciaCv} cv` }] : []),
    { Icon: Palette, label: "Cor", valor: car.cor },
    { Icon: Users, label: "Lugares", valor: String(car.lugares) },
    { Icon: DoorOpen, label: "Portas", valor: String(car.portas) },
    { Icon: CarFront, label: "Categoria", valor: CATEGORIA_LABEL[car.categoria] },
  ];

  const garantias =
    car.tipo === "venda"
      ? [
          { Icon: ShieldCheck, texto: "Garantia incluída" },
          { Icon: HandCoins, texto: "Financiamento à medida" },
          { Icon: RefreshCcw, texto: "Aceitamos a sua retoma" },
        ]
      : [
          { Icon: ShieldCheck, texto: "Seguro incluído" },
          { Icon: BadgeCheck, texto: "Viatura revista e limpa" },
          { Icon: HandCoins, texto: "Sem custos escondidos" },
        ];

  return (
    <div className="bg-light pb-24 text-ink lg:pb-0">
      <div className={`${container} py-6 sm:py-8`}>
        <Breadcrumbs tone="light" items={[{ href: "/", label: "Início" }, lista, { label: nome }]} />

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-10">
          <div className="lg:col-start-1">
            <Gallery fotos={car.fotos} nome={`${nome} ${car.versao ?? ""}`.trim()} selo={selo} />
          </div>

          {/* Painel de contacto / preço */}
          <aside className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="space-y-6 rounded-2xl border border-line-ink bg-light-surface p-6 shadow-[var(--shadow-soft)] lg:sticky lg:top-24">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase">
                  <span className="rounded-full bg-bg px-2.5 py-1 text-text">{car.tipo === "venda" ? "Venda" : "Aluguer"}</span>
                  <span className="rounded-full border border-line-ink px-2.5 py-1 text-muted-ink">{CATEGORIA_LABEL[car.categoria]}</span>
                  {selo && <span className="rounded-full bg-gold px-2.5 py-1 text-on-gold">{selo}</span>}
                </div>
                <h1 className="mt-3 text-3xl leading-tight font-semibold">{nome}</h1>
                {car.versao && <p className="mt-1 text-muted-ink">{car.versao}</p>}
                <p className="mt-3 text-sm text-muted-ink">
                  {car.ano} · {formatKm(car.km)} · {COMBUSTIVEL_LABEL[car.combustivel]} · {CAIXA_LABEL[car.caixa]}
                </p>
              </div>

              <div className="flex items-end justify-between gap-4 border-y border-line-ink py-5">
                <div>
                  <p className="text-xs font-semibold tracking-[0.14em] text-muted-ink uppercase">
                    {car.tipo === "venda" ? "Preço" : "Preço por dia"}
                  </p>
                  <Preco car={car} className="font-display text-4xl font-semibold" />
                </div>
                <button
                  type="button"
                  onClick={() => toggle(car.id)}
                  aria-pressed={favorito}
                  aria-label={favorito ? "Remover dos favoritos" : "Guardar nos favoritos"}
                  className="flex size-11 items-center justify-center rounded-full border border-line-ink transition-colors hover:border-gold-ink"
                >
                  <Heart className={`size-5 ${favorito ? "fill-gold text-gold-ink" : ""}`} aria-hidden="true" />
                </button>
              </div>

              {car.estado === "vendido" ? (
                <div className="space-y-3">
                  <p className="rounded-xl bg-light p-4 text-sm text-muted-ink">
                    Esta viatura já foi vendida. Procuramos uma semelhante para si, sem compromisso.
                  </p>
                  <a href={whatsappLink(settings.whatsapp, `Olá! Procuro uma viatura semelhante ao ${nome} (${car.ano}).`)} target="_blank" rel="noopener noreferrer" className={buttonClass("whatsapp", "lg", "w-full")}>
                    <WhatsappIcon className="size-5" />
                    Pedir uma viatura semelhante
                  </a>
                </div>
              ) : (
                <div className="grid gap-3">
                  <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClass("whatsapp", "lg", "w-full")}>
                    <WhatsappIcon className="size-5" />
                    Falar no WhatsApp sobre este carro
                  </a>
                  <a href={tel} className={buttonClass("outlineInk", "lg", "w-full")}>
                    <Phone className="size-5" aria-hidden="true" />
                    Ligar {settings.telefone}
                  </a>
                </div>
              )}

              {car.tipo === "aluguer" && (
                <div className="border-t border-line-ink pt-6">
                  <ReservationForm car={car} carUrl={url} />
                </div>
              )}

              <ul className="space-y-2.5 text-sm">
                {garantias.map(({ Icon, texto }) => (
                  <li key={texto} className="flex items-center gap-2.5">
                    <Icon className="size-4 text-gold-ink" aria-hidden="true" />
                    {texto}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Detalhes */}
          <div className="space-y-10 lg:col-start-1">
            <section aria-labelledby="ficha-titulo">
              <h2 id="ficha-titulo" className="text-2xl font-semibold">
                Ficha técnica
              </h2>
              <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {ficha.map(({ Icon, label, valor }) => (
                  <div key={label} className="min-w-0 rounded-xl border border-line-ink bg-light-surface p-4">
                    <dt className="flex items-center gap-2 text-xs text-muted-ink">
                      <Icon className="size-4 shrink-0 text-gold-ink" aria-hidden="true" />
                      {label}
                    </dt>
                    <dd className="mt-1 font-semibold break-words">{valor}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {car.tipo === "venda" && car.estado === "disponivel" && car.precoVenda && (
              <FinanceSimulator car={{ ...car, precoVenda: car.precoVenda }} />
            )}

            <section aria-labelledby="descricao-titulo">
              <h2 id="descricao-titulo" className="text-2xl font-semibold">
                Descrição
              </h2>
              <p className="mt-4 leading-relaxed whitespace-pre-line text-ink/85">{car.descricao}</p>
            </section>

            {car.equipamento.length > 0 && (
              <section aria-labelledby="equipamento-titulo">
                <h2 id="equipamento-titulo" className="text-2xl font-semibold">
                  Equipamento
                </h2>
                <ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  {car.equipamento.map((e) => (
                    <li key={e} className="flex items-center gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-ink">
                        <Check className="size-3.5" aria-hidden="true" />
                      </span>
                      {e}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>

      <SimilarCars car={car} />

      {/* Barra fixa no telemóvel */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 px-4 py-3 text-text backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs text-muted">{nome}</p>
            <Preco car={car} className="font-display text-xl font-semibold [&>span]:text-muted" />
          </div>
          {car.tipo === "aluguer" && car.estado !== "vendido" ? (
            <div className="flex shrink-0 gap-2">
              <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp" className={buttonClass("whatsapp", "md", "size-11 shrink-0 px-0")}>
                <WhatsappIcon className="size-5 shrink-0" />
              </a>
              <a href="#reserva" className={buttonClass("primary", "md")}>
                Reservar
              </a>
            </div>
          ) : car.estado !== "vendido" ? (
            <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClass("whatsapp", "md")}>
              <WhatsappIcon className="size-5" />
              WhatsApp
            </a>
          ) : (
            <Link href={lista.href} className={buttonClass("primary", "md")}>
              Ver outras
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="bg-light py-24 text-center text-ink">
      <div className={container}>
        <p className="font-display text-sm font-semibold tracking-[0.2em] text-gold-ink uppercase">Viatura indisponível</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Esta viatura já não está no nosso stock</h1>
        <p className="mx-auto mt-3 max-w-md text-muted-ink">Pode ter sido vendida ou retirada. Veja as viaturas disponíveis ou fale connosco.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/comprar" className={buttonClass("primary", "lg")}>
            Ver viaturas à venda
          </Link>
          <Link href="/alugar" className={buttonClass("outlineInk", "lg")}>
            Ver aluguer
          </Link>
        </div>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="bg-light py-8" aria-busy="true" aria-label="A carregar viatura">
      <div className={`${container} grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]`}>
        <div className="aspect-[16/10] animate-pulse rounded-2xl bg-[#ECEAE4]" />
        <div className="h-96 animate-pulse rounded-2xl bg-[#ECEAE4]" />
      </div>
    </div>
  );
}
