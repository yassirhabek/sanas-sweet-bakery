import { BRAND_NAME } from "@/lib/brand";
import { ZelligeBorder } from "./ZelligeBorder";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "center" | "left";
};

export function SectionHeading({
  title,
  subtitle,
  className = "",
  align = "center",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`${alignClass} ${className}`}>
      <div
        className={`mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3 ${align === "center" ? "justify-center" : ""}`}
      >
        <span
          className="hidden h-px w-8 bg-gradient-to-r from-transparent to-gold/50 sm:block sm:w-10"
          aria-hidden
        />
        <span className="text-[10px] font-semibold tracking-[0.2em] text-gold uppercase sm:text-xs sm:tracking-[0.25em]">
          {BRAND_NAME}
        </span>
        <span
          className="hidden h-px w-8 bg-gradient-to-l from-transparent to-gold/50 sm:block sm:w-10"
          aria-hidden
        />
      </div>
      <h2 className="font-heading text-3xl font-bold text-espresso sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 max-w-2xl text-base text-espresso-soft/75 text-balance sm:mt-4 sm:text-lg ${align === "center" ? "md:mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      )}
      <ZelligeBorder
        className={`mt-6 sm:mt-8 ${align === "center" ? "mx-auto max-w-xs" : "max-w-xs"}`}
      />
    </div>
  );
}
