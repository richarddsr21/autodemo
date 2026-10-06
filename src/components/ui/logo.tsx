import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Logo({ nome, className = "" }: { nome: string; className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-3 ${className}`}>
      <Image
        src={siteConfig.logo}
        alt=""
        width={44}
        height={44}
        className="size-11 rounded-xl ring-1 ring-gold/30 transition-transform duration-200 group-hover:scale-105"
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-semibold tracking-[0.14em] whitespace-nowrap text-text uppercase sm:tracking-[0.18em]">{nome}</span>
        <span className="mt-1 text-[10px] font-medium tracking-[0.16em] whitespace-nowrap text-gold uppercase sm:tracking-[0.28em]">
          Venda &amp; Aluguer
        </span>
        <span className="sr-only">, página inicial</span>
      </span>
    </Link>
  );
}
