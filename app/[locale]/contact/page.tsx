import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageBanner } from "@/components/public/PageBanner";
import { HoursTable } from "@/components/public/HoursTable";
import { InfoCard } from "@/components/public/InfoCard";
import { FadeIn } from "@/components/motion/FadeIn";
import { ExternalLink, MapPin } from "lucide-react";
import { getWeeklyHours, getSpecialHours } from "@/lib/hours";
import {
  getAddressForLocale,
  getContactSettings,
  getEmailHref,
  getMapsDirectionsUrl,
  getMapsEmbedUrl,
  getPhoneHref,
} from "@/lib/contact";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title") };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");
  const tCommon = await getTranslations("common");

  const [weekly, special, contact] = await Promise.all([
    getWeeklyHours(),
    getSpecialHours(),
    getContactSettings(),
  ]);

  const address = getAddressForLocale(contact, locale);
  const mapsUrl = getMapsDirectionsUrl(contact.maps_query);
  const mapsEmbedUrl = getMapsEmbedUrl(contact.maps_query);

  return (
    <>
      <PageBanner title={t("title")} subtitle={t("subtitle")} />

      <div className="page-container py-10 sm:py-16 md:py-24">
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          <FadeIn direction="left" className="space-y-4 sm:space-y-5 lg:col-span-1">
            <InfoCard icon="map" title={t("address")}>
              <p className="leading-relaxed">{address}</p>
              <p className="mt-2 text-sm leading-relaxed text-espresso-soft/70 italic">
                {t("visitNote")}
              </p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-terracotta hover:text-terracotta-dark"
              >
                {t("getDirections")}
                <ExternalLink size={14} />
              </a>
            </InfoCard>
            <InfoCard icon="phone" title={t("phone")}>
              <a
                href={getPhoneHref(contact.phone)}
                className="inline-flex min-h-[44px] items-center font-medium text-deep-teal hover:text-terracotta"
              >
                {contact.phone}
              </a>
            </InfoCard>
            <InfoCard icon="mail" title={t("email")}>
              <a
                href={getEmailHref(contact.email)}
                className="inline-flex min-h-[44px] items-center break-all font-medium text-deep-teal hover:text-terracotta"
              >
                {contact.email}
              </a>
            </InfoCard>
          </FadeIn>

          <FadeIn direction="right" className="lg:col-span-2">
            <div className="card-elevated h-full rounded-2xl border border-gold/15 bg-cream p-5 sm:rounded-3xl sm:p-8 md:p-10">
              <h2 className="font-heading mb-6 text-xl font-bold text-deep-teal sm:mb-8 sm:text-2xl md:text-3xl">
                {t("hoursTitle")}
              </h2>
              <HoursTable
                weekly={weekly}
                special={special}
                locale={locale}
                closedLabel={tCommon("closed")}
                showSpecial
                specialTitle={t("specialHoursTitle")}
              />
            </div>
          </FadeIn>
        </div>

        <FadeIn className="mt-10 sm:mt-16">
          <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-heading text-xl font-bold text-deep-teal sm:text-2xl md:text-3xl">
              {t("mapTitle")}
            </h2>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-gold/30 px-4 py-2.5 text-sm font-medium text-deep-teal transition-colors hover:bg-cream sm:w-auto"
            >
              <MapPin size={16} />
              {t("getDirections")}
            </a>
          </div>
          <div className="overflow-hidden rounded-2xl border border-gold/20 shadow-elevated sm:rounded-3xl">
            <iframe
              title="Map"
              src={mapsEmbedUrl}
              className="h-64 w-full sm:h-80 md:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </FadeIn>
      </div>
    </>
  );
}
