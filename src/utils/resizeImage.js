import sharp from "sharp";

export const resizeImage = async ({ buffer, filepath }) => {
  try {
    const metadata = await sharp(buffer).metadata();
    const { width, height } = metadata;

    if (width <= 1080 && height <= 1080) {
      await sharp(buffer).toFile(filepath);
      return;
    }

    const resizeOptions = width > height ? { width: 1080 } : { height: 1080 };

    await sharp(buffer).resize(resizeOptions).toFile(filepath);
  } catch (error) {
    console.error("failed resize to image:", error.message);
  }
};
