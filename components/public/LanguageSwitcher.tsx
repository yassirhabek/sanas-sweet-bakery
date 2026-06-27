"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: "nl" | "en") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div
      className="inline-flex gap-0.5 rounded-full border border-gold/25 bg-sand/80 p-1 text-xs font-semibold shadow-sm"
      role="group"
      aria-label="Language"
    >
      {(["nl", "en"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => switchLocale(lang)}
          className={`rounded-full px-2.5 py-1.5 transition-all duration-200 sm:px-3.5 ${
            locale === lang
              ? "bg-deep-teal text-cream shadow-sm"
              : "text-espresso-soft hover:text-deep-teal"
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
