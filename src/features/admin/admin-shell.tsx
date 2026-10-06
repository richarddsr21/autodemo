"use client";

import { Car, ExternalLink, Inbox, LayoutDashboard, LogOut, Plus, Settings, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { siteConfig } from "@/config/site";
import { useSettings } from "@/features/definicoes/use-settings";
import { usePedidos } from "@/features/pedidos/use-pedidos";
import { logout, useAdminSession } from "./auth";
import { LoginScreen } from "./login-screen";

interface NavItem {
  href: string;
  label: string;
  /** Rótulo curto para a navegação inferior do telemóvel. */
  curto: string;
  Icon: LucideIcon;
  exact?: boolean;
}

const NAV: NavItem[] = [
  { href: "/admin", label: "Visão geral", curto: "Início", Icon: LayoutDashboard, exact: true },
  { href: "/admin/viaturas", label: "Viaturas", curto: "Viaturas", Icon: Car },
  { href: "/admin/pedidos", label: "Pedidos", curto: "Pedidos", Icon: Inbox },
  { href: "/admin/definicoes", label: "Definições", curto: "Definições", Icon: Settings },
];

const NAV_MOVEL: NavItem[] = [
  NAV[0],
  NAV[1],
  { href: "/admin/viaturas/nova", label: "Adicionar viatura", curto: "Adicionar", Icon: Plus, exact: true },
  NAV[2],
  NAV[3],
];

/** Número de pedidos por tratar (para a etiqueta no menu). */
function usePorTratar(): number {
  const { data } = usePedidos({ tratado: false });
  return data?.length ?? 0;
}

function ativo(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  return pathname.startsWith(item.href) && pathname !== "/admin/viaturas/nova";
}

export function AdminShell({ children }: { children: ReactNode }) {
  const sessao = useAdminSession();
  const pathname = usePathname();
  const { nome } = useSettings();
  const porTratar = usePorTratar();

  if (sessao === null) return <div className="min-h-dvh bg-bg" aria-busy="true" />;
  if (!sessao) return <LoginScreen />;

  return (
    <ToastProvider>
      <div className="min-h-dvh bg-light text-ink lg:grid lg:grid-cols-[260px_1fr]">
        {/* Barra lateral (desktop) */}
        <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-bg text-text lg:flex">
          <Link href="/admin" className="flex items-center gap-3 px-6 py-6">
            <Image src={siteConfig.logo} alt="" width={40} height={40} className="rounded-xl ring-1 ring-gold/30" />
            <span>
              <span className="block font-display text-lg font-semibold tracking-[0.14em] uppercase">{nome}</span>
              <span className="text-xs text-gold">Painel do stand</span>
            </span>
          </Link>
          <nav aria-label="Painel" className="flex-1 space-y-1 px-3">
            {NAV.map((item) => {
              const a = ativo(pathname, item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={a ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors ${a ? "bg-gold/15 text-gold" : "text-text/80 hover:bg-surface-2 hover:text-text"}`}
                >
                  <item.Icon className="size-5" aria-hidden="true" />
                  {item.label}
                  {item.href === "/admin/pedidos" && porTratar > 0 && (
                    <span className="ml-auto rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-on-gold" aria-label={`${porTratar} por tratar`}>
                      {porTratar}
                    </span>
                  )}
                </Link>
              );
            })}
            <Link
              href="/admin/viaturas/nova"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 font-semibold text-on-gold transition-colors hover:bg-gold-hover"
            >
              <Plus className="size-5" aria-hidden="true" />
              Adicionar viatura
            </Link>
          </nav>
          <div className="space-y-1 border-t border-line p-3">
            <a href="/" target="_blank" rel="noopener" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-text/80 hover:bg-surface-2 hover:text-text">
              <ExternalLink className="size-4.5" aria-hidden="true" />
              Ver o site
            </a>
            <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-text/80 hover:bg-surface-2 hover:text-text">
              <LogOut className="size-4.5" aria-hidden="true" />
              Sair
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col pb-20 lg:pb-0">
          <p className="bg-gold px-4 py-1.5 text-center text-xs font-semibold text-on-gold">
            Versão de demonstração · os dados ficam guardados apenas neste navegador
          </p>
          {/* Topo (telemóvel) */}
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-bg px-4 py-3 text-text lg:hidden">
            <Link href="/admin" className="flex items-center gap-2.5">
              <Image src={siteConfig.logo} alt="" width={34} height={34} className="rounded-lg" />
              <span className="font-display font-semibold tracking-[0.12em] uppercase">{nome}</span>
            </Link>
            <div className="flex items-center gap-1">
              <a href="/" target="_blank" rel="noopener" aria-label="Ver o site" className="flex size-10 items-center justify-center rounded-lg text-text/80 hover:text-gold">
                <ExternalLink className="size-5" />
              </a>
              <button type="button" onClick={logout} aria-label="Sair" className="flex size-10 items-center justify-center rounded-lg text-text/80 hover:text-gold">
                <LogOut className="size-5" />
              </button>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
        </div>

        {/* Navegação inferior (telemóvel) */}
        <nav aria-label="Painel" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-bg text-text lg:hidden">
          {NAV_MOVEL.map((item) => {
            const a = ativo(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={a ? "page" : undefined}
                className={`relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${a ? "text-gold" : "text-text/70"}`}
              >
                <item.Icon className="size-5" aria-hidden="true" />
                {item.curto}
                {item.href === "/admin/pedidos" && porTratar > 0 && (
                  <span className="absolute top-1.5 left-1/2 ml-1.5 flex min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-on-gold" aria-label={`${porTratar} por tratar`}>
                    {porTratar}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </ToastProvider>
  );
}
