import type { FieldErrors, FieldValues, Resolver } from "react-hook-form";
import * as z from "zod/mini";

/*
 * Os formulários do site público usam "zod/mini" (muito mais leve, carrega
 * rápido no telemóvel). O painel usa o zod completo; este resolver aceita os dois.
 */

/** Resolver mínimo de zod para react-hook-form (evita dependência extra). */
export function zodResolver<In extends FieldValues, Out extends FieldValues = In>(
  schema: z.core.$ZodType<Out, In>,
): Resolver<In, unknown, Out> {
  return async (values) => {
    const result = z.safeParse(schema, values);
    if (result.success) return { values: result.data, errors: {} };

    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      if (!errors[path]) errors[path] = { type: issue.code, message: issue.message };
    }
    return { values: {}, errors: errors as FieldErrors<In> };
  };
}

/** Telemóvel/telefone: 9 a 15 dígitos, aceita espaços e indicativo +351. */
export const telefoneSchema = z.string().check(
  z.trim(),
  z.minLength(1, "Indique o seu telemóvel."),
  z.refine((v) => {
    const digitos = v.replace(/\D/g, "");
    return digitos.length >= 9 && digitos.length <= 15;
  }, "Número de telemóvel inválido."),
);

export const nomeSchema = z
  .string()
  .check(z.trim(), z.minLength(2, "Indique o seu nome."), z.maxLength(80, "Nome demasiado longo."));
