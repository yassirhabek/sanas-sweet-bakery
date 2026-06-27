import Image from "next/image";
import type { MenuItem } from "@/lib/supabase/types";
import { HoverLift } from "@/components/motion/HoverLift";

type ProductCardProps = {
  item: MenuItem;
  locale: string;
  formattedPrice?: string;
  featuredLabel?: string;
};

export function ProductCard({
  item,
  locale,
  formattedPrice,
  featuredLabel,
}: ProductCardProps) {
  const name = locale === "nl" ? item.name_nl : item.name_en;
  const description =
    locale === "nl" ? item.description_nl : item.description_en;
  const hasImage = Boolean(item.image_url);

  return (
    <HoverLift className="group h-full">
      <article className="card-elevated flex h-full flex-col overflow-hidden rounded-2xl border border-gold/15 bg-cream group-hover:border-gold/40">
        {hasImage ? (
          <div className="relative aspect-[5/4] overflow-hidden">
            <Image
              src={item.image_url!}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/50 via-transparent to-transparent opacity-60" />
            {item.is_featured && featuredLabel && (
              <span className="absolute top-2.5 left-2.5 max-w-[calc(100%-1rem)] truncate rounded-full bg-gold px-2.5 py-1 text-[9px] font-bold tracking-wider text-espresso uppercase sm:top-3 sm:left-3 sm:px-3 sm:text-[10px]">
                ★ {featuredLabel}
              </span>
            )}
            {formattedPrice && (
              <span className="absolute right-2.5 bottom-2.5 rounded-full bg-cream/95 px-3 py-1 text-xs font-bold text-terracotta shadow-md backdrop-blur-sm sm:right-3 sm:bottom-3 sm:px-3.5 sm:py-1.5 sm:text-sm">
                {formattedPrice}
              </span>
            )}
          </div>
        ) : null}
        <div className="flex flex-1 flex-col p-4 sm:p-5 md:p-6">
          {!hasImage && (item.is_featured || formattedPrice) && (
            <div className="mb-3 flex items-start justify-between gap-3">
              {item.is_featured && featuredLabel ? (
                <span className="rounded-full bg-gold px-2.5 py-1 text-[9px] font-bold tracking-wider text-espresso uppercase sm:px-3 sm:text-[10px]">
                  ★ {featuredLabel}
                </span>
              ) : (
                <span />
              )}
              {formattedPrice && (
                <span className="shrink-0 rounded-full bg-sand px-3 py-1 text-xs font-bold text-terracotta sm:text-sm">
                  {formattedPrice}
                </span>
              )}
            </div>
          )}
          <h3 className="font-heading text-lg font-semibold text-espresso sm:text-xl md:text-2xl">
            {name}
          </h3>
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-espresso-soft/80">
            {description}
          </p>
        </div>
      </article>
    </HoverLift>
  );
}
