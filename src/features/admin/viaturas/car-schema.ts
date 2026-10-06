import { z } from "zod";
import {
  CAIXAS,
  CATEGORIAS,
  COMBUSTIVEIS,
  ESTADOS_CARRO,
  TIPOS_CARRO,
  type Car,
  type CarInput,
  type Caixa,
  type Categoria,
  type Combustivel,
  type EstadoCarro,
  type TipoCarro,
} from "@/lib/models";

export const MAX_FOTOS = 12;

/** Valores do formulário: números ficam como texto até à validação. */
export interface CarFormValues {
  tipo: TipoCarro;
  marca: string;
  modelo: string;
  versao: string;
  ano: string;
  km: string;
  combustivel: Combustivel;
  caixa: Caixa;
  potenciaCv: string;
  cor: string;
  lugares: string;
  portas: string;
  categoria: Categoria;
  precoVenda: string;
  precoDia: string;
  descricao: string;
  equipamento: string[];
  fotos: string[];
  destaque: boolean;
  estado: EstadoCarro;
}

/** Estados possíveis para cada tipo de viatura. */
export const ESTADOS_POR_TIPO: Record<TipoCarro, EstadoCarro[]> = {
  venda: ["disponivel", "vendido", "escondido"],
  aluguer: ["disponivel", "alugado", "escondido"],
};

const anoMax = new Date().getFullYear() + 1;

const inteiro = (vazio: string, invalido: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(1, vazio)
    .transform((v) => Number(v.replace(/\s/g, "").replace(",", ".")))
    .pipe(z.number({ error: invalido }).int(invalido).min(min, invalido).max(max, invalido));

const inteiroOpcional = (invalido: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .transform((v) => (v === "" ? undefined : Number(v.replace(/\s/g, "").replace(",", "."))))
    .pipe(z.number({ error: invalido }).int(invalido).min(min, invalido).max(max, invalido).optional());

export const carSchema = z
  .object({
    tipo: z.enum(TIPOS_CARRO),
    marca: z.string().trim().min(1, "Indique a marca.").max(40, "Marca demasiado longa."),
    modelo: z.string().trim().min(1, "Indique o modelo.").max(60, "Modelo demasiado longo."),
    versao: z.string().trim().max(80, "Versão demasiado longa."),
    ano: inteiro("Indique o ano.", `Ano inválido (entre 1950 e ${anoMax}).`, 1950, anoMax),
    km: inteiro("Indique os quilómetros.", "Quilómetros inválidos.", 0, 2_000_000),
    combustivel: z.enum(COMBUSTIVEIS),
    caixa: z.enum(CAIXAS),
    potenciaCv: inteiroOpcional("Potência inválida.", 1, 2000),
    cor: z.string().trim().min(1, "Indique a cor.").max(40, "Cor demasiado longa."),
    lugares: inteiro("Indique os lugares.", "Número de lugares inválido.", 1, 9),
    portas: inteiro("Indique as portas.", "Número de portas inválido.", 2, 5),
    categoria: z.enum(CATEGORIAS),
    precoVenda: inteiroOpcional("Preço inválido.", 1, 5_000_000),
    precoDia: inteiroOpcional("Preço por dia inválido.", 1, 10_000),
    descricao: z.string().trim().max(2000, "Descrição demasiado longa (máx. 2000 caracteres)."),
    equipamento: z.array(z.string().trim().min(1)).max(40, "Máximo de 40 itens de equipamento."),
    fotos: z
      .array(z.string())
      .min(1, "Adicione pelo menos uma fotografia.")
      .max(MAX_FOTOS, `Máximo de ${MAX_FOTOS} fotografias.`),
    destaque: z.boolean(),
    estado: z.enum(ESTADOS_CARRO),
  })
  .superRefine((v, ctx) => {
    if (v.tipo === "venda" && v.precoVenda === undefined) {
      ctx.addIssue({ code: "custom", path: ["precoVenda"], message: "Indique o preço de venda." });
    }
    if (v.tipo === "aluguer" && v.precoDia === undefined) {
      ctx.addIssue({ code: "custom", path: ["precoDia"], message: "Indique o preço por dia." });
    }
    if (!ESTADOS_POR_TIPO[v.tipo].includes(v.estado)) {
      ctx.addIssue({ code: "custom", path: ["estado"], message: "Estado inválido para este tipo de viatura." });
    }
  })
  .transform(
    (v): CarInput => ({
      ...v,
      versao: v.versao || undefined,
      precoVenda: v.tipo === "venda" ? v.precoVenda : undefined,
      precoDia: v.tipo === "aluguer" ? v.precoDia : undefined,
    }),
  );

export const EMPTY_FORM: CarFormValues = {
  tipo: "venda",
  marca: "",
  modelo: "",
  versao: "",
  ano: "",
  km: "",
  combustivel: "diesel",
  caixa: "manual",
  potenciaCv: "",
  cor: "",
  lugares: "5",
  portas: "5",
  categoria: "familiar",
  precoVenda: "",
  precoDia: "",
  descricao: "",
  equipamento: [],
  fotos: [],
  destaque: false,
  estado: "disponivel",
};

const txt = (n: number | undefined) => (n === undefined ? "" : String(n));

export function toFormValues(car: Car): CarFormValues {
  return {
    tipo: car.tipo,
    marca: car.marca,
    modelo: car.modelo,
    versao: car.versao ?? "",
    ano: txt(car.ano),
    km: txt(car.km),
    combustivel: car.combustivel,
    caixa: car.caixa,
    potenciaCv: txt(car.potenciaCv),
    cor: car.cor,
    lugares: txt(car.lugares),
    portas: txt(car.portas),
    categoria: car.categoria,
    precoVenda: txt(car.precoVenda),
    precoDia: txt(car.precoDia),
    descricao: car.descricao,
    equipamento: [...car.equipamento],
    fotos: [...car.fotos],
    destaque: car.destaque,
    estado: car.estado,
  };
}
