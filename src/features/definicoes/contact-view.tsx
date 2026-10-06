"use client";

import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { WhatsappIcon } from "@/components/ui/brand-icons";
import { container } from "@/components/ui/container";
import { ContactForm } from "@/features/pedidos/contact-form";
import { mensagens, whatsappLink } from "@/lib/whatsapp";
import { useSettings } from "./use-settings";

function Cartao({ Icon, titulo, children }: { Icon: LucideIcon | typeof WhatsappIcon; titulo: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-line-ink bg-light-surface p-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-bg text-gold">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <h2 className="text-xs font-semibold tracking-[0.14em] text-muted-ink uppercase">{titulo}</h2>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}

export function ContactView() {
  const s = useSettings();
  const moradaCompleta = [s.morada, `${s.codigoPostal} ${s.localidade}`, "Portugal"].filter(Boolean).join(", ");
  const mapa = `https://www.google.com/maps?q=${encodeURIComponent(moradaCompleta)}&output=embed`;
  const direcoes = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(moradaCompleta)}`;

  return (
    <div className="bg-light py-12 text-ink sm:py-16">
      <div className={`${container} grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-12`}>
        <div className="space-y-4">
          <Cartao Icon={Phone} titulo="Telefone">
            <a href={`tel:${s.telefone.replace(/\s/g, "")}`} className="text-lg font-semibold hover:text-gold-ink">
              {s.telefone}
            </a>
          </Cartao>
          <Cartao Icon={WhatsappIcon} titulo="WhatsApp">
            <a href={whatsappLink(s.whatsapp, mensagens.geral(s.nome))} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold hover:text-gold-ink">
              Enviar mensagem
            </a>
          </Cartao>
          <Cartao Icon={Mail} titulo="E-mail">
            <a href={`mailto:${s.email}`} className="text-lg font-semibold break-all hover:text-gold-ink">
              {s.email}
            </a>
          </Cartao>
          <Cartao Icon={MapPin} titulo="Morada">
            <p className="font-semibold">
              {s.morada && (
                <>
                  {s.morada}
                  <br />
                </>
              )}
              {s.codigoPostal} {s.localidade}
            </p>
            <a href={direcoes} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm font-semibold text-gold-ink hover:underline">
              Obter direções
            </a>
          </Cartao>
          <Cartao Icon={Clock} titulo="Horário">
            <dl className="space-y-1">
              {s.horario.map((h) => (
                <div key={h.dias} className="flex flex-wrap justify-between gap-x-6">
                  <dt>{h.dias}</dt>
                  <dd className="font-semibold">{h.horas}</dd>
                </div>
              ))}
            </dl>
          </Cartao>
        </div>

        <div className="space-y-6">
          <section aria-labelledby="form-contacto-titulo" className="rounded-2xl border border-line-ink bg-light-surface p-6 sm:p-8">
            <h2 id="form-contacto-titulo" className="text-2xl font-semibold">
              Envie-nos uma mensagem
            </h2>
            <p className="mt-1 mb-6 text-muted-ink">Respondemos pelo WhatsApp, normalmente no próprio dia.</p>
            <ContactForm />
          </section>
          <div className="overflow-hidden rounded-2xl border border-line-ink bg-light-surface">
            <iframe
              title={`Mapa: ${moradaCompleta}`}
              src={mapa}
              className="aspect-[16/10] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
