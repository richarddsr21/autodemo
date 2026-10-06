export function slugify(texto: string): string {
  return texto
    .toLocaleLowerCase("pt-PT")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function carSlugBase(car: { marca: string; modelo: string; versao?: string; ano: number }): string {
  return slugify([car.marca, car.modelo, car.versao, String(car.ano)].filter(Boolean).join(" "));
}

/** Garante um slug único acrescentando -2, -3, ... se necessário. */
export function uniqueSlug(base: string, existentes: Iterable<string>): string {
  const usados = new Set(existentes);
  if (!usados.has(base)) return base;
  let n = 2;
  while (usados.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

export function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
