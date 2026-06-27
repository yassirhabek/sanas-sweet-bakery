"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Category, MenuItem } from "@/lib/supabase/types";
import {
  CATEGORY_ICON_LABELS,
  DEFAULT_CATEGORY_ICON,
  normalizeCategoryIcon,
  type CategoryIconName,
} from "@/lib/category-icons";
import {
  saveCategory,
  deleteCategory,
  reorderCategory,
  saveMenuItem,
  deleteMenuItem,
  getCategoriesAdmin,
  getMenuItemsAdmin,
} from "@/app/actions/menu";
import { AdminToast } from "@/components/admin/AdminToast";
import {
  ConfirmModal,
  type ConfirmOptions,
} from "@/components/admin/ConfirmModal";
import {
  CategoryIconBadge,
  CategoryIconPicker,
} from "@/components/admin/CategoryIconPicker";
import { ImageUpload } from "@/components/admin/ImageUpload";

type Props = {
  initialCategories: Category[];
  initialItems: MenuItem[];
};

type Toast = { message: string; type: "success" | "error" };

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200";

const inputClass =
  "w-full min-h-[44px] rounded-lg border border-espresso/15 bg-white px-3 py-2.5 text-sm text-espresso placeholder:text-espresso-soft/50 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20";

const btnPrimary =
  "inline-flex min-h-[44px] items-center justify-center rounded-lg bg-espresso px-4 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-espresso-soft disabled:opacity-50";

const btnSecondary =
  "inline-flex min-h-[44px] items-center justify-center rounded-lg border border-espresso/15 bg-white px-4 py-2.5 text-sm font-medium text-espresso transition-colors hover:bg-sand";

const btnDanger =
  "inline-flex min-h-[44px] items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50";

const btnIcon =
  "flex min-h-[36px] min-w-[36px] items-center justify-center rounded-md text-espresso-soft transition-colors hover:bg-sand hover:text-espresso disabled:opacity-30";

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-espresso">{title}</h3>
      {description && (
        <p className="mt-0.5 text-xs text-espresso-soft">{description}</p>
      )}
    </div>
  );
}

