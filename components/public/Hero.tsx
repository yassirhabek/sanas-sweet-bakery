"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";
import { ButtonLink } from "./Button";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  const t = useTranslations("home");
  const tBrand = useTranslations("brand");
  const reduced = usePrefersReducedMotion();

  return (
    <section className="relative flex min-h-[100svh] items-start overflow-hidden bg-gradient-to-b from-cream via-sand to-sand">
      {/* Ambient background mesh */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 85% 40%, rgba(196, 92, 62, 0.18) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 15% 80%, rgba(27, 94, 94, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 50% 0%, rgba(201, 162, 39, 0.14) 0%, transparent 45%)
          `,
        }}
        aria-hidden
      />
      <div className="zellige-bg absolute inset-0 opacity-50" aria-hidden />

      <div className="page-container relative flex w-full flex-col gap-12 pt-4 pb-8 sm:gap-14 sm:pt-6 sm:pb-10 md:flex-row md:items-center md:gap-12 md:pt-8 md:pb-12 lg:gap-20 lg:pt-10 lg:pb-14">
        {/* Copy */}
        <div className="relative z-10 md:max-w-xl md:flex-1 lg:max-w-2xl">
          <motion.span
            className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-gold/40 bg-cream/80 px-3 py-1.5 text-[10px] font-semibold tracking-widest text-deep-teal uppercase shadow-sm backdrop-blur-sm sm:mb-6 sm:px-4 sm:text-xs"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-gold">✦</span>
            <span className="truncate">{t("heroBadge")}</span>
          </motion.span>

          <motion.h1
            className="font-heading text-[2.75rem] leading-[1.06] font-bold text-espresso sm:text-5xl md:text-[3.5rem] lg:text-6xl xl:text-[4.5rem]"
            initial={reduced ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t("heroTitle")}
          </motion.h1>

          <motion.p
            className="mt-5 max-w-lg text-base leading-relaxed text-espresso-soft/90 sm:mt-6 sm:text-lg md:text-xl"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t("heroSubtitle")}
          </motion.p>

          <motion.p
            className="mt-3 max-w-lg text-sm leading-relaxed text-espresso-soft/65 italic sm:mt-4"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
          >
            {tBrand("heroNote")}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <ButtonLink href="/menu">{t("ctaMenu")}</ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              {t("ctaContact")}
            </ButtonLink>
          </motion.div>
        </div>

        {/* Animated bakery illustration */}
        <motion.div
          className="relative z-10 w-full md:flex-1"
          initial={reduced ? false : { opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}
