import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { PageBanner } from "@/components/public/PageBanner";
import { FadeIn } from "@/components/motion/FadeIn";
import { Flame, Heart, Sparkles } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title") };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");

  const values = [
    { icon: Sparkles, title: t("value1Title"), text: t("value1Text") },
    { icon: Flame, title: t("value2Title"), text: t("value2Text") },
    { icon: Heart, title: t("value3Title"), text: t("value3Text") },
  ];

  return (
    <>
      <PageBanner title={t("title")} subtitle={t("subtitle")} />

      <div className="page-container py-10 sm:py-16 md:py-24">
        <div className="space-y-16 sm:space-y-24">
          <FadeIn direction="left">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4 text-base leading-relaxed text-espresso-soft/85 sm:space-y-5 sm:text-lg">
                <p>{t("p1")}</p>
                <p>{t("p2")}</p>
              </div>
              <div className="relative aspect-[4/3] min-h-[220px] overflow-hidden rounded-2xl shadow-elevated sm:rounded-3xl">
                <Image
                  src="/images/bakery-oven.png"
                  alt={t("imageAlt")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 rounded-3xl ring-1 ring-gold/20 ring-inset" />
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <blockquote className="relative mx-auto max-w-3xl text-center">
              <span
                className="font-heading absolute -top-6 left-1/2 -translate-x-1/2 text-6xl text-gold/30"
                aria-hidden
              >
                &ldquo;
              </span>
              <p className="font-heading px-2 text-xl leading-relaxed font-medium text-espresso sm:text-2xl md:text-3xl">
                {t("p3")}
              </p>
            </blockquote>
          </FadeIn>

          <div>
            <FadeIn>
              <h2 className="font-heading mb-8 text-center text-2xl font-bold text-deep-teal sm:mb-12 sm:text-3xl md:text-4xl">
                {t("valuesTitle")}
              </h2>
            </FadeIn>
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3">
              {values.map((v, i) => (
                <FadeIn key={v.title} delay={i * 0.1}>
                  <div className="card-elevated group h-full rounded-2xl border border-gold/15 bg-cream p-6 text-center transition-colors hover:border-gold/35 sm:p-8">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-terracotta/15 to-gold/20 text-terracotta transition-transform group-hover:scale-105">
                      <v.icon size={26} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-deep-teal">
                      {v.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-espresso-soft/75">
                      {v.text}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
