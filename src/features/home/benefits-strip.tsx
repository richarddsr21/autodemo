import { container } from "@/components/ui/container";
import { FeatureIcon } from "@/components/ui/feature-icon";
import { siteConfig } from "@/config/site";

export function BenefitsStrip() {
  return (
    <section aria-label="As nossas vantagens" className={`${container} py-12 sm:py-14`}>
      <ul className="reveal grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4 lg:gap-0">
        {siteConfig.vantagens.map((v, i) => (
          <li
            key={v.titulo}
            className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4 lg:px-6 ${i > 0 ? "lg:border-l lg:border-line-ink" : "lg:pl-0"}`}
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-white text-gold-ink">
              <FeatureIcon name={v.icone} className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink sm:text-base">{v.titulo}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-ink sm:text-sm">{v.texto}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
