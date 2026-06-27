"use client";

import { useEffect, useId, useRef } from "react";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const btnSecondary =
  "inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-espresso/15 bg-white px-4 py-2.5 text-sm font-medium text-espresso transition-colors hover:bg-sand disabled:opacity-50";

const btnDanger =
  "inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50";

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Verwijderen",
  cancelLabel = "Annuleren",
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  const titleId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    cancelRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Sluiten"
        className="absolute inset-0 bg-espresso/40 backdrop-blur-[2px]"
        onClick={onCancel}
        disabled={loading}
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md rounded-2xl border border-espresso/10 bg-cream p-6 shadow-elevated"
      >
        <h2
          id={titleId}
          className="font-heading text-lg font-semibold text-espresso"
        >
          {title}
        </h2>
        <p className="mt-2 text-sm text-espresso-soft">{message}</p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={loading}
            className={btnSecondary}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={btnDanger}
          >
            {loading ? "Bezig…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
};
