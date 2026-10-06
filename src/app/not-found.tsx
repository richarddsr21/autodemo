import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Página não encontrada" };

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-bg px-4 py-16 text-center">
      <Image src={siteConfig.logo} alt="" width={64} height={64} className="rounded-2xl ring-1 ring-gold/30" />
      <p className="mt-8 font-display text-sm font-semibold tracking-[0.25em] text-gold uppercase">Erro 404</p>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Esta página não existe</h1>
      <p className="mt-4 max-w-md text-muted">O endereço pode estar errado ou a página foi removida. Veja as nossas viaturas ou volte ao início.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonClass("primary", "lg")}>
          Voltar ao início
        </Link>
        <Link href="/comprar" className={buttonClass("outline", "lg")}>
          Ver viaturas
        </Link>
      </div>
    </main>
  );
}
