import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { sampleCars } from "@/data/seed";

/*
 * Na demonstração as viaturas vivem no navegador, por isso o sitemap inclui
 * as páginas fixas e as viaturas de exemplo. Com Supabase passa a listar as
 * viaturas reais da base de dados.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const paginas = [
    { path: "", priority: 1 },
    { path: "/comprar", priority: 0.9 },
    { path: "/alugar", priority: 0.9 },
    { path: "/sobre", priority: 0.5 },
    { path: "/contactos", priority: 0.6 },
  ].map(({ path, priority }) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly" as const,
    priority,
  }));

  const viaturas = sampleCars()
    .filter((c) => c.estado !== "escondido")
    .map((c) => ({
      url: `${base}/carro/${c.slug}`,
      lastModified: new Date(c.criadoEm),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      images: c.fotos.filter((f) => f.startsWith("http")).slice(0, 1),
    }));

  return [...paginas, ...viaturas];
}
