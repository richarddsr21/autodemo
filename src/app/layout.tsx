import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { siteConfig } from "@/config/site";
import { RepositoryProvider } from "@/lib/repository/provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", weight: ["500", "600", "700"], display: "swap" });

const { nome, slogan } = siteConfig.defaults;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${nome} | Venda e aluguer de automóveis`,
    template: `%s | ${nome}`,
  },
  description: slogan,
  applicationName: nome,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: nome,
    title: `${nome} | Venda e aluguer de automóveis`,
    description: slogan,
    images: [{ url: siteConfig.imagens.hero, width: 1600, height: 1067, alt: "Viatura em destaque" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: siteConfig.cores.bg,
  colorScheme: "dark",
};

/** Converte a paleta de site.ts em variáveis CSS (--bg, --surface-2, ...). */
function themeCss(): string {
  const vars = Object.entries(siteConfig.cores)
    .map(([k, v]) => `--${k.replace(/[A-Z0-9]/g, (m) => `-${m.toLowerCase()}`)}:${v};`)
    .join("");
  return `:root{${vars}}`;
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-PT" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <style>{themeCss()}</style>
      </head>
      <body className="min-h-dvh bg-bg text-text">
        <RepositoryProvider>{children}</RepositoryProvider>
      </body>
    </html>
  );
}
