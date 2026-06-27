"use client";

import { useRef, useState } from "react";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import {
  IMAGE_UPLOAD_ACCEPT,
  isAllowedMenuImage,
} from "@/lib/image/allowedMenuImage";
import { normalizeImageFile } from "@/lib/image/normalizeImageFile";

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
  onError?: (message: string) => void;
};

export function ImageUpload({ value, onChange, onError }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  async function uploadFile(file: File) {
    if (!isAllowedMenuImage(file)) {
      onError?.("Alleen JPEG, PNG, WebP of HEIC toegestaan");
      return;
    }

    setUploading(true);
    try {
      const normalized = await normalizeImageFile(file);

      if (normalized.size > 5 * 1024 * 1024) {
        onError?.("Bestand te groot (max 5MB)");
        return;
      }

      if (normalized.size === 0) {
        onError?.("Afbeelding kon niet worden verwerkt");
        return;
      }

      const formData = new FormData();
      formData.append("file", normalized);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Upload mislukt");
      }

      if (data.url) {
        onChange(data.url);
      }
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Upload mislukt");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  return (
    <div className="space-y-3">
      {value && (
        <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-espresso/10 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          dragOver
            ? "border-terracotta bg-terracotta/5"
            : "border-espresso/15 bg-cream/50"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_UPLOAD_ACCEPT}
          onChange={handleFileSelect}
          disabled={uploading}
          className="sr-only"
          id="menu-image-upload"
        />

        {uploading ? (
          <p className="text-sm text-espresso-soft">Uploaden…</p>
        ) : (
          <>
            <p className="mb-1 text-sm font-medium text-espresso">
              Sleep een afbeelding hierheen
            </p>
            <p className="mb-3 text-xs text-espresso-soft">
              JPEG, PNG, WebP of HEIC · max 5MB · wordt gecomprimeerd
            </p>
            <label
              htmlFor="menu-image-upload"
              className="inline-flex min-h-[44px] cursor-pointer items-center rounded-lg bg-espresso px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-espresso-soft"
            >
              Kies bestand
            </label>
          </>
        )}
      </div>

      {value && (
        <button
          type="button"
          onClick={() => setConfirmRemove(true)}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Afbeelding verwijderen
        </button>
      )}

      <ConfirmModal
        open={confirmRemove}
        title="Afbeelding verwijderen"
        message="De afbeelding wordt van dit item verwijderd. Sla het item op om de wijziging door te voeren."
        confirmLabel="Verwijderen"
        onConfirm={() => {
          onChange(null);
          setConfirmRemove(false);
        }}
        onCancel={() => setConfirmRemove(false)}
      />
    </div>
  );
}
