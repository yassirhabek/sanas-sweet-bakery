import { MenuManager } from "@/components/admin/MenuManager";
import {
  getCategoriesAdmin,
  getMenuItemsAdmin,
} from "@/app/actions/menu";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div>
        <h1 className="mb-4 text-2xl font-semibold">Menu beheer</h1>
        <p className="text-sm text-gray-600">
          Supabase is niet geconfigureerd. Stel de omgevingsvariabelen in via{" "}
          <code>.env.local</code> en voer de database-migratie uit.
        </p>
      </div>
    );
  }

  const categories = await getCategoriesAdmin();
  const allItems = (
    await Promise.all(
      categories.map((c) => getMenuItemsAdmin(c.id)),
    )
  ).flat();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-espresso sm:text-3xl">
          Menu beheer
        </h1>
        <p className="mt-1 text-sm text-espresso-soft">
          Selecteer een categorie links, voeg producten toe of bewerk ze.
        </p>
      </div>
      <MenuManager
        initialCategories={categories}
        initialItems={allItems}
      />
    </div>
  );
}
