"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/actions/auth";

const NAV_ITEMS = [
  { href: "/admin/hours", label: "Openingstijden" },
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/contact", label: "Contact" },
];

export function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-espresso/10 bg-cream/95 backdrop-blur-md">
      <div className="page-container flex items-center justify-between py-3 sm:py-4">
        <div className="flex min-w-0 items-center gap-4 sm:gap-8">
          <Link
            href="/admin/hours"
            className="font-heading shrink-0 text-lg font-semibold text-espresso sm:text-xl"
          >
            Admin
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-espresso text-cream"
                      : "text-espresso-soft hover:bg-sand hover:text-espresso"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <form action={logout} className="hidden sm:block">
            <button
              type="submit"
              className="rounded-lg px-3 py-2 text-sm font-medium text-espresso-soft transition-colors hover:bg-sand hover:text-espresso"
            >
              Uitloggen
            </button>
          </form>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-espresso hover:bg-sand sm:hidden"
            aria-expanded={open}
            aria-label={open ? "Menu sluiten" : "Menu openen"}
          >
            {open ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-espresso/10 bg-cream sm:hidden">
          <div className="page-container flex flex-col gap-1 py-3">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`min-h-[44px] rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-espresso text-cream"
                      : "text-espresso-soft hover:bg-sand"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <form action={logout} className="mt-2 border-t border-espresso/10 pt-2">
              <button
                type="submit"
                className="min-h-[44px] w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-espresso-soft hover:bg-sand"
              >
                Uitloggen
              </button>
            </form>
          </div>
        </nav>
      )}
    </header>
  );
}
