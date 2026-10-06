import type { Settings } from "@/lib/models";

/**
 * Configuração do negócio. Tudo o que muda de cliente para cliente está aqui
 * (ou nos dados). Os campos em `defaults` podem ser alterados pelo dono no
 * painel (Definições); o resto é fixo por instalação.
 */

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

const defaults: Settings = {
  nome: "AutoDemo",
  slogan: "Venda e aluguer de viaturas com confiança e atendimento de proximidade.",
  // Contactos FICTÍCIOS da demonstração: substituir pelos do cliente.
  telefone: "+351 900 000 000",
  whatsapp: "351900000000",
  email: "geral@example.com",
  /** Rua e número (opcional). */
  morada: "Rua do Exemplo, 1",
  codigoPostal: "1000-001",
  localidade: "Lisboa",
  horario: [
    { dias: "Segunda a sexta", horas: "09:00 – 19:00" },
    { dias: "Sábado", horas: "09:30 – 13:00" },
    { dias: "Domingo", horas: "Encerrado" },
  ],
  redes: {
    instagram: "https://www.instagram.com/",
    facebook: "",
  },
  heroTitulo: "O carro certo",
  heroDestaque: "para cada caminho",
  heroSubtitulo:
    "Viaturas selecionadas para comprar ou alugar, com garantia, financiamento e um atendimento que trata cada cliente como único.",
  sobreTitulo: "Um stand feito de confiança",
  sobreTexto:
    "No nosso stand escolhemos cada viatura como se fosse para nós. Verificamos o histórico, revemos a mecânica e só depois a colocamos à venda ou para aluguer. Acreditamos em preços claros, em respostas rápidas e em clientes que voltam.",
  simuladorTaxa: 8.9,
};

/**
 * URL público do site (SEO, sitemap, links partilhados). Na Vercel usa o domínio
 * de produção automaticamente; pode ser fixado com NEXT_PUBLIC_SITE_URL.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const siteConfig = {
  url: siteUrl.replace(/\/$/, ""),
  /** Logo genérico da demonstração; trocar pelo logo do cliente (ex.: "/logo.png"). */
  logo: "/logo.svg",
  locale: "pt_PT",
  /** Limite de viaturas do plano "Stand 20" (informativo no painel). */
  limiteViaturas: 20,
  demo: true,
  demoLogin: { email: "demo@example.com", password: "demo1234" },

  /** Paleta da marca. Injetada como variáveis CSS no layout. */
  cores: {
    bg: "#0A0A0A",
    surface: "#141414",
    surface2: "#1C1C1C",
    light: "#F7F5F0",
    lightSurface: "#FFFFFF",
    text: "#FAFAFA",
    ink: "#111111",
    muted: "#A1A1AA",
    mutedInk: "#57534E",
    gold: "#C9A24B",
    goldHover: "#E0B95C",
    /** Dourado escurecido para texto sobre fundo claro (contraste AA). */
    goldInk: "#86661C",
    onGold: "#0A0A0A",
  },

  imagens: {
    hero: unsplash("1580273916550-e323be2ae537"),
    bannerAluguer: unsplash("1449965408869-eaa3f722e40d"),
    sobre: unsplash("1485291571150-772bcfc10da5"),
  },

  vantagensTopo: [
    { icone: "whatsapp", texto: "Atendimento por WhatsApp" },
    { icone: "financiamento", texto: "Financiamento disponível" },
    { icone: "garantia", texto: "Garantia em todas as viaturas" },
  ],

  vantagens: [
    { icone: "revista", titulo: "Viaturas revistas", texto: "Inspecionadas e com histórico verificado." },
    { icone: "financiamento", titulo: "Financiamento", texto: "Soluções à medida, com resposta rápida." },
    { icone: "rapido", titulo: "Atendimento rápido", texto: "Respondemos no próprio dia, por WhatsApp." },
    { icone: "transparente", titulo: "Sem surpresas", texto: "Preços claros e sem custos escondidos." },
  ],

  vantagensAluguer: [
    { icone: "transparente", titulo: "Sem custos escondidos", texto: "O preço que vê é o que paga." },
    { icone: "seguro", titulo: "Seguro incluído", texto: "Circule tranquilo, sempre coberto." },
    { icone: "chave", titulo: "Levantamento rápido", texto: "Chave na mão em poucos minutos." },
    { icone: "calendario", titulo: "Reserva fácil", texto: "Peça por WhatsApp, sem complicações." },
  ],

  /** Números da página "Sobre". VALORES DE EXEMPLO: substituir pelos reais do stand. */
  numeros: [
    { valor: "+10", label: "anos de experiência" },
    { valor: "+800", label: "viaturas entregues" },
    { valor: "100%", label: "viaturas revistas" },
    { valor: "24 h", label: "tempo máximo de resposta" },
  ],

  valores: [
    { titulo: "Transparência", texto: "Histórico, quilómetros e estado de cada viatura explicados sem rodeios." },
    { titulo: "Confiança", texto: "Só vendemos o que compraríamos para nós. Todas as viaturas saem revistas e com garantia." },
    { titulo: "Proximidade", texto: "Atendimento pessoal, antes e depois da compra. Estamos a uma mensagem de distância." },
  ],

  /** Valores editáveis no painel (Definições). */
  defaults,
} as const;

export type SiteConfig = typeof siteConfig;
export type IconeVantagem =
  | (typeof siteConfig.vantagensTopo)[number]["icone"]
  | (typeof siteConfig.vantagens)[number]["icone"]
  | (typeof siteConfig.vantagensAluguer)[number]["icone"];
