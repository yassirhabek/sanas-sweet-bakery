const MAX_CLIENT_DIMENSION = 2048;

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

function fitDimensions(
  width: number,
  height: number,
  maxDimension: number,
): { width: number; height: number } {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height };
  }

  const scale = maxDimension / Math.max(width, height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

async function loadImageSource(
  file: File,
): Promise<{ source: CanvasImageSource; width: number; height: number; cleanup: () => void }> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    return {
      source: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      cleanup: () => bitmap.close(),
    };
  } catch {
    const objectUrl = URL.createObjectURL(file);
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Afbeelding kon niet worden geladen"));
        img.src = objectUrl;
      });

      return {
        source: image,
        width: image.naturalWidth,
        height: image.naturalHeight,
        cleanup: () => URL.revokeObjectURL(objectUrl),
      };
    } catch (error) {
      URL.revokeObjectURL(objectUrl);
      throw error;
    }
  }
}

async function reencodeViaCanvas(file: File): Promise<File> {
  const { source, width, height, cleanup } = await loadImageSource(file);

  if (width === 0 || height === 0) {
    cleanup();
    throw new Error("Ongeldige afbeelding");
  }

  try {
    const fitted = fitDimensions(width, height, MAX_CLIENT_DIMENSION);
    const canvas = document.createElement("canvas");
    canvas.width = fitted.width;
    canvas.height = fitted.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Afbeelding kon niet worden verwerkt");
    }

    ctx.drawImage(source, 0, 0, fitted.width, fitted.height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) =>
          result
            ? resolve(result)
            : reject(new Error("Afbeelding kon niet worden geconverteerd")),
        "image/jpeg",
        0.9,
      );
    });

    if (blob.size === 0) {
      throw new Error("Afbeelding kon niet worden geconverteerd");
    }

    const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
  } finally {
    cleanup();
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
