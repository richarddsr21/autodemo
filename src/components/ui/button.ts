/** Classes de botão partilhadas (usáveis em <button> e <Link>). */

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";

const variants = {
  primary: "bg-gold text-on-gold hover:bg-gold-hover",
  outline: "border border-line text-text hover:border-gold hover:text-gold",
  outlineInk: "border border-line-ink text-ink hover:border-gold-ink hover:text-gold-ink",
  ghost: "text-text hover:text-gold",
  whatsapp: "bg-whatsapp text-[#0A0A0A] hover:brightness-110",
} as const;

const sizes = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-base",
} as const;

export function buttonClass(
  variant: keyof typeof variants = "primary",
  size: keyof typeof sizes = "md",
  extra = "",
): string {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim();
}
