import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Clock, MapPin } from "lucide-react";
import { getTodayHours } from "@/lib/hours";
import {
  getAddressForLocale,
  getContactSettings,
  getPhoneHref,
} from "@/lib/contact";
import { BRAND_NAME } from "@/lib/brand";
import { ZelligePattern } from "./ZelligeBorder";

export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tContact = await getTranslations("contact");
  const tCommon = await getTranslations("common");
  const [todayHours, contact] = await Promise.all([
    getTodayHours(locale, tCommon("closed")),
    getContactSettings(),
  ]);

  const address = getAddressForLocale(contact, locale);

  const links = [
    { href: "/", label: tNav("home") },
    { href: "/menu", label: tNav("menu") },
    { href: "/about", label: tNav("about") },
    { href: "/contact", label: tNav("contact") },
  ] as const;

  return (
    <footer className="relative mt-auto overflow-hidden bg-espresso text-cream">
      <ZelligePattern className="absolute inset-0 opacity-20" />
      <div className="page-container relative py-8 sm:py-12 md:py-16">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-deep-teal-light text-gold sm:h-11 sm:w-11">
                ✦
              </span>
              <div className="min-w-0">
                <p className="font-heading text-lg font-bold text-gold-light sm:text-xl md:text-2xl">
                  {BRAND_NAME}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-cream/60 sm:text-sm">
                  {t("tagline")}
                </p>
              </div>
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/70 sm:mt-4">
              {t("blurb")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:col-span-7 lg:grid-cols-3">
            <div className="hidden md:block">
              <p className="mb-2 text-[10px] font-semibold tracking-widest text-gold/80 uppercase sm:mb-3 sm:text-xs">
                {t("navigation")}
              </p>
              <ul className="grid grid-cols-2 gap-1.5 sm:gap-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex min-h-[40px] items-center rounded-lg bg-cream/5 px-3 text-sm text-cream/80 transition-colors hover:bg-cream/10 hover:text-gold-light sm:min-h-[44px]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 grid grid-cols-2 gap-4 sm:gap-5 lg:col-span-2">
              <div className="flex gap-2.5 sm:gap-3">
                <MapPin
                  className="mt-0.5 shrink-0 text-terracotta"
                  size={16}
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold tracking-widest text-gold/80 uppercase sm:text-xs">
                    {tContact("address")}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-cream/75 sm:text-sm">
                    {address}
                  </p>
                </div>
              </div>
              <div className="flex gap-2.5 sm:gap-3">
                <Clock
                  className="mt-0.5 shrink-0 text-terracotta"
                  size={16}
                />
                <div>
                  <p className="text-[10px] font-semibold tracking-widest text-gold/80 uppercase sm:text-xs">
                    {t("hoursToday")}
                  </p>
                  <p className="mt-1 text-xs font-medium text-cream sm:text-sm">
                    {todayHours}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-cream/10 pt-5 text-center sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:pt-6 sm:text-left md:mt-10 md:pt-8">
          <p className="text-[11px] text-cream/45 sm:text-xs">
            © {new Date().getFullYear()} {BRAND_NAME}. {t("rights")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:justify-end">
            <a
              href={getPhoneHref(contact.phone)}
              className="text-[11px] text-cream/55 transition-colors hover:text-gold-light sm:text-xs"
            >
              {contact.phone}
            </a>
            <a
              href="/admin"
              className="text-[11px] text-cream/30 transition-colors hover:text-cream/55 sm:text-xs"
            >
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
