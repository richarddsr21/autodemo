import {
  BadgeCheck,
  CalendarCheck,
  HandCoins,
  KeyRound,
  ReceiptText,
  ShieldCheck,
  Wrench,
  Zap,
  type LucideProps,
} from "lucide-react";
import type { IconeVantagem } from "@/config/site";
import { WhatsappIcon } from "./brand-icons";

/** Mapeia os nomes de ícones usados em `site.ts` para componentes. */
export function FeatureIcon({ name, ...props }: { name: IconeVantagem } & LucideProps) {
  switch (name) {
    case "whatsapp":
      return <WhatsappIcon className={props.className} />;
    case "financiamento":
      return <HandCoins {...props} />;
    case "garantia":
      return <ShieldCheck {...props} />;
    case "revista":
      return <Wrench {...props} />;
    case "rapido":
      return <Zap {...props} />;
    case "transparente":
      return <ReceiptText {...props} />;
    case "seguro":
      return <BadgeCheck {...props} />;
    case "chave":
      return <KeyRound {...props} />;
    case "calendario":
      return <CalendarCheck {...props} />;
  }
}
