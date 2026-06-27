import sharp from "sharp";

const MAX_DIMENSION = 1200;
const WEBP_QUALITY = 80;

export async function compressMenuImage(input: Buffer): Promise<{
  buffer: Buffer;
  contentType: "image/webp";
  extension: "webp";
}> {
  const buffer = await sharp(input, { failOn: "error" })
    .rotate()
    .pipelineColorspace("rgb16")
    .toColorspace("srgb")
    .resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();

  const meta = await sharp(buffer).metadata();
  if (!meta.width || !meta.height) {
    throw new Error("Gecomprimeerde afbeelding is ongeldig");
  }

  return { buffer, contentType: "image/webp", extension: "webp" };
}
