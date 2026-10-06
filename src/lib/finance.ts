/**
 * Prestação mensal de um crédito com prestações constantes (método francês).
 * `taxaAnual` em percentagem (ex.: 8.9).
 */
export function prestacaoMensal(montante: number, meses: number, taxaAnual: number): number {
  if (montante <= 0 || meses <= 0) return 0;
  const r = taxaAnual / 100 / 12;
  if (r === 0) return montante / meses;
  return (montante * r) / (1 - (1 + r) ** -meses);
}
