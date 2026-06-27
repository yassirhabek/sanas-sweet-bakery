"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { compressMenuImage } from "@/lib/image/compressMenuImage";
import { isAllowedMenuImage } from "@/lib/image/allowedMenuImage";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Category, MenuItem } from "@/lib/supabase/types";
import {
  DEFAULT_CATEGORY_ICON,
  isCategoryIconName,
  normalizeCategoryIcon,
} from "@/lib/category-icons";

function revalidatePublic() {
  revalidatePath("/nl", "layout");
  revalidatePath("/en", "layout");
}

export async function getCategoriesAdmin(): Promise<Category[]> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  if (error) throw new Error(error.message);
  return (data ?? []) as Category[];
}

export async function getMenuItemsAdmin(
  categoryId: string,
): Promise<MenuItem[]> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("category_id", categoryId)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return (data ?? []) as MenuItem[];
}

export async function saveCategory(
  category: Partial<Category> & { name_nl: string; name_en: string },
) {
  await requireAdmin();
  const supabase = createAdminClient();

  if (category.id) {
    const { error } = await supabase
      .from("categories")
      .update({
        name_nl: category.name_nl,
        name_en: category.name_en,
        sort_order: category.sort_order,
        icon: normalizeCategoryIcon(category.icon),
      })
      .eq("id", category.id);
    if (error) throw new Error(error.message);
  } else {
    const { data: existing } = await supabase
      .from("categories")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1);
    const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;
    const icon = category.icon && isCategoryIconName(category.icon)
      ? category.icon
      : DEFAULT_CATEGORY_ICON;
    const { error } = await supabase.from("categories").insert({
      name_nl: category.name_nl,
      name_en: category.name_en,
      sort_order: nextOrder,
      icon,
    });
    if (error) throw new Error(error.message);
  }

  revalidatePublic();
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublic();
}

export async function reorderCategory(id: string, direction: "up" | "down") {
  await requireAdmin();
  const supabase = createAdminClient();
  const categories = await getCategoriesAdmin();
  const index = categories.findIndex((c) => c.id === id);
  if (index < 0) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= categories.length) return;

  const current = categories[index];
  const swap = categories[swapIndex];

  await supabase
    .from("categories")
    .update({ sort_order: swap.sort_order })
    .eq("id", current.id);
  await supabase
    .from("categories")
    .update({ sort_order: current.sort_order })
    .eq("id", swap.id);

  revalidatePublic();
}

export async function saveMenuItem(
  item: Partial<MenuItem> & {
    category_id: string;
    name_nl: string;
    name_en: string;
    description_nl: string;
    description_en: string;
  },
) {
  await requireAdmin();
  const supabase = createAdminClient();

  const payload = {
    category_id: item.category_id,
    name_nl: item.name_nl,
    name_en: item.name_en,
    description_nl: item.description_nl,
    description_en: item.description_en,
    price: item.price ?? null,
    image_url: item.image_url ?? null,
    sort_order: item.sort_order ?? 0,
    is_featured: item.is_featured ?? false,
  };

  if (item.id) {
    const { error } = await supabase
      .from("menu_items")
      .update(payload)
      .eq("id", item.id);
    if (error) throw new Error(error.message);
  } else {
    const { data: existing } = await supabase
      .from("menu_items")
      .select("sort_order")
      .eq("category_id", item.category_id)
      .order("sort_order", { ascending: false })
      .limit(1);
    const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;
    const { error } = await supabase
      .from("menu_items")
      .insert({ ...payload, sort_order: nextOrder });
    if (error) throw new Error(error.message);
  }

  revalidatePublic();
}

export async function deleteMenuItem(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublic();
}

export async function uploadMenuImage(formData: FormData): Promise<string> {
  await requireAdmin();
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) throw new Error("File too large (max 5MB)");

  if (!isAllowedMenuImage(file)) {
    throw new Error("Invalid file type");
  }

  const supabase = createAdminClient();
  const input = Buffer.from(await file.arrayBuffer());
  const { buffer, contentType, extension } = await compressMenuImage(input);
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

  const { error } = await supabase.storage
    .from("menu-images")
    .upload(fileName, new Uint8Array(buffer), { contentType, upsert: false });

  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("menu-images").getPublicUrl(fileName);

  return publicUrl;
}
