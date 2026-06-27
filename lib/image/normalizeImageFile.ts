function isHeicFile(file: Pick<File, "name" | "type">): boolean {
  if (file.type === "image/heic" || file.type === "image/heif") {
    return true;
  }

  return /\.heic$/i.test(file.name) || /\.heif$/i.test(file.name);
}

async function sniffHeic(file: File): Promise<boolean> {
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (
    header.length < 12 ||
    header[4] !== 0x66 ||
    header[5] !== 0x74 ||
    header[6] !== 0x79 ||
    header[7] !== 0x70
  ) {
    return false;
  }

  const brand = String.fromCharCode(header[8], header[9], header[10], header[11]);
  return /^(heic|heix|hevc|hevx|mif1|msf1)/.test(brand);
}

async function convertWithHeic2any(file: File): Promise<File> {
  const heic2any = (await import("heic2any")).default;
  const converted = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.92,
  });

  const blob = Array.isArray(converted) ? converted[0] : converted;
  const name = file.name.replace(/\.heif?$/i, ".jpg") || "image.jpg";

  return new File([blob], name, { type: "image/jpeg" });
}

async function reencodeViaCanvas(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });

  if (bitmap.width === 0 || bitmap.height === 0) {
    bitmap.close();
    throw new Error("Ongeldige afbeelding");
  }

  try {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Afbeelding kon niet worden verwerkt");
    }

    ctx.drawImage(bitmap, 0, 0);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) =>
          result
            ? resolve(result)
            : reject(new Error("Afbeelding kon niet worden geconverteerd")),
        "image/jpeg",
        0.92,
      );
    });

    const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
  } finally {
    bitmap.close();
  }
}

export async function normalizeImageFile(file: File): Promise<File> {
  try {
    return await reencodeViaCanvas(file);
  } catch {
    if (isHeicFile(file) || (await sniffHeic(file))) {
      return convertWithHeic2any(file);
    }
    throw new Error("Afbeelding kon niet worden gelezen");
  }
}
