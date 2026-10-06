import { siteConfig } from "@/config/site";

const DIAS: Record<string, string[]> = {
  "segunda a sexta": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "segunda a sábado": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  segunda: ["Monday"],
  terça: ["Tuesday"],
  quarta: ["Wednesday"],
  quinta: ["Thursday"],
  sexta: ["Friday"],
  sábado: ["Saturday"],
  domingo: ["Sunday"],
};

/** Converte "Segunda a sexta" / "09:00 – 19:00" em OpeningHoursSpecification (quando possível). */
function horarioSchema() {
  return siteConfig.defaults.horario.flatMap((h) => {
    const dias = DIAS[h.dias.trim().toLocaleLowerCase("pt-PT")];
    const horas = /(\d{1,2}:\d{2})\D+(\d{1,2}:\d{2})/.exec(h.horas);
    if (!dias || !horas) return [];
    return [{ "@type": "OpeningHoursSpecification", dayOfWeek: dias, opens: horas[1], closes: horas[2] }];
  });
}

/** JSON-LD AutoDealer (LocalBusiness) com os dados de site.ts. */
export function autoDealerJsonLd() {
  const d = siteConfig.defaults;
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": `${siteConfig.url}/#stand`,
    name: d.nome,
    description: d.slogan,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    image: siteConfig.imagens.hero,
    telephone: d.telefone.replace(/\s/g, ""),
    email: d.email,
    address: {
      "@type": "PostalAddress",
      ...(d.morada && { streetAddress: d.morada }),
      postalCode: d.codigoPostal,
      addressLocality: d.localidade,
      addressCountry: "PT",
    },
    openingHoursSpecification: horarioSchema(),
    sameAs: Object.values(d.redes).filter(Boolean),
  };
}
