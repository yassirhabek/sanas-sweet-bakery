"use client";

import {
  CATEGORY_ICON_LABELS,
  CATEGORY_ICON_NAMES,
  getCategoryIcon,
  type CategoryIconName,
} from "@/lib/category-icons";

type Props = {
  value: CategoryIconName;
  onChange: (icon: CategoryIconName) => void;
  compact?: boolean;
};

export function CategoryIconPicker({ value, onChange, compact }: Props) {
  return (
    <div
      className={`grid gap-2 ${compact ? "grid-cols-6" : "grid-cols-4 sm:grid-cols-6"}`}
      role="radiogroup"
      aria-label="Kies een icoon"
    >
      {CATEGORY_ICON_NAMES.map((name) => {
        const Icon = getCategoryIcon(name);
        const selected = value === name;
        return (
          <button
            key={name}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={CATEGORY_ICON_LABELS[name]}
            title={CATEGORY_ICON_LABELS[name]}
            onClick={() => onChange(name)}
            className={`flex aspect-square min-h-[44px] flex-col items-center justify-center rounded-xl border transition-all ${
              selected
                ? "border-terracotta bg-terracotta/10 text-terracotta ring-2 ring-terracotta/30"
                : "border-espresso/10 bg-white text-espresso-soft hover:border-espresso/25 hover:bg-sand hover:text-espresso"
            }`}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </button>
        );
      })}
    </div>
  );
}

export function CategoryIconBadge({
  icon,
  size = "md",
  variant = "default",
}: {
  icon: string | null | undefined;
  size?: "sm" | "md";
  variant?: "default" | "inverse";
}) {
  const Icon = getCategoryIcon(icon);
  const sizeClass = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const iconClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const variantClass =
    variant === "inverse"
      ? "bg-cream/15 text-cream shadow-none"
      : "bg-gradient-to-br from-sand to-cream text-terracotta shadow-inner";

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full ${variantClass} ${sizeClass}`}
    >
      <Icon className={iconClass} strokeWidth={1.75} />
    </span>
  );
}
