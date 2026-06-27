"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";
import { BRAND_NAME } from "@/lib/brand";

const navItems = ["home", "menu", "about", "contact"] as const;

export function Header() {
  const t = useTranslations("nav");
  const tHome = useTranslations("home");
  const tBrand = useTranslations("brand");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduced = usePrefersReducedMotion();
  const { scrollY } = useScroll();

  const headerBg = useTransform(
    scrollY,
    [0, 60],
    reduced
      ? ["rgba(255,253,249,0.95)", "rgba(255,253,249,0.95)"]
      : ["rgba(255,253,249,0.7)", "rgba(255,253,249,0.95)"],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const hrefMap = {
    home: "/",
    menu: "/menu",
    about: "/about",
    contact: "/contact",
  };

  const isActive = (key: (typeof navItems)[number]) => {
    const href = hrefMap[key];
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <motion.header
        style={{ backgroundColor: headerBg }}
        className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
          scrolled ? "border-gold/20 shadow-sm" : "border-transparent"
        } backdrop-blur-md`}
      >
        <div className="page-container flex items-center justify-between gap-3 py-3 sm:gap-4 sm:py-4">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-2.5 sm:gap-3"
            onClick={closeMobile}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-deep-teal text-sm text-gold shadow-md transition-transform group-hover:scale-105 sm:h-10 sm:w-10">
              ✦
            </span>
            <div className="min-w-0 leading-tight">
              <span className="font-heading block truncate text-base font-bold text-deep-teal sm:text-lg">
                {BRAND_NAME}
              </span>
              <span className="block truncate text-[10px] font-medium tracking-wide text-espresso-soft/60 sm:text-[11px]">
                {tBrand("headerNote")}
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((key) => (
              <Link
                key={key}
                href={hrefMap[key]}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive(key)
                    ? "bg-terracotta/10 text-terracotta"
                    : "text-espresso-soft hover:bg-deep-teal/5 hover:text-deep-teal"
                }`}
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher />
            <Link
              href="/menu"
              className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-terracotta/20 transition-all hover:bg-terracotta-dark hover:shadow-lg"
            >
              {tHome("ctaMenu")}
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full text-deep-teal transition-colors hover:bg-deep-teal/5"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-espresso/60 backdrop-blur-sm lg:hidden"
            onClick={closeMobile}
          >
            <motion.nav
              initial={reduced ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduced ? undefined : { x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="safe-bottom absolute top-0 right-0 flex h-full w-[min(100%,18rem)] max-w-full flex-col bg-cream shadow-2xl sm:w-80"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gold/15 p-4 pt-[max(1rem,env(safe-area-inset-top))]">
                <span className="font-heading text-lg font-semibold text-deep-teal">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={closeMobile}
                  className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-sand"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                {navItems.map((key, i) => (
                  <motion.div
                    key={key}
                    initial={reduced ? false : { opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={hrefMap[key]}
                      onClick={closeMobile}
                      className={`flex min-h-[48px] items-center rounded-xl px-4 text-base font-medium transition-colors ${
                        isActive(key)
                          ? "bg-terracotta/10 text-terracotta"
                          : "text-espresso hover:bg-sand"
                      }`}
                    >
                      {t(key)}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="safe-bottom border-t border-gold/15 p-4">
                <Link
                  href="/menu"
                  onClick={closeMobile}
                  className="flex min-h-[48px] w-full items-center justify-center rounded-full bg-terracotta text-sm font-semibold text-white shadow-md"
                >
                  {tHome("ctaMenu")}
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
