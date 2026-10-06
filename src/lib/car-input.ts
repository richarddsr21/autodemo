import type { Car, CarInput } from "@/lib/models";

/** Dados editáveis de uma viatura (sem id, slug e data de criação). */
export function toCarInput(car: Car): CarInput {
  return {
    tipo: car.tipo,
    marca: car.marca,
    modelo: car.modelo,
    versao: car.versao,
    ano: car.ano,
    km: car.km,
    combustivel: car.combustivel,
    caixa: car.caixa,
    potenciaCv: car.potenciaCv,
    cor: car.cor,
    lugares: car.lugares,
    portas: car.portas,
    categoria: car.categoria,
    precoVenda: car.precoVenda,
    precoDia: car.precoDia,
    descricao: car.descricao,
    equipamento: [...car.equipamento],
    fotos: [...car.fotos],
    destaque: car.destaque,
    estado: car.estado,
  };
}
