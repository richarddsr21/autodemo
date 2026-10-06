"use client";

import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { FacebookIcon, InstagramIcon, WhatsappIcon } from "@/components/ui/brand-icons";
import { container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { siteConfig } from "@/config/site";
import { useSettings } from "@/features/definicoes/use-settings";
import { mensagens, whatsappLink } from "@/lib/whatsapp";
import { NAV_LINKS } from "./nav-links";

const titulo = "mb-5 text-xs font-semibold tracking-[0.2em] text-gold uppercase";

export function Footer() {
  const s = useSettings();
  const redes = [
    { href: s.redes.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: s.redes.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: whatsappLink(s.whatsapp, mensagens.geral(s.nome)), label: "WhatsApp", Icon: WhatsappIcon },
  ].filter((r) => r.href);

  return (
    <footer className="border-t border-line bg-bg text-sm text-muted">
      <div className={`${container} grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:gap-12`}>
        <div>
          <Logo nome={s.nome} />
          <p className="mt-5 max-w-xs leading-relaxed">{s.slogan}</p>
          <ul className="mt-6 flex gap-2">
            {redes.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full border border-line text-text transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon className="size-4.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Rodapé">
          <h2 className={titulo}>Navegação</h2>
          <ul className="space-y-3">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={whatsappLink(s.whatsapp, `Olá ${s.nome}! Gostaria de vender o meu carro.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text transition-colors hover:text-gold"
              >
                Quer vender o seu carro?
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className={titulo}>Horário</h2>
          <ul className="space-y-3">
            {s.horario.map((h) => (
              <li key={h.dias} className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                <span>
                  <span className="block text-text">{h.dias}</span>
                  {h.horas}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={titulo}>Contactos</h2>
          <ul className="space-y-4">
            <li>
              <a href={`tel:${s.telefone.replace(/\s/g, "")}`} className="flex gap-3 transition-colors hover:text-gold">
                <Phone className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                {s.telefone}
              </a>
            </li>
            <li>
              <a href={`mailto:${s.email}`} className="flex gap-3 break-all transition-colors hover:text-gold">
                <Mail className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                {s.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
              <span>
                {s.morada && (
                  <>
                    {s.morada}
                    <br />
                  </>
                )}
                {s.codigoPostal} {s.localidade}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className={`${container} flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between`}>
          <p>
            © {new Date().getFullYear()} {s.nome}. Todos os direitos reservados.
          </p>
          {siteConfig.demo && <p>Versão de demonstração</p>}
        </div>
      </div>
    </footer>
  );
}
