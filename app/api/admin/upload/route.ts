import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { isAllowedMenuImage } from "@/lib/image/allowedMenuImage";
import { compressMenuImage } from "@/lib/image/compressMenuImage";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const isAuthenticated = await verifySession(request);
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Bestand te groot (max 5MB)" },
      { status: 400 },
    );
  }

  if (!isAllowedMenuImage(file)) {
    return NextResponse.json(
      { error: "Ongeldig bestandstype (JPEG, PNG, WebP of HEIC)" },
      { status: 400 },
    );
  }

  try {
    const input = Buffer.from(await file.arrayBuffer());
    const { buffer, contentType, extension } = await compressMenuImage(input);

    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
    const supabase = createAdminClient();

    const { error } = await supabase.storage
      .from("menu-images")
      .upload(fileName, new Uint8Array(buffer), { contentType, upsert: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("menu-images").getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Upload mislukt";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
