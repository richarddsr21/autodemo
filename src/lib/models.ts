// Modelos de domínio partilhados por todo o site (público e painel).

export const TIPOS_CARRO = ["venda", "aluguer"] as const;
export type TipoCarro = (typeof TIPOS_CARRO)[number];

export const COMBUSTIVEIS = ["gasolina", "diesel", "híbrido", "elétrico"] as const;
export type Combustivel = (typeof COMBUSTIVEIS)[number];

export const CAIXAS = ["manual", "automática"] as const;
export type Caixa = (typeof CAIXAS)[number];

export const CATEGORIAS = ["citadino", "familiar", "SUV", "desportivo", "utilitário", "premium"] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export const ESTADOS_CARRO = ["disponivel", "vendido", "alugado", "escondido"] as const;
export type EstadoCarro = (typeof ESTADOS_CARRO)[number];

export interface Car {
  id: string;
  slug: string;
  tipo: TipoCarro;
  marca: string;
  modelo: string;
  versao?: string;
  ano: number;
  km: number;
  combustivel: Combustivel;
  caixa: Caixa;
  potenciaCv?: number;
  cor: string;
  lugares: number;
  portas: number;
  categoria: Categoria;
  /** Preço de venda em euros. */
  precoVenda?: number;
  /** Preço por dia de aluguer em euros. */
  precoDia?: number;
  descricao: string;
  equipamento: string[];
  /** URLs das fotos; a primeira é a capa. */
  fotos: string[];
  destaque: boolean;
  estado: EstadoCarro;
  /** Data ISO 8601. */
  criadoEm: string;
}

export type CarInput = Omit<Car, "id" | "slug" | "criadoEm">;

export const ORDENACOES = ["recentes", "preco-asc", "preco-desc", "ano-desc", "km-asc"] as const;
export type Ordenacao = (typeof ORDENACOES)[number];

export interface CarFilter {
  tipo?: TipoCarro;
  marca?: string;
  categoria?: Categoria;
  combustivel?: Combustivel;
  caixa?: Caixa;
  precoMin?: number;
  precoMax?: number;
  anoMin?: number;
  kmMax?: number;
  lugaresMin?: number;
  destaque?: boolean;
  /** Estados a incluir. Por omissão: tudo exceto "escondido". */
  estados?: EstadoCarro[];
  /** Pesquisa livre por marca/modelo/versão. */
  texto?: string;
  ordenar?: Ordenacao;
  limite?: number;
}

export const TIPOS_PEDIDO = ["reserva", "contacto", "venda-o-meu-carro"] as const;
export type TipoPedido = (typeof TIPOS_PEDIDO)[number];

export interface Pedido {
  id: string;
  tipo: TipoPedido;
  nome: string;
  telefone: string;
  carroId?: string;
  /** Data ISO (AAAA-MM-DD). */
  levantamento?: string;
  /** Data ISO (AAAA-MM-DD). */
  devolucao?: string;
  mensagem?: string;
  criadoEm: string;
  tratado: boolean;
}

export type PedidoInput = Omit<Pedido, "id" | "criadoEm" | "tratado">;

export interface PedidoFilter {
  tipo?: TipoPedido;
  tratado?: boolean;
}

export interface HorarioLinha {
  dias: string;
  horas: string;
}

/** Definições editáveis pelo dono no painel. Os valores por omissão vivem em `src/config/site.ts`. */
export interface Settings {
  nome: string;
  slogan: string;
  /** Número para mostrar, ex.: "+351 900 000 000". */
  telefone: string;
  /** Número para o wa.me, só dígitos com indicativo, ex.: "351900000000". */
  whatsapp: string;
  email: string;
  /** Rua e número; pode ficar vazio. */
  morada: string;
  codigoPostal: string;
  localidade: string;
  horario: HorarioLinha[];
  redes: { instagram: string; facebook: string };
  heroTitulo: string;
  heroDestaque: string;
  heroSubtitulo: string;
  sobreTitulo: string;
  sobreTexto: string;
  /** Taxa anual nominal de exemplo do simulador de prestação (%). */
  simuladorTaxa: number;
}

export const CATEGORIA_LABEL: Record<Categoria, string> = {
  citadino: "Citadino",
  familiar: "Familiar",
  SUV: "SUV",
  desportivo: "Desportivo",
  utilitário: "Utilitário",
  premium: "Premium",
};

export const COMBUSTIVEL_LABEL: Record<Combustivel, string> = {
  gasolina: "Gasolina",
  diesel: "Diesel",
  híbrido: "Híbrido",
  elétrico: "Elétrico",
};

export const CAIXA_LABEL: Record<Caixa, string> = {
  manual: "Manual",
  automática: "Automática",
};

export const ESTADO_LABEL: Record<EstadoCarro, string> = {
  disponivel: "Disponível",
  vendido: "Vendido",
  alugado: "Alugado",
  escondido: "Escondido",
};
