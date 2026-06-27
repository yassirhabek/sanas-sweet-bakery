import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Hero } from "@/components/public/Hero";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ProductCard } from "@/components/public/ProductCard";
import { ButtonLink } from "@/components/public/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import {
  StaggerChildren,
  StaggerItem,
} from "@/components/motion/StaggerChildren";
import { Clock, Flame, MapPin } from "lucide-react";
import {
  getFeaturedItems,
  getWeeklyHours,
  getAllSpecialHours,
  getEffectiveHours,
  formatHoursDisplay,
} from "@/lib/hours";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("title"), description: t("description") };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");
  const tMenu = await getTranslations("menu");

  const [featured, weekly, special] = await Promise.all([
    getFeaturedItems(),
    getWeeklyHours(),
    getAllSpecialHours(),
  ]);

  const todayHours = formatHoursDisplay(
    getEffectiveHours(new Date(), weekly, special),
    locale,
    tCommon("closed"),
  );

  const highlights = [
    { icon: Flame, title: t("highlight1Title"), text: t("highlight1Text") },
    { icon: Clock, title: t("highlight2Title"), text: t("highlight2Text") },
    { icon: MapPin, title: t("highlight3Title"), text: t("highlight3Text") },
  ];

  return (
    <>
      <Hero />

      <section className="page-container relative z-10 -mt-4 sm:-mt-8">
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {highlights.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <div className="glass-panel card-elevated flex items-center gap-4 rounded-2xl p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">
                  <item.icon size={22} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="font-heading font-semibold text-deep-teal">
                    {item.title}
                  </p>
                  <p className="text-sm text-espresso-soft/70">{item.text}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="page-container py-12 sm:py-20 md:py-28">
        <SectionHeading
          title={t("featuredTitle")}
          subtitle={t("featuredSubtitle")}
        />
        <StaggerChildren className="mt-10 grid gap-6 sm:mt-14 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {featured.map((item) => (
            <StaggerItem key={item.id}>
              <ProductCard
                item={item}
                locale={locale}
                featuredLabel={tMenu("featuredBadge")}
                formattedPrice={
                  item.price != null
                    ? tMenu("price", { price: item.price.toFixed(2) })
                    : undefined
                }
              />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      <section className="gradient-warm border-y border-gold/10 py-12 sm:py-20 md:py-24">
        <div className="page-container">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
            <FadeIn direction="left">
              <div className="card-elevated overflow-hidden rounded-2xl border border-gold/20 bg-cream p-6 sm:rounded-3xl sm:p-8 md:p-10">
                <p className="text-xs font-semibold tracking-widest text-gold uppercase">
                  {t("hoursTitle")}
                </p>
                <p className="font-heading mt-2 text-2xl font-bold text-terracotta sm:mt-3 sm:text-4xl md:text-5xl">
                  {todayHours}
                </p>
                <p className="mt-3 text-sm text-espresso-soft/75 sm:mt-4 sm:text-base">
                  {t("visitText")}
                </p>
                <div className="mt-6 sm:mt-8">
                  <ButtonLink
                    href="/contact"
                    variant="ghost"
                    className="!px-0 sm:!w-auto"
                  >
                    {t("contactLink")}
                  </ButtonLink>
                </div>
              </div>
            </FadeIn>
            <FadeIn direction="right">
              <div className="relative aspect-[4/3] min-h-[200px] overflow-hidden rounded-2xl shadow-elevated sm:rounded-3xl">
                <Image
                  src="/images/croissants.png"
                  alt={t("hoursImageAlt")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 to-transparent" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="page-container py-12 text-center sm:py-20 md:py-28">
        <FadeIn>
          <h2 className="font-heading text-2xl font-bold text-espresso sm:text-3xl md:text-4xl">
            {t("visitTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl px-2 text-base text-espresso-soft/75 text-balance sm:mt-4 sm:text-lg">
            {t("visitText")}
          </p>
          <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <ButtonLink href="/about">{t("aboutLink")}</ButtonLink>
            <ButtonLink href="/menu" variant="ghost">
              {t("ctaMenu")}
            </ButtonLink>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
