import { HoursForm } from "@/components/admin/HoursForm";
import {
  getWeeklyHoursAdmin,
  getSpecialHoursAdmin,
} from "@/app/actions/hours";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminHoursPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div>
        <h1 className="mb-4 text-2xl font-semibold">Openingstijden</h1>
        <p className="text-sm text-gray-600">
          Supabase is niet geconfigureerd. Stel de omgevingsvariabelen in via{" "}
          <code>.env.local</code> en voer de database-migratie uit.
        </p>
      </div>
    );
  }

  const [weekly, special] = await Promise.all([
    getWeeklyHoursAdmin(),
    getSpecialHoursAdmin(),
  ]);

  return (
    <div>
      <h1 className="font-heading mb-6 text-2xl font-semibold text-espresso sm:text-3xl">
        Openingstijden
      </h1>
      <HoursForm initialWeekly={weekly} initialSpecial={special} />
    </div>
  );
}
