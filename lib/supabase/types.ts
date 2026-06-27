export type OpeningHours = {
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
};

export type SpecialHours = {
  id: string;
  date: string;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
  note_nl: string | null;
  note_en: string | null;
};

export type Category = {
  id: string;
  name_nl: string;
  name_en: string;
  sort_order: number;
  icon: string;
};

export type MenuItem = {
  id: string;
  category_id: string;
  name_nl: string;
  name_en: string;
  description_nl: string;
  description_en: string;
  price: number | null;
  image_url: string | null;
  sort_order: number;
  is_featured: boolean;
};

export type CategoryWithItems = Category & {
  menu_items: MenuItem[];
};

export type ContactSettings = {
  id: number;
  address_nl: string;
  address_en: string;
  phone: string;
  email: string;
  maps_query: string;
};

export type EffectiveHours = {
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
  is_special: boolean;
  note_nl?: string | null;
  note_en?: string | null;
};
