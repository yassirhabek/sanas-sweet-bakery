import { ContactForm } from "@/components/admin/ContactForm";
import { getContactSettingsAdmin } from "@/app/actions/contact";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div>
        <h1 className="font-heading mb-4 text-2xl font-semibold text-espresso">
          Contactgegevens
        </h1>
        <p className="text-sm text-espresso-soft">
          Supabase is niet geconfigureerd. Stel de omgevingsvariabelen in via{" "}
          <code>.env.local</code> en voer de database-migratie uit.
        </p>
      </div>
    );
  }

  const settings = await getContactSettingsAdmin();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-espresso sm:text-3xl">
          Contactgegevens
        </h1>
        <p className="mt-1 text-sm text-espresso-soft">
          Adres, telefoon en e-mail op de contactpagina en in de footer.
        </p>
      </div>
      <ContactForm initialSettings={settings} />
    </div>
  );
}
