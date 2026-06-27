import { BRAND_NAME } from "@/lib/brand";
import { ZelligePattern } from "./ZelligeBorder";

type PageBannerProps = {
  title: string;
  subtitle?: string;
};

export function PageBanner({ title, subtitle }: PageBannerProps) {
  return (
    <section className="relative overflow-hidden border-b border-gold/15 bg-espresso py-12 sm:py-20 md:py-24">
      <ZelligePattern className="absolute inset-0 opacity-30" />
      <div className="absolute inset-0 gradient-warm opacity-40" aria-hidden />
      <div className="page-container relative text-center">
        <div className="mb-3 flex items-center justify-center gap-2 sm:mb-4 sm:gap-3">
          <span className="h-px w-8 bg-gold/40 sm:w-16" aria-hidden />
          <span className="text-gold-light text-[10px] tracking-[0.2em] uppercase sm:text-sm sm:tracking-[0.3em]">
            {BRAND_NAME}
          </span>
          <span className="h-px w-8 bg-gold/40 sm:w-16" aria-hidden />
        </div>
        <h1 className="font-heading text-3xl font-bold text-cream sm:text-4xl md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-xl px-2 text-base text-cream/75 text-balance sm:mt-4 sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
