import type {
  EffectiveHours,
  MenuItem,
  OpeningHours,
  SpecialHours,
  CategoryWithItems,
} from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

const DAY_NAMES_NL = [
  "Maandag",
  "Dinsdag",
  "Woensdag",
  "Donderdag",
  "Vrijdag",
  "Zaterdag",
  "Zondag",
];

const DAY_NAMES_EN = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function getDayName(dayOfWeek: number, locale: string): string {
  const names = locale === "nl" ? DAY_NAMES_NL : DAY_NAMES_EN;
  return names[dayOfWeek] ?? "";
}

function formatTime(time: string | null): string {
  if (!time) return "";
  return time.slice(0, 5);
}

export function getEffectiveHours(
  date: Date,
  weekly: OpeningHours[],
  special: SpecialHours[],
): EffectiveHours {
  const dateStr = date.toISOString().slice(0, 10);
  const specialRow = special.find((s) => s.date === dateStr);

  if (specialRow) {
    return {
      open_time: specialRow.open_time,
      close_time: specialRow.close_time,
      is_closed: specialRow.is_closed,
      is_special: true,
      note_nl: specialRow.note_nl,
      note_en: specialRow.note_en,
    };
  }

  const dayOfWeek = (date.getDay() + 6) % 7;
  const weeklyRow = weekly.find((w) => w.day_of_week === dayOfWeek);

  if (!weeklyRow) {
    return {
      open_time: null,
      close_time: null,
      is_closed: true,
      is_special: false,
    };
  }

  return {
    open_time: weeklyRow.open_time,
    close_time: weeklyRow.close_time,
    is_closed: weeklyRow.is_closed,
    is_special: false,
  };
}

export function formatHoursDisplay(
  hours: EffectiveHours,
  locale: string,
  closedLabel: string,
): string {
  if (hours.is_closed) return closedLabel;
  const open = formatTime(hours.open_time);
  const close = formatTime(hours.close_time);
  if (!open || !close) return closedLabel;
  return `${open} – ${close}`;
}

const FALLBACK_WEEKLY: OpeningHours[] = [
  { day_of_week: 0, open_time: "07:00", close_time: "18:00", is_closed: false },
  { day_of_week: 1, open_time: "07:00", close_time: "18:00", is_closed: false },
  { day_of_week: 2, open_time: "07:00", close_time: "18:00", is_closed: false },
  { day_of_week: 3, open_time: "07:00", close_time: "18:00", is_closed: false },
  { day_of_week: 4, open_time: "07:00", close_time: "18:00", is_closed: false },
  { day_of_week: 5, open_time: "07:00", close_time: "18:00", is_closed: false },
  { day_of_week: 6, open_time: null, close_time: null, is_closed: true },
];

const FALLBACK_CATEGORIES: CategoryWithItems[] = [
  {
    id: "1",
    name_nl: "Brood",
    name_en: "Bread",
    sort_order: 0,
    icon: "wheat",
    menu_items: [
      {
        id: "1",
        category_id: "1",
        name_nl: "Khobz",
        name_en: "Khobz",
        description_nl: "Traditioneel Marokkaans rondbrood, dagelijks vers gebakken.",
        description_en: "Traditional Moroccan round bread, baked fresh daily.",
        price: 2.5,
        image_url:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600",
        sort_order: 0,
        is_featured: true,
      },
      {
        id: "2",
        category_id: "1",
        name_nl: "Msemen",
        name_en: "Msemen",
        description_nl: "Gelaagd flatbrood, knapperig van buiten en zacht van binnen.",
        description_en: "Layered flatbread, crispy outside and soft inside.",
        price: 3.0,
        image_url:
          "https://images.unsplash.com/photo-1619535854729-0b764f4cfc4e?w=600",
        sort_order: 1,
        is_featured: true,
      },
    ],
  },
  {
    id: "2",
    name_nl: "Gebak",
    name_en: "Pastries",
    sort_order: 1,
    icon: "croissant",
    menu_items: [
      {
        id: "3",
        category_id: "2",
        name_nl: "Chebakia",
        name_en: "Chebakia",
        description_nl:
          "Honingzoete bloemkoekjes met sesamzaad, een Ramadan-specialiteit.",
        description_en:
          "Honey-sweet flower cookies with sesame seeds, a Ramadan specialty.",
        price: 1.5,
        image_url:
          "https://images.unsplash.com/photo-1558961363-fa8fdf0db814?w=600",
        sort_order: 0,
        is_featured: true,
      },
      {
        id: "4",
        category_id: "2",
        name_nl: "Briouat",
        name_en: "Briouat",
        description_nl: "Krokante filodeegpakketjes gevuld met amandelpasta.",
        description_en: "Crispy phyllo parcels filled with almond paste.",
        price: 2.0,
        image_url:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
        sort_order: 1,
        is_featured: false,
      },
    ],
  },
  {
    id: "3",
    name_nl: "Taarten",
    name_en: "Cakes",
    sort_order: 2,
    icon: "cake-slice",
    menu_items: [
      {
        id: "5",
        category_id: "3",
        name_nl: "Meskouta",
        name_en: "Meskouta",
        description_nl: "Lichte Marokkaanse citroencake, perfect bij de thee.",
        description_en: "Light Moroccan lemon cake, perfect with tea.",
        price: 18.0,
        image_url:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
        sort_order: 0,
        is_featured: false,
      },
    ],
  },
];

export async function getWeeklyHours(): Promise<OpeningHours[]> {
  if (!isSupabaseConfigured()) return FALLBACK_WEEKLY;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("opening_hours")
    .select("*")
    .order("day_of_week");

  if (error || !data?.length) return FALLBACK_WEEKLY;
  return data as OpeningHours[];
}

export async function getSpecialHours(): Promise<SpecialHours[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("special_hours")
    .select("*")
    .gte("date", today)
    .order("date");

  if (error || !data) return [];
  return data as SpecialHours[];
}

export async function getAllSpecialHours(): Promise<SpecialHours[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("special_hours")
    .select("*")
    .order("date");

  if (error || !data) return [];
  return data as SpecialHours[];
}

export async function getFeaturedItems(): Promise<MenuItem[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_CATEGORIES.flatMap((c) => c.menu_items).filter(
      (i) => i.is_featured,
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_featured", true)
    .order("sort_order");

  if (error || !data?.length) {
    return FALLBACK_CATEGORIES.flatMap((c) => c.menu_items).filter(
      (i) => i.is_featured,
    );
  }
  return data as MenuItem[];
}

export async function getMenuWithCategories(): Promise<CategoryWithItems[]> {
  if (!isSupabaseConfigured()) return FALLBACK_CATEGORIES;

  const supabase = await createClient();
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  if (catError || !categories?.length) return FALLBACK_CATEGORIES;

  const { data: items, error: itemError } = await supabase
    .from("menu_items")
    .select("*")
    .order("sort_order");

  if (itemError) return FALLBACK_CATEGORIES;

  return (categories as CategoryWithItems[]).map((cat) => ({
    ...cat,
    menu_items: ((items ?? []) as MenuItem[]).filter(
      (i) => i.category_id === cat.id,
    ),
  }));
}

export async function getTodayHours(locale: string, closedLabel: string) {
  const weekly = await getWeeklyHours();
  const special = await getAllSpecialHours();
  const today = new Date();
  const effective = getEffectiveHours(today, weekly, special);
  return formatHoursDisplay(effective, locale, closedLabel);
}
