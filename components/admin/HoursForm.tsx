"use client";

import { useState } from "react";
import type { OpeningHours, SpecialHours } from "@/lib/supabase/types";
import {
  saveWeeklyHours,
  saveSpecialHours,
  deleteSpecialHours,
} from "@/app/actions/hours";
import { AdminToast } from "@/components/admin/AdminToast";
import {
  ConfirmModal,
  type ConfirmOptions,
} from "@/components/admin/ConfirmModal";

const DAY_LABELS = [
  "Maandag",
  "Dinsdag",
  "Woensdag",
  "Donderdag",
  "Vrijdag",
  "Zaterdag",
  "Zondag",
];

type Props = {
  initialWeekly: OpeningHours[];
  initialSpecial: SpecialHours[];
};

type Toast = { message: string; type: "success" | "error" };

const inputClass =
  "w-full min-h-[44px] rounded-lg border border-espresso/15 bg-white px-3 py-2.5 text-sm text-espresso focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20";

const btnPrimary =
  "inline-flex min-h-[44px] items-center justify-center rounded-lg bg-espresso px-4 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-espresso-soft disabled:opacity-50";

const btnDanger =
  "inline-flex min-h-[44px] items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50";

export function HoursForm({ initialWeekly, initialSpecial }: Props) {
  const [weekly, setWeekly] = useState(initialWeekly);
  const [special, setSpecial] = useState(initialSpecial);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [confirm, setConfirm] = useState<ConfirmOptions | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [newSpecial, setNewSpecial] = useState({
    date: "",
    open_time: "07:00",
    close_time: "18:00",
    is_closed: false,
    note_nl: "",
    note_en: "",
  });

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
  }

  async function handleSaveWeekly() {
    setSaving(true);
    try {
      await saveWeeklyHours(weekly);
      showToast("Weekschema opgeslagen");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Fout bij opslaan", "error");
    }
    setSaving(false);
  }

  async function handleAddSpecial() {
    if (!newSpecial.date) return;
    setSaving(true);
    try {
      await saveSpecialHours(newSpecial);
      setSpecial(
        [...special, { ...newSpecial, id: crypto.randomUUID() }].sort((a, b) =>
          a.date.localeCompare(b.date),
        ),
      );
      setNewSpecial({
        date: "",
        open_time: "07:00",
        close_time: "18:00",
        is_closed: false,
        note_nl: "",
        note_en: "",
      });
      showToast("Bijzondere datum toegevoegd");
      window.location.reload();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Fout", "error");
    }
    setSaving(false);
  }

  async function handleDeleteSpecial(id: string) {
    try {
      await deleteSpecialHours(id);
      setSpecial(special.filter((s) => s.id !== id));
      showToast("Verwijderd");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Fout", "error");
      throw e;
    }
  }

  function requestDeleteSpecial(entry: SpecialHours) {
    setConfirm({
      title: "Bijzondere datum verwijderen",
      message: `Openingstijden voor ${entry.date} worden permanent verwijderd. Dit kan niet ongedaan worden gemaakt.`,
      onConfirm: () => handleDeleteSpecial(entry.id),
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

  function updateDay(index: number, field: keyof OpeningHours, value: unknown) {
    setWeekly((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d)),
    );
  }

  return (
    <div className="space-y-8">
      {toast && (
        <AdminToast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}

      <section className="rounded-2xl border border-espresso/10 bg-cream p-4 shadow-card sm:p-6">
        <h2 className="font-heading mb-4 text-lg font-semibold text-espresso">
          Weekschema
        </h2>

        {/* Mobile: card layout */}
        <div className="space-y-3 sm:hidden">
          {weekly.map((day, i) => (
            <div
              key={day.day_of_week}
              className="rounded-xl border border-espresso/10 bg-white p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-medium text-espresso">
                  {DAY_LABELS[day.day_of_week]}
                </span>
                <label className="flex items-center gap-2 text-sm text-espresso-soft">
                  <input
                    type="checkbox"
                    checked={day.is_closed}
                    onChange={(e) =>
                      updateDay(i, "is_closed", e.target.checked)
                    }
                    className="h-5 w-5 rounded accent-terracotta"
                  />
                  Gesloten
                </label>
              </div>
              {!day.is_closed && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-xs text-espresso-soft">
                      Open
                    </label>
                    <input
                      type="time"
                      value={day.open_time?.slice(0, 5) ?? ""}
                      onChange={(e) =>
                        updateDay(i, "open_time", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-espresso-soft">
                      Sluit
                    </label>
                    <input
                      type="time"
                      value={day.close_time?.slice(0, 5) ?? ""}
                      onChange={(e) =>
                        updateDay(i, "close_time", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-espresso/10 text-left text-espresso-soft">
                <th className="pb-3 pr-4 font-medium">Dag</th>
                <th className="pb-3 pr-4 font-medium">Open</th>
                <th className="pb-3 pr-4 font-medium">Sluit</th>
                <th className="pb-3 font-medium">Gesloten</th>
              </tr>
            </thead>
            <tbody>
              {weekly.map((day, i) => (
                <tr
                  key={day.day_of_week}
                  className="border-b border-espresso/5"
                >
                  <td className="py-3 pr-4 font-medium text-espresso">
                    {DAY_LABELS[day.day_of_week]}
                  </td>
                  <td className="py-3 pr-4">
                    <input
                      type="time"
                      value={day.open_time?.slice(0, 5) ?? ""}
                      disabled={day.is_closed}
                      onChange={(e) =>
                        updateDay(i, "open_time", e.target.value)
                      }
                      className={inputClass}
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <input
                      type="time"
                      value={day.close_time?.slice(0, 5) ?? ""}
                      disabled={day.is_closed}
                      onChange={(e) =>
                        updateDay(i, "close_time", e.target.value)
                      }
                      className={inputClass}
                    />
                  </td>
                  <td className="py-3">
                    <input
                      type="checkbox"
                      checked={day.is_closed}
                      onChange={(e) =>
                        updateDay(i, "is_closed", e.target.checked)
                      }
                      className="h-5 w-5 rounded accent-terracotta"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={handleSaveWeekly}
          disabled={saving}
          className={`${btnPrimary} mt-4`}
        >
          {saving ? "Opslaan…" : "Weekschema opslaan"}
        </button>
      </section>

      <section className="rounded-2xl border border-espresso/10 bg-cream p-4 shadow-card sm:p-6">
        <h2 className="font-heading mb-4 text-lg font-semibold text-espresso">
          Bijzondere openingstijden
        </h2>

        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-espresso-soft">
              Datum
            </label>
            <input
              type="date"
              value={newSpecial.date}
              onChange={(e) =>
                setNewSpecial({ ...newSpecial, date: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <label className="flex min-h-[44px] items-end gap-3 pb-2.5 text-sm text-espresso">
            <input
              type="checkbox"
              checked={newSpecial.is_closed}
              onChange={(e) =>
                setNewSpecial({ ...newSpecial, is_closed: e.target.checked })
              }
              className="h-5 w-5 rounded accent-terracotta"
            />
            Hele dag gesloten
          </label>
          {!newSpecial.is_closed && (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso-soft">
                  Open
                </label>
                <input
                  type="time"
                  value={newSpecial.open_time}
                  onChange={(e) =>
                    setNewSpecial({ ...newSpecial, open_time: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso-soft">
                  Sluit
                </label>
                <input
                  type="time"
                  value={newSpecial.close_time}
                  onChange={(e) =>
                    setNewSpecial({ ...newSpecial, close_time: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </>
          )}
          <div>
            <label className="mb-1 block text-xs font-medium text-espresso-soft">
              Notitie (NL)
            </label>
            <input
              placeholder="bijv. Kerst"
              value={newSpecial.note_nl}
              onChange={(e) =>
                setNewSpecial({ ...newSpecial, note_nl: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-espresso-soft">
              Note (EN)
            </label>
            <input
              placeholder="e.g. Christmas"
              value={newSpecial.note_en}
              onChange={(e) =>
                setNewSpecial({ ...newSpecial, note_en: e.target.value })
              }
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddSpecial}
          disabled={saving || !newSpecial.date}
          className={`${btnPrimary} mb-6`}
        >
          Toevoegen
        </button>

        {special.length === 0 ? (
          <p className="text-sm text-espresso-soft">
            Geen bijzondere openingstijden ingesteld.
          </p>
        ) : (
          <ul className="space-y-2">
            {special.map((s) => (
              <li
                key={s.id}
                className="flex flex-col gap-2 rounded-xl border border-espresso/10 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-sm text-espresso">
                  <span className="font-medium">{s.date}</span>
                  {" — "}
                  {s.is_closed
                    ? "Gesloten"
                    : `${s.open_time?.slice(0, 5)} – ${s.close_time?.slice(0, 5)}`}
                  {s.note_nl && (
                    <span className="text-espresso-soft"> ({s.note_nl})</span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => requestDeleteSpecial(s)}
                  className={`${btnDanger} self-end sm:self-auto`}
                >
                  Verwijderen
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

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
