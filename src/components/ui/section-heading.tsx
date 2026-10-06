import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  tone = "dark",
  action,
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  tone?: "dark" | "light";
  action?: ReactNode;
  id?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p
            className={`mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase ${tone === "light" ? "text-gold-ink" : "text-gold"}`}
          >
            <span className="h-px w-6 bg-current" aria-hidden="true" />
            {eyebrow}
          </p>
        )}
        <h2
          id={id}
          className={`text-3xl font-semibold sm:text-4xl ${tone === "light" ? "text-ink" : "text-text"}`}
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
