"use client";

import { usePathname } from "next/navigation";
import { WhatsappIcon } from "@/components/ui/brand-icons";
import { useSettings } from "@/features/definicoes/use-settings";
import { mensagens, whatsappLink } from "@/lib/whatsapp";

export function WhatsappFab() {
  const settings = useSettings();
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  // Na página da viatura há uma barra própria com o WhatsApp (no telemóvel).
  const naViatura = pathname.startsWith("/carro/");

  return (
    <a
      href={whatsappLink(settings.whatsapp, mensagens.geral(settings.nome))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar connosco no WhatsApp"
      className={`group fixed right-4 bottom-4 z-50 ${naViatura ? "hidden lg:flex" : "flex"} size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_10px_30px_-8px_rgb(37_211_102/0.6)] transition-transform duration-200 hover:scale-105 sm:right-6 sm:bottom-6`}
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-whatsapp opacity-20 [animation-duration:2.5s]" aria-hidden="true" />
      <WhatsappIcon className="relative size-7" />
    </a>
  );
}
