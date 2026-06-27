import sharp from "sharp";

const MAX_DIMENSION = 1200;
const WEBP_QUALITY = 80;

export async function compressMenuImage(input: Buffer): Promise<{
  buffer: Buffer;
  contentType: "image/webp";
  extension: "webp";
}> {
  const buffer = await sharp(input)
    .rotate()
    .resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();

  return { buffer, contentType: "image/webp", extension: "webp" };
}
