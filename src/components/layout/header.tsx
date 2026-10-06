"use client";

import { Heart, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { WhatsappIcon } from "@/components/ui/brand-icons";
import { buttonClass } from "@/components/ui/button";
import { container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { useFavorites } from "@/features/catalogo/favorites";
import { useSettings } from "@/features/definicoes/use-settings";
import { mensagens, whatsappLink } from "@/lib/whatsapp";
import { NAV_LINKS, isActive } from "./nav-links";

export function Header() {
  const pathname = usePathname();
  const settings = useSettings();
  const { ids: favoritos } = useFavorites();
  const [aberto, setAberto] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const wa = whatsappLink(settings.whatsapp, mensagens.geral(settings.nome));

  // Fecha o menu ao mudar de página.
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setAberto(false);
  }

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [aberto]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md">
      <div className={`${container} flex h-18 items-center justify-between gap-6`}>
        <Logo nome={settings.nome} />

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((l) => {
              const ativo = isActive(pathname, l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={ativo ? "page" : undefined}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 hover:text-gold ${ativo ? "text-gold" : "text-text/85"}`}
                  >
                    {l.label}
                    {ativo && <span className="absolute inset-x-4 -bottom-0.5 h-px bg-gold" aria-hidden="true" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/favoritos"
            aria-label={favoritos.length ? `Os meus favoritos (${favoritos.length})` : "Os meus favoritos"}
            className={`relative inline-flex size-11 items-center justify-center rounded-xl border transition-colors hover:border-gold hover:text-gold ${pathname === "/favoritos" ? "border-gold text-gold" : "border-line text-text"}`}
          >
            <Heart className={`size-5 ${favoritos.length ? "fill-gold text-gold" : ""}`} aria-hidden="true" />
            {favoritos.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-on-gold" aria-hidden="true">
                {favoritos.length}
              </span>
            )}
          </Link>
          <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "md", "max-sm:size-11 max-sm:px-0")}>
            <WhatsappIcon className="size-4.5" />
            <span className="max-sm:sr-only">Falar no WhatsApp</span>
          </a>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-xl border border-line text-text transition-colors hover:border-gold hover:text-gold lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-movel"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            onClick={() => setAberto((v) => !v)}
          >
            {aberto ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Menu móvel */}
      <div
        id="menu-movel"
        hidden={!aberto}
        className="absolute inset-x-0 top-full h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-line bg-bg pb-16 lg:hidden"
      >
        <nav aria-label="Menu móvel" className={`${container} flex flex-col py-6`}>
          {NAV_LINKS.map((l) => {
            const ativo = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={ativo ? "page" : undefined}
                className={`flex items-center justify-between border-b border-line py-4 font-display text-2xl font-medium ${ativo ? "text-gold" : "text-text"}`}
              >
                {l.label}
                {ativo && <span className="size-1.5 rounded-full bg-gold" aria-hidden="true" />}
              </Link>
            );
          })}
          <div className="mt-8 grid gap-3">
            <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "lg")}>
              <WhatsappIcon className="size-5" />
              Falar no WhatsApp
            </a>
            <a href={`tel:${settings.telefone.replace(/\s/g, "")}`} className={buttonClass("outline", "lg")}>
              <Phone className="size-5" />
              Ligar {settings.telefone}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
