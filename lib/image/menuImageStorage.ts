import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "menu-images";

export function getMenuImagePathFromUrl(
  url: string | null | undefined,
): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const index = parsed.pathname.indexOf(marker);
    if (index === -1) return null;

    const path = decodeURIComponent(parsed.pathname.slice(index + marker.length));
    if (!path || path.includes("..")) return null;

    return path;
  } catch {
    return null;
  }
}

export async function deleteMenuImageByUrl(
  url: string | null | undefined,
): Promise<void> {
  const path = getMenuImagePathFromUrl(url);
  if (!path) return;

  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);

  if (error) {
    console.error(`Failed to delete menu image "${path}":`, error.message);
  }
}

export async function deleteMenuImagesByUrl(
  urls: Array<string | null | undefined>,
): Promise<void> {
  const paths = urls
    .map((url) => getMenuImagePathFromUrl(url))
    .filter((path): path is string => path != null);

  if (paths.length === 0) return;

  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(BUCKET).remove(paths);

  if (error) {
    console.error("Failed to delete menu images:", error.message);
  }
}
