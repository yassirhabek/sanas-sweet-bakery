"use client";

import { useState } from "react";
import type { ContactSettings } from "@/lib/supabase/types";
import { saveContactSettings } from "@/app/actions/contact";
import { AdminToast } from "@/components/admin/AdminToast";

type Props = {
  initialSettings: ContactSettings;
};

type Toast = { message: string; type: "success" | "error" };

const inputClass =
  "w-full min-h-[44px] rounded-lg border border-espresso/15 bg-white px-3 py-2.5 text-sm text-espresso placeholder:text-espresso-soft/50 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20";

const btnPrimary =
  "inline-flex min-h-[44px] items-center justify-center rounded-lg bg-espresso px-4 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-espresso-soft disabled:opacity-50";

export function ContactForm({ initialSettings }: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
  }

  function updateField(field: keyof Omit<ContactSettings, "id">, value: string) {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveContactSettings({
        address_nl: settings.address_nl,
        address_en: settings.address_en,
        phone: settings.phone,
        email: settings.email,
        maps_query: settings.maps_query,
      });
      showToast("Contactgegevens opgeslagen");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Fout bij opslaan", "error");
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      {toast && (
        <AdminToast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}

      <section className="rounded-2xl border border-espresso/10 bg-cream p-4 shadow-card sm:p-6">
        <h2 className="font-heading mb-1 text-lg font-semibold text-espresso">
          Adres
        </h2>
        <p className="mb-4 text-sm text-espresso-soft">
          Wordt getoond op de contactpagina en in de footer.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-espresso-soft">
              Adres (NL)
            </label>
            <textarea
              value={settings.address_nl}
              onChange={(e) => updateField("address_nl", e.target.value)}
              className={`${inputClass} min-h-[80px] resize-y`}
              rows={2}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-espresso-soft">
              Address (EN)
            </label>
            <textarea
              value={settings.address_en}
              onChange={(e) => updateField("address_en", e.target.value)}
              className={`${inputClass} min-h-[80px] resize-y`}
              rows={2}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-espresso/10 bg-cream p-4 shadow-card sm:p-6">
        <h2 className="font-heading mb-1 text-lg font-semibold text-espresso">
          Telefoon & e-mail
        </h2>
        <p className="mb-4 text-sm text-espresso-soft">
          Klikbare links op de contactpagina en in de footer.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-espresso-soft">
              Telefoon
            </label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className={inputClass}
              placeholder="+31 10 123 4567"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-espresso-soft">
              E-mail
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={inputClass}
              placeholder="info@voorbeeld.nl"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-espresso/10 bg-cream p-4 shadow-card sm:p-6">
        <h2 className="font-heading mb-1 text-lg font-semibold text-espresso">
          Kaart & route
        </h2>
        <p className="mb-4 text-sm text-espresso-soft">
          Gebruikt voor de ingesloten kaart en de routebeschrijving-knop op de
          contactpagina.
        </p>
        <div>
          <label className="mb-1 block text-xs font-medium text-espresso-soft">
            Locatie (Google Maps zoekterm)
          </label>
          <input
            value={settings.maps_query}
            onChange={(e) => updateField("maps_query", e.target.value)}
            className={inputClass}
            placeholder="Straat, postcode, plaats"
          />
        </div>
      </section>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className={btnPrimary}
      >
        {saving ? "Opslaan…" : "Opslaan"}
      </button>
    </div>
  );
}
