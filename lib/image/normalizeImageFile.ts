function isHeicFile(file: Pick<File, "name" | "type">): boolean {
  if (file.type === "image/heic" || file.type === "image/heif") {
    return true;
  }

  return /\.heic$/i.test(file.name) || /\.heif$/i.test(file.name);
}

export async function normalizeImageFile(file: File): Promise<File> {
  if (!isHeicFile(file)) {
    return file;
  }

  const heic2any = (await import("heic2any")).default;
  const converted = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.9,
  });

  const blob = Array.isArray(converted) ? converted[0] : converted;
  const name = file.name.replace(/\.heif?$/i, ".jpg");

  return new File([blob], name, { type: "image/jpeg" });
}
