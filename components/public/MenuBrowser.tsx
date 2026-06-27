"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { getCategoryIcon } from "@/lib/category-icons";
import type { CategoryWithItems } from "@/lib/supabase/types";
import { ProductCard } from "./ProductCard";
import { ZelligeBorder } from "./ZelligeBorder";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";

type MenuBrowserProps = {
  categories: CategoryWithItems[];
  locale: string;
};

export function MenuBrowser({ categories, locale }: MenuBrowserProps) {
  const t = useTranslations("menu");
  const reduced = usePrefersReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedCategory =
    categories.find((c) => c.id === selectedId) ?? null;

  const getCategoryName = (category: CategoryWithItems) =>
    locale === "nl" ? category.name_nl : category.name_en;

  return (
    <div className="relative">
      <div className="zellige-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden />

      <div className="relative">
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div
              key="picker"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="mx-auto max-w-3xl text-center"
            >
              <p className="text-xs font-semibold tracking-[0.25em] text-gold uppercase">
                {t("selectCategory")}
              </p>
              <p className="mt-3 text-base text-espresso-soft/80 sm:text-lg">
                {t("selectCategoryHint")}
              </p>

              <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {categories.map((category) => {
                  const Icon = getCategoryIcon(category.icon);
                  const name = getCategoryName(category);

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedId(category.id)}
                      className="card-elevated group flex min-h-[140px] flex-col items-center justify-center rounded-2xl border border-gold/20 bg-cream/90 px-5 py-6 text-center transition-all hover:border-terracotta/40 hover:shadow-card-hover sm:rounded-3xl sm:py-8"
                    >
                      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sand to-cream text-terracotta shadow-inner transition-transform duration-300 group-hover:scale-105 group-hover:bg-terracotta/10">
                        <Icon className="h-7 w-7" strokeWidth={1.75} />
                      </span>
                      <span className="font-heading text-xl font-bold text-deep-teal sm:text-2xl">
                        {name}
                      </span>
                      <span className="mt-2 text-sm text-espresso-soft/70">
                        {t("itemCount", { count: category.menu_items.length })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="items"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <div className="sticky top-[4.5rem] z-20 -mx-4 mb-8 border-b border-gold/15 bg-sand/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:mb-10 sm:px-6 md:top-20">
                <div
                  className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  role="tablist"
                  aria-label={t("selectCategory")}
                >
                  {categories.map((category) => {
                    const Icon = getCategoryIcon(category.icon);
                    const name = getCategoryName(category);
                    const isActive = category.id === selectedId;

                    return (
                      <button
                        key={category.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setSelectedId(category.id)}
                        className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all sm:px-5 sm:py-3 sm:text-base ${
                          isActive
                            ? "border-terracotta bg-terracotta text-white shadow-md shadow-terracotta/20"
                            : "border-gold/25 bg-cream/80 text-deep-teal hover:border-gold/50 hover:bg-cream"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                        <span>{name}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-sand text-espresso-soft/80"
                          }`}
                        >
                          {category.menu_items.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-8 sm:mb-10">
                <span className="text-xs font-semibold tracking-widest text-gold uppercase">
                  {t("itemCount", {
                    count: selectedCategory.menu_items.length,
                  })}
                </span>
                <h2 className="font-heading mt-2 text-3xl font-bold text-deep-teal sm:text-4xl md:text-5xl">
                  {getCategoryName(selectedCategory)}
                </h2>
                <ZelligeBorder className="mt-6 sm:mt-8" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory.id}
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {selectedCategory.menu_items.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-gold/30 bg-cream/60 px-6 py-16 text-center text-espresso-soft/60 sm:rounded-3xl">
                      {t("noItems")}
                    </p>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
                      {selectedCategory.menu_items.map((item, itemIndex) => (
                        <motion.div
                          key={item.id}
                          initial={reduced ? false : { opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: reduced ? 0 : itemIndex * 0.06,
                          }}
                        >
                          <ProductCard
                            item={item}
                            locale={locale}
                            featuredLabel={t("featuredBadge")}
                            formattedPrice={
                              item.price != null
                                ? t("price", {
                                    price: item.price.toFixed(2),
                                  })
                                : undefined
                            }
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
