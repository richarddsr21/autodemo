import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { TopBar } from "@/components/layout/top-bar";
import { WhatsappFab } from "@/components/layout/whatsapp-fab";
import { jsonLdScript } from "@/lib/seo";
import { autoDealerJsonLd } from "@/lib/seo-business";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(autoDealerJsonLd()) }} />
      <a
        href="#conteudo"
        className="sr-only z-[60] rounded-lg bg-gold px-4 py-2 font-semibold text-on-gold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar para o conteúdo
      </a>
      <TopBar />
      <Header />
      <main id="conteudo">{children}</main>
      <Footer />
      <WhatsappFab />
    </>
  );
}
