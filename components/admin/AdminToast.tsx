"use client";

type Props = {
  message: string;
  type?: "success" | "error";
  onDismiss?: () => void;
};

export function AdminToast({ message, type = "success", onDismiss }: Props) {
  if (!message) return null;

  const styles =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : "border-green-200 bg-green-50 text-green-800";

  return (
    <div
      role="alert"
      className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${styles}`}
    >
      <p className="min-w-0 flex-1">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 opacity-60 hover:opacity-100"
          aria-label="Sluiten"
        >
          ×
        </button>
      )}
    </div>
  );
}
