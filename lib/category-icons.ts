import {
  Apple,
  Cake,
  Candy,
  CakeSlice,
  ChefHat,
  Cherry,
  Coffee,
  Cookie,
  Croissant,
  CupSoda,
  Donut,
  EggFried,
  Flame,
  Grape,
  IceCreamCone,
  Leaf,
  Milk,
  Popcorn,
  Sandwich,
  Wheat,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICON_NAMES = [
  "wheat",
  "croissant",
  "cake-slice",
  "cake",
  "cookie",
  "donut",
  "candy",
  "ice-cream-cone",
  "coffee",
  "leaf",
  "milk",
  "cup-soda",
  "sandwich",
  "chef-hat",
  "egg-fried",
  "cherry",
  "apple",
  "grape",
  "popcorn",
  "flame",
] as const;

export type CategoryIconName = (typeof CATEGORY_ICON_NAMES)[number];

export const DEFAULT_CATEGORY_ICON: CategoryIconName = "wheat";

export const CATEGORY_ICON_LABELS: Record<CategoryIconName, string> = {
  wheat: "Brood / tarwe",
  croissant: "Croissant",
  "cake-slice": "Taart punt",
  cake: "Taart",
  cookie: "Koekje",
  donut: "Donut",
  candy: "Snoep",
  "ice-cream-cone": "IJs",
  coffee: "Koffie",
  leaf: "Thee",
  milk: "Melk",
  "cup-soda": "Drank",
  sandwich: "Broodje",
  "chef-hat": "Chef",
  "egg-fried": "Ontbijt",
  cherry: "Kers",
  apple: "Appel",
  grape: "Druif",
  popcorn: "Snack",
  flame: "Oven / vers",
};

const ICON_MAP: Record<CategoryIconName, LucideIcon> = {
  wheat: Wheat,
  croissant: Croissant,
  "cake-slice": CakeSlice,
  cake: Cake,
  cookie: Cookie,
  donut: Donut,
  candy: Candy,
  "ice-cream-cone": IceCreamCone,
  coffee: Coffee,
  leaf: Leaf,
  milk: Milk,
  "cup-soda": CupSoda,
  sandwich: Sandwich,
  "chef-hat": ChefHat,
  "egg-fried": EggFried,
  cherry: Cherry,
  apple: Apple,
  grape: Grape,
  popcorn: Popcorn,
  flame: Flame,
};

export function isCategoryIconName(value: string): value is CategoryIconName {
  return (CATEGORY_ICON_NAMES as readonly string[]).includes(value);
}

export function getCategoryIcon(name: string | null | undefined): LucideIcon {
  if (name && isCategoryIconName(name)) return ICON_MAP[name];
  return ICON_MAP[DEFAULT_CATEGORY_ICON];
}

export function normalizeCategoryIcon(
  name: string | null | undefined,
): CategoryIconName {
  if (name && isCategoryIconName(name)) return name;
  return DEFAULT_CATEGORY_ICON;
}
