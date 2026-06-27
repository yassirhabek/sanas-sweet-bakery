import sharp from "sharp";

const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 82;

export async function compressMenuImage(input: Buffer): Promise<{
  buffer: Buffer;
  contentType: "image/jpeg";
  extension: "jpg";
}> {
  const buffer = await sharp(input, { failOn: "error" })
    .rotate()
    .resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();

  const meta = await sharp(buffer).metadata();
  if (!meta.width || !meta.height) {
    throw new Error("Gecomprimeerde afbeelding is ongeldig");
  }

  return { buffer, contentType: "image/jpeg", extension: "jpg" };
}
