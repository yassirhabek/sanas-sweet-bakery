import { BRAND_EMAIL } from "@/lib/brand";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ContactSettings } from "@/lib/supabase/types";

export const FALLBACK_CONTACT: ContactSettings = {
  id: 1,
  address_nl: "Goudse Rijweg 20, 3061 DD Rotterdam",
  address_en: "Goudse Rijweg 20, 3061 DD Rotterdam",
  phone: "+31 20 123 4567",
  email: BRAND_EMAIL,
  maps_query: "Goudse Rijweg 20, 3061 DD Rotterdam",
};

export async function getContactSettings(): Promise<ContactSettings> {
  if (!isSupabaseConfigured()) return FALLBACK_CONTACT;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) return FALLBACK_CONTACT;
  return data as ContactSettings;
}

export function getAddressForLocale(
  settings: ContactSettings,
  locale: string,
): string {
  return locale === "nl" ? settings.address_nl : settings.address_en;
}

export function getMapsDirectionsUrl(mapsQuery: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsQuery)}`;
}

export function getMapsEmbedUrl(mapsQuery: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`;
}

export function getPhoneHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`;
}

export function getEmailHref(email: string): string {
  return `mailto:${email}`;
}