export function MenuManager({ initialCategories, initialItems }: Props) {
  const [categories, setCategories] = useState(initialCategories);
  const [items, setItems] = useState(initialItems);
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategories[0]?.id ?? "",
  );
  const [toast, setToast] = useState<Toast | null>(null);
  const [saving, setSaving] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  const [newCat, setNewCat] = useState({
    name_nl: "",
    name_en: "",
    icon: DEFAULT_CATEGORY_ICON as CategoryIconName,
  });
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(
    null,
  );
  const [confirm, setConfirm] = useState<ConfirmOptions | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const selectedCat = categories.find((c) => c.id === selectedCategory);

  const itemCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of items) {
      counts[item.category_id] = (counts[item.category_id] ?? 0) + 1;
    }
    return counts;
  }, [items]);

  const categoryItems = items
    .filter((i) => i.category_id === selectedCategory)
    .sort((a, b) => a.sort_order - b.sort_order);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
  }

  async function refreshCategoryItems(categoryId: string) {
    const updated = await getMenuItemsAdmin(categoryId);
    setItems((prev) => [
      ...prev.filter((i) => i.category_id !== categoryId),
      ...updated,
    ]);
  }

  async function refreshCategories() {
    const updated = await getCategoriesAdmin();
    setCategories(updated);
    return updated;
  }

  function selectCategory(id: string) {
    setSelectedCategory(id);
    setEditingItem(null);
    setIconPickerOpen(false);
  }

  async function handleAddCategory() {
    if (!newCat.name_nl || !newCat.name_en) return;
    setSaving(true);
    try {
      await saveCategory(newCat);
      const updated = await refreshCategories();
      const created = updated[updated.length - 1];
      if (created) selectCategory(created.id);
      setNewCat({ name_nl: "", name_en: "", icon: DEFAULT_CATEGORY_ICON });
      setShowAddCategory(false);
      showToast("Categorie toegevoegd");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Fout", "error");
    }
    setSaving(false);
  }

  async function handleDeleteCategory(id: string) {
    try {
      await deleteCategory(id);
      const remaining = categories.filter((c) => c.id !== id);
      setCategories(remaining);
      setItems(items.filter((i) => i.category_id !== id));
      if (selectedCategory === id) {
        selectCategory(remaining[0]?.id ?? "");
      }
      showToast("Categorie verwijderd");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Fout", "error");
      throw e;
    }
  }

  function requestDeleteCategory(cat: Category) {
    const count = itemCountByCategory[cat.id] ?? 0;
    setConfirm({
      title: "Categorie verwijderen",
      message:
        count > 0
          ? `"${cat.name_nl}" en ${count} ${count === 1 ? "item" : "items"} worden permanent verwijderd. Dit kan niet ongedaan worden gemaakt.`
          : `"${cat.name_nl}" wordt permanent verwijderd. Dit kan niet ongedaan worden gemaakt.`,
      onConfirm: () => handleDeleteCategory(cat.id),
    });
  }

  async function handleReorder(id: string, direction: "up" | "down") {
    try {
      await reorderCategory(id, direction);
      await refreshCategories();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Fout", "error");
    }
  }

  async function handleUpdateCategoryIcon(icon: CategoryIconName) {
    if (!selectedCat) return;
    setSaving(true);
    try {
      await saveCategory({
        id: selectedCat.id,
        name_nl: selectedCat.name_nl,
        name_en: selectedCat.name_en,
        sort_order: selectedCat.sort_order,
        icon,
      });
      setCategories((prev) =>
        prev.map((c) => (c.id === selectedCat.id ? { ...c, icon } : c)),
      );
      setIconPickerOpen(false);
      showToast("Icoon bijgewerkt");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Fout", "error");
    }
    setSaving(false);
  }

  async function handleSaveItem() {
    if (!editingItem || !selectedCategory) return;
    if (!editingItem.name_nl?.trim() || !editingItem.name_en?.trim()) {
      showToast("Vul minimaal de Nederlandse en Engelse naam in", "error");
      return;
    }
    setSaving(true);
    try {
      await saveMenuItem({
        id: editingItem.id,
        category_id: selectedCategory,
        name_nl: editingItem.name_nl ?? "",
        name_en: editingItem.name_en ?? "",
        description_nl: editingItem.description_nl ?? "",
        description_en: editingItem.description_en ?? "",
        price: editingItem.price ?? null,
        image_url: editingItem.image_url ?? null,
        is_featured: editingItem.is_featured ?? false,
        sort_order: editingItem.sort_order ?? 0,
      });
      await refreshCategoryItems(selectedCategory);
      setEditingItem(null);
      showToast("Item opgeslagen");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Fout", "error");
    }
    setSaving(false);
  }

  async function handleDeleteItem(id: string) {
    try {
      await deleteMenuItem(id);
      setItems(items.filter((i) => i.id !== id));
      if (editingItem?.id === id) setEditingItem(null);
      showToast("Item verwijderd");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Fout", "error");
      throw e;
    }
  }

  function requestDeleteItem(item: MenuItem) {
    setConfirm({
      title: "Item verwijderen",
      message: `"${item.name_nl}" wordt permanent verwijderd. Dit kan niet ongedaan worden gemaakt.`,
      onConfirm: () => handleDeleteItem(item.id),
    });
  }

  async function handleConfirm() {
    if (!confirm) return;
    setConfirmLoading(true);
    try {
      await confirm.onConfirm();
      setConfirm(null);
    } catch {
      // Error toast is shown by the delete handler.
    } finally {
      setConfirmLoading(false);
    }
  }

  function startNewItem() {
    setEditingItem({
      name_nl: "",
      name_en: "",
      description_nl: "",
      description_en: "",
      price: null,
      image_url: null,
      is_featured: false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startEditItem(item: MenuItem) {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-espresso/10 bg-cream p-8 text-center shadow-card">
        <p className="mb-4 text-espresso-soft">
          Begin met het aanmaken van je eerste categorie.
        </p>
        <div className="mx-auto max-w-md space-y-3 text-left">
          <input
            placeholder="Naam NL (bijv. Brood)"
            value={newCat.name_nl}
            onChange={(e) => setNewCat({ ...newCat, name_nl: e.target.value })}
            className={inputClass}
          />
          <input
            placeholder="Name EN (e.g. Bread)"
            value={newCat.name_en}
            onChange={(e) => setNewCat({ ...newCat, name_en: e.target.value })}
            className={inputClass}
          />
          <div>
            <p className="mb-2 text-xs font-medium text-espresso-soft">Icoon</p>
            <CategoryIconPicker
              value={newCat.icon}
              onChange={(icon) => setNewCat({ ...newCat, icon })}
              compact
            />
          </div>
          <button
            type="button"
            onClick={handleAddCategory}
            disabled={saving || !newCat.name_nl || !newCat.name_en}
            className={`${btnPrimary} w-full`}
          >
            Eerste categorie aanmaken
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {toast && (
        <AdminToast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}

      <div className="lg:grid lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-6 lg:items-start">
        {/* ── Categories sidebar ── */}
        <aside className="rounded-2xl border border-espresso/10 bg-cream shadow-card lg:sticky lg:top-20">
          <div className="border-b border-espresso/10 px-4 py-3">
            <h2 className="font-heading text-base font-semibold text-espresso">
              Categorieën
            </h2>
            <p className="text-xs text-espresso-soft">
              Kies een categorie om items te beheren
            </p>
          </div>

          <ul className="max-h-[40vh] overflow-y-auto p-2 lg:max-h-[calc(100vh-16rem)]">
            {categories.map((cat, index) => {
              const active = selectedCategory === cat.id;
              const count = itemCountByCategory[cat.id] ?? 0;
              return (
                <li key={cat.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => selectCategory(cat.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                      active
                        ? "bg-espresso text-cream"
                        : "text-espresso hover:bg-sand"
                    }`}
                  >
                    <CategoryIconBadge
                      icon={cat.icon}
                      size="sm"
                      variant={active ? "inverse" : "default"}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {cat.name_nl}
                        <span
                          className={`ml-1.5 text-xs font-normal ${
                            active ? "text-cream/60" : "text-espresso-soft/70"
                          }`}
                        >
                          ({count})
                        </span>
                      </span>
                      <span
                        className={`block truncate text-xs ${
                          active ? "text-cream/70" : "text-espresso-soft"
                        }`}
                      >
                        {cat.name_en}
                      </span>
                    </span>
                  </button>

                  {active && (
                    <div className="mt-1 flex items-center justify-end gap-0.5 px-2 pb-2">
                      <button
                        type="button"
                        onClick={() => handleReorder(cat.id, "up")}
                        disabled={index === 0}
                        className={btnIcon}
                        aria-label="Omhoog"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReorder(cat.id, "down")}
                        disabled={index === categories.length - 1}
                        className={btnIcon}
                        aria-label="Omlaag"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => requestDeleteCategory(cat)}
                        className={`${btnIcon} !text-red-500 hover:!bg-red-50`}
                        aria-label="Verwijderen"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="border-t border-espresso/10 p-3">
            <button
              type="button"
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="flex w-full min-h-[44px] items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-espresso-soft transition-colors hover:bg-sand hover:text-espresso"
            >
              <span>+ Nieuwe categorie</span>
              <span className="text-xs">{showAddCategory ? "▲" : "▼"}</span>
            </button>

            {showAddCategory && (
              <div className="mt-2 space-y-2">
                <input
                  placeholder="Naam NL"
                  value={newCat.name_nl}
                  onChange={(e) =>
                    setNewCat({ ...newCat, name_nl: e.target.value })
                  }
                  className={inputClass}
                />
                <input
                  placeholder="Name EN"
                  value={newCat.name_en}
                  onChange={(e) =>
                    setNewCat({ ...newCat, name_en: e.target.value })
                  }
                  className={inputClass}
                />
                <div>
                  <p className="mb-2 text-xs font-medium text-espresso-soft">
                    Icoon
                  </p>
                  <CategoryIconPicker
                    value={newCat.icon}
                    onChange={(icon) => setNewCat({ ...newCat, icon })}
                    compact
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={saving || !newCat.name_nl || !newCat.name_en}
                  className={`${btnPrimary} w-full`}
                >
                  Toevoegen
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* ── Items panel ── */}
        {selectedCategory && selectedCat && (
          <div className="min-w-0 space-y-4">
            {/* Panel header */}
            <div className="flex flex-col gap-3 rounded-2xl border border-espresso/10 bg-cream px-4 py-4 shadow-card sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-3">
                <CategoryIconBadge icon={selectedCat.icon} />
                <div>
                  <h2 className="font-heading text-lg font-semibold text-espresso">
                    {selectedCat.name_nl}
                  </h2>
                  <p className="text-sm text-espresso-soft">
                    {categoryItems.length === 0
                      ? "Nog geen items"
                      : `${categoryItems.length} ${categoryItems.length === 1 ? "item" : "items"}`}
                  </p>
                </div>
              </div>
              {!editingItem && (
                <button
                  type="button"
                  onClick={startNewItem}
                  className={btnPrimary}
                >
                  + Nieuw item
                </button>
              )}
            </div>

            {!editingItem && (
              <div className="rounded-2xl border border-espresso/10 bg-cream shadow-card">
                <button
                  type="button"
                  onClick={() => setIconPickerOpen(!iconPickerOpen)}
                  aria-expanded={iconPickerOpen}
                  className="flex w-full min-h-[44px] items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-sand/50 sm:p-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <CategoryIconBadge
                      icon={selectedCat.icon}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-espresso">
                        Categorie-icoon
                      </h3>
                      <p className="truncate text-xs text-espresso-soft">
                        {iconPickerOpen
                          ? "Dit icoon verschijnt op de menupagina van de website"
                          : CATEGORY_ICON_LABELS[
                              normalizeCategoryIcon(selectedCat.icon)
                            ]}
                      </p>
                    </div>
                  </div>
                  <span
                    className="shrink-0 text-xs text-espresso-soft"
                    aria-hidden
                  >
                    {iconPickerOpen ? "▲" : "▼"}
                  </span>
                </button>

                {iconPickerOpen && (
                  <div className="border-t border-espresso/10 p-4 sm:p-5">
                    <CategoryIconPicker
                      value={normalizeCategoryIcon(selectedCat.icon)}
                      onChange={handleUpdateCategoryIcon}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Edit form — always on top when open */}
            {editingItem && (
              <div className="rounded-2xl border-2 border-terracotta/30 bg-cream shadow-card">
                <div className="flex items-center justify-between border-b border-espresso/10 px-4 py-3 sm:px-6">
                  <div>
                    <h3 className="font-heading font-semibold text-espresso">
                      {editingItem.id ? "Item bewerken" : "Nieuw item"}
                    </h3>
                    <p className="text-xs text-espresso-soft">
                      in {selectedCat.name_nl}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="min-h-[44px] rounded-lg px-3 text-sm text-espresso-soft hover:bg-sand hover:text-espresso"
                  >
                    Sluiten
                  </button>
                </div>

                <div className="space-y-6 p-4 sm:p-6">
                  <div>
                    <SectionTitle
                      title="Basisgegevens"
                      description="Naam en prijs van het product"
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-espresso-soft">
                          Naam NL *
                        </label>
                        <input
                          value={editingItem.name_nl ?? ""}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              name_nl: e.target.value,
                            })
                          }
                          className={inputClass}
                          placeholder="bijv. Croissant"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-espresso-soft">
                          Name EN *
                        </label>
                        <input
                          value={editingItem.name_en ?? ""}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              name_en: e.target.value,
                            })
                          }
                          className={inputClass}
                          placeholder="e.g. Croissant"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-espresso-soft">
                          Prijs (€)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editingItem.price ?? ""}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              price: e.target.value
                                ? parseFloat(e.target.value)
                                : null,
                            })
                          }
                          className={inputClass}
                          placeholder="2.50"
                        />
                      </div>
                      <label className="flex min-h-[44px] items-center gap-3 self-end text-sm text-espresso">
                        <input
                          type="checkbox"
                          checked={editingItem.is_featured ?? false}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              is_featured: e.target.checked,
                            })
                          }
                          className="h-5 w-5 rounded accent-terracotta"
                        />
                        Uitgelicht op homepagina
                      </label>
                    </div>
                  </div>

                  <div>
                    <SectionTitle
                      title="Beschrijving"
                      description="Korte omschrijving in beide talen"
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-espresso-soft">
                          NL
                        </label>
                        <textarea
                          value={editingItem.description_nl ?? ""}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              description_nl: e.target.value,
                            })
                          }
                          className={`${inputClass} min-h-[80px] resize-y`}
                          rows={3}
                          placeholder="Beschrijving in het Nederlands"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-espresso-soft">
                          EN
                        </label>
                        <textarea
                          value={editingItem.description_en ?? ""}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              description_en: e.target.value,
                            })
                          }
                          className={`${inputClass} min-h-[80px] resize-y`}
                          rows={3}
                          placeholder="Description in English"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <SectionTitle
                      title="Afbeelding"
                      description="Wordt automatisch gecomprimeerd bij upload"
                    />
                    <ImageUpload
                      value={editingItem.image_url ?? null}
                      onChange={(url) =>
                        setEditingItem({ ...editingItem, image_url: url })
                      }
                      onError={(msg) => showToast(msg, "error")}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 border-t border-espresso/10 px-4 py-4 sm:flex-row sm:px-6">
                  <button
                    type="button"
                    onClick={handleSaveItem}
                    disabled={saving}
                    className={btnPrimary}
                  >
                    {saving ? "Opslaan…" : "Opslaan"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className={btnSecondary}
                  >
                    Annuleren
                  </button>
                </div>
              </div>
            )}

            {/* Item list */}
            {categoryItems.length === 0 && !editingItem ? (
              <div className="rounded-2xl border border-dashed border-espresso/20 bg-cream/50 px-6 py-12 text-center">
                <p className="mb-1 font-medium text-espresso">
                  Deze categorie is nog leeg
                </p>
                <p className="mb-4 text-sm text-espresso-soft">
                  Voeg je eerste product toe aan {selectedCat.name_nl}
                </p>
                <button
                  type="button"
                  onClick={startNewItem}
                  className={btnPrimary}
                >
                  + Eerste item toevoegen
                </button>
              </div>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {categoryItems.map((item) => {
                  const isEditing = editingItem?.id === item.id;
                  return (
                    <li
                      key={item.id}
                      className={`overflow-hidden rounded-xl border bg-white transition-shadow ${
                        isEditing
                          ? "border-terracotta/50 ring-2 ring-terracotta/20"
                          : "border-espresso/10 hover:shadow-card"
                      }`}
                    >
                      <div className="flex gap-3 p-3">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-sand">
                          <Image
                            src={item.image_url ?? PLACEHOLDER_IMAGE}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-espresso">
                                {item.name_nl}
                              </p>
                              <p className="truncate text-xs text-espresso-soft">
                                {item.name_en}
                              </p>
                            </div>
                            {item.is_featured && (
                              <span
                                className="shrink-0 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-espresso"
                                title="Uitgelicht"
                              >
                                ★
                              </span>
                            )}
                          </div>
                          {item.price != null && (
                            <p className="mt-1 text-sm font-medium text-terracotta">
                              €{item.price.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex border-t border-espresso/5">
                        <button
                          type="button"
                          onClick={() => startEditItem(item)}
                          className="min-h-[44px] flex-1 text-sm font-medium text-espresso transition-colors hover:bg-sand"
                        >
                          Bewerken
                        </button>
                        <button
                          type="button"
                          onClick={() => requestDeleteItem(item)}
                          className="min-h-[44px] flex-1 border-l border-espresso/5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          Verwijderen
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirm !== null}
        title={confirm?.title ?? ""}
        message={confirm?.message ?? ""}
        loading={confirmLoading}
        onConfirm={handleConfirm}
        onCancel={() => !confirmLoading && setConfirm(null)}
      />
    </div>
  );
}
