/** Data de hoje (fuso local) em formato AAAA-MM-DD. */
export function hojeISO(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export function isISODate(v: string | null | undefined): v is string {
  return !!v && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
}

/** Número de dias entre duas datas AAAA-MM-DD (0 se inválidas ou invertidas). */
export function diasEntre(inicio: string, fim: string): number {
  if (!isISODate(inicio) || !isISODate(fim)) return 0;
  const dias = Math.round((Date.parse(fim) - Date.parse(inicio)) / 86_400_000);
  return Math.max(0, dias);
}
