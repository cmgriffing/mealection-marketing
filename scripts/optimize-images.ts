import fs from "fs-extra";
import path from "path";
import glob from "glob";
import sharp from "sharp";

const imageExtensions = ["jpeg", "jpg", "png", "gif", "webp"];

async function main() {
  const baseImagePath = path.resolve(process.cwd(), "app/images");

  const baseOptimizedImagePath = path.resolve(baseImagePath, "optimized");

  await fs.ensureDir(baseOptimizedImagePath);

  const optimizedImagePaths = glob.sync(`${baseOptimizedImagePath}/**/*`);

  const optimizedImagePathsMap = optimizedImagePaths.reduce(
    (map, imagePath, initialValue) => {
      map.set(imagePath, true);
      return map;
    },
    new Map<string, boolean>()
  );

  const rawImagePaths = glob.sync(
    `${baseImagePath}/**/*.{${imageExtensions.join(",")}}`,
    {
      ignore: "**/optimized/**/*",
    }
  );

  await Promise.all(
    rawImagePaths.map(async (rawImagePath) => {
      const optimizedImagePath = rawImagePath.replace(
        baseImagePath,
        baseOptimizedImagePath
      );
      if (!optimizedImagePathsMap.has(optimizedImagePath)) {
        await fs.ensureFile(optimizedImagePath);
        await sharp(rawImagePath).resize(1000).toFile(optimizedImagePath);
      }
    })
  );
}

main();
