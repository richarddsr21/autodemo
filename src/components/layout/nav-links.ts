export const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/comprar", label: "Comprar" },
  { href: "/alugar", label: "Alugar" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contactos", label: "Contactos" },
] as const;

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
