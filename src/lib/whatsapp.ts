import type { Car } from "@/lib/models";
import { formatData, formatEuro, nomeCompleto } from "@/lib/format";

export function whatsappLink(numero: string, mensagem?: string): string {
  const digitos = numero.replace(/\D/g, "");
  return mensagem ? `https://wa.me/${digitos}?text=${encodeURIComponent(mensagem)}` : `https://wa.me/${digitos}`;
}

/** Número de um cliente para wa.me: números nacionais de 9 dígitos ganham o indicativo 351. */
export function telefoneParaWhatsapp(telefone: string): string {
  const digitos = telefone.replace(/\D/g, "").replace(/^00/, "");
  return digitos.length === 9 ? `351${digitos}` : digitos;
}

/**
 * Abre o WhatsApp num novo separador; se o navegador bloquear a janela,
 * navega na própria página (no telemóvel abre a app diretamente).
 */
export function openWhatsapp(url: string): void {
  const janela = window.open(url, "_blank", "noopener,noreferrer");
  if (!janela) window.location.href = url;
}

export const mensagens = {
  geral: (nomeStand: string) => `Olá ${nomeStand}! Gostaria de mais informações.`,

  sobreCarro: (car: Car, url: string) => {
    const preco =
      car.tipo === "venda" && car.precoVenda
        ? ` (${formatEuro(car.precoVenda)})`
        : car.precoDia
          ? ` (${formatEuro(car.precoDia)}/dia)`
          : "";
    const intencao = car.tipo === "venda" ? "Tenho interesse no" : "Gostaria de alugar o";
    return `Olá! ${intencao} ${nomeCompleto(car)} de ${car.ano}${preco}.\n${url}`;
  },

  reserva: (p: {
    nome: string;
    car: Car;
    levantamento: string;
    devolucao: string;
    total?: number;
    mensagem?: string;
    url?: string;
  }) =>
    [
      `Olá! Sou ${p.nome} e gostaria de reservar o ${nomeCompleto(p.car)}.`,
      `Levantamento: ${formatData(p.levantamento)}`,
      `Devolução: ${formatData(p.devolucao)}`,
      p.total ? `Total estimado: ${formatEuro(p.total)}` : "",
      p.mensagem ? `\n${p.mensagem}` : "",
      p.url ? `\n${p.url}` : "",
    ]
      .filter(Boolean)
      .join("\n"),

  vender: (p: { nome: string; telefone: string }) =>
    `Olá! Sou ${p.nome} (${p.telefone}) e gostaria de vender o meu carro. Podem fazer-me uma avaliação?`,

  contacto: (p: { nome: string; mensagem?: string }) =>
    `Olá! Sou ${p.nome}.${p.mensagem ? ` ${p.mensagem}` : " Gostaria de mais informações."}`,
};
