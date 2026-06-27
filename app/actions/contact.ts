"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ContactSettings } from "@/lib/supabase/types";

function revalidatePublic() {
  revalidatePath("/nl", "layout");
  revalidatePath("/en", "layout");
}

export async function getContactSettingsAdmin(): Promise<ContactSettings> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("contact_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Contactgegevens niet gevonden");
  return data as ContactSettings;
}

export async function saveContactSettings(
  settings: Omit<ContactSettings, "id">,
) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase.from("contact_settings").upsert({
    id: 1,
    address_nl: settings.address_nl.trim(),
    address_en: settings.address_en.trim(),
    phone: settings.phone.trim(),
    email: settings.email.trim(),
    maps_query: settings.maps_query.trim(),
  });

  if (error) throw new Error(error.message);
  revalidatePublic();
}
