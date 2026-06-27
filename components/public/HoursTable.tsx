import type { OpeningHours, SpecialHours } from "@/lib/supabase/types";
import {
  getDayName,
  getEffectiveHours,
  formatHoursDisplay,
} from "@/lib/hours";

type HoursTableProps = {
  weekly: OpeningHours[];
  special: SpecialHours[];
  locale: string;
  closedLabel: string;
  showSpecial?: boolean;
  specialTitle?: string;
};

export function HoursTable({
  weekly,
  special,
  locale,
  closedLabel,
  showSpecial = false,
  specialTitle,
}: HoursTableProps) {
  const today = new Date();
  const currentDay = (today.getDay() + 6) % 7;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[240px] text-left text-sm sm:text-base">
          <tbody>
            {weekly.map((day) => {
              const testDate = new Date(today);
              const diff = day.day_of_week - currentDay;
              testDate.setDate(today.getDate() + diff);
              const effective = getEffectiveHours(testDate, weekly, special);
              const isToday = day.day_of_week === currentDay;

              return (
                <tr
                  key={day.day_of_week}
                  className={`border-b border-copper/15 ${
                    isToday ? "font-semibold text-terracotta" : ""
                  }`}
                >
                  <td className="py-2.5 pr-3 sm:py-3 sm:pr-4">
                    {getDayName(day.day_of_week, locale)}
                  </td>
                  <td className="py-2.5 text-right whitespace-nowrap sm:py-3">
                    {formatHoursDisplay(effective, locale, closedLabel)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showSpecial && special.length > 0 && (
        <div>
          <h3 className="font-heading mb-3 text-lg font-semibold text-deep-teal sm:mb-4 sm:text-xl">
            {specialTitle}
          </h3>
          <ul className="space-y-3">
            {special.map((s) => {
              const effective = getEffectiveHours(
                new Date(s.date + "T12:00:00"),
                weekly,
                [s],
              );
              const note = locale === "nl" ? s.note_nl : s.note_en;
              return (
                <li
                  key={s.id}
                  className="rounded-lg border border-gold/20 bg-sand/50 px-3 py-3 sm:bg-cream sm:px-4"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <span className="text-sm font-medium sm:text-base">
                      {new Date(s.date + "T12:00:00").toLocaleDateString(
                        locale === "nl" ? "nl-NL" : "en-GB",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </span>
                    <span className="text-sm whitespace-nowrap text-terracotta sm:text-base">
                      {formatHoursDisplay(effective, locale, closedLabel)}
                    </span>
                  </div>
                  {note && (
                    <p className="mt-1 text-xs text-espresso/60 sm:text-sm">
                      {note}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
