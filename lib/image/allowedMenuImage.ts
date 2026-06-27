export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

const ALLOWED_IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "heic",
  "heif",
]);

export function isAllowedMenuImage(file: Pick<File, "name" | "type">): boolean {
  if (
    (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(file.type)
  ) {
    return true;
  }

  const ext = file.name.toLowerCase().match(/\.([^.]+)$/)?.[1];
  return ext != null && ALLOWED_IMAGE_EXTENSIONS.has(ext);
}

export const IMAGE_UPLOAD_ACCEPT =
  "image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif,image/*";
