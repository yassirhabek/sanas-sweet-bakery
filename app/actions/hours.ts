"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { OpeningHours, SpecialHours } from "@/lib/supabase/types";

function revalidatePublic() {
  revalidatePath("/nl", "layout");
  revalidatePath("/en", "layout");
}

export async function saveWeeklyHours(hours: OpeningHours[]) {
  await requireAdmin();
  const supabase = createAdminClient();

  for (const row of hours) {
    const { error } = await supabase.from("opening_hours").upsert({
      day_of_week: row.day_of_week,
      open_time: row.is_closed ? null : row.open_time,
      close_time: row.is_closed ? null : row.close_time,
      is_closed: row.is_closed,
    });
    if (error) throw new Error(error.message);
  }

  revalidatePublic();
}

export async function getWeeklyHoursAdmin(): Promise<OpeningHours[]> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("opening_hours")
    .select("*")
    .order("day_of_week");
  if (error) throw new Error(error.message);
  return (data ?? []) as OpeningHours[];
}

export async function getSpecialHoursAdmin(): Promise<SpecialHours[]> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("special_hours")
    .select("*")
    .order("date");
  if (error) throw new Error(error.message);
  return (data ?? []) as SpecialHours[];
}

export async function saveSpecialHours(
  entry: Omit<SpecialHours, "id"> & { id?: string },
) {
  await requireAdmin();
  const supabase = createAdminClient();

  const payload = {
    date: entry.date,
    open_time: entry.is_closed ? null : entry.open_time,
    close_time: entry.is_closed ? null : entry.close_time,
    is_closed: entry.is_closed,
    note_nl: entry.note_nl,
    note_en: entry.note_en,
  };

  if (entry.id) {
    const { error } = await supabase
      .from("special_hours")
      .update(payload)
      .eq("id", entry.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("special_hours").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePublic();
}

export async function deleteSpecialHours(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("special_hours").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublic();
}
