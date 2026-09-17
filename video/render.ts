import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const force = process.argv.includes("--force");

type Skin = { slug: string; name: string };

const skinsPath = resolve(__dirname, "data/skins.json");
if (!existsSync(skinsPath)) {
  console.error(
    "data/skins.json missing. Run `npm run export-skins` first.",
  );
  process.exit(1);
}

const skins: Skin[] = JSON.parse(readFileSync(skinsPath, "utf-8"));

const formats: { compositionId: string; file: string }[] = [
  { compositionId: "SkinDemoTikTok", file: "tiktok.mp4" },
  { compositionId: "SkinDemoYouTube", file: "youtube.mp4" },
];

const tmpPropsPath = resolve(__dirname, ".tmp-props.json");

let rendered = 0;
let skipped = 0;

for (const skin of skins) {
  const skinOutDir = resolve(__dirname, "out", skin.slug);
  mkdirSync(skinOutDir, { recursive: true });

  for (const { compositionId, file } of formats) {
    const outPath = resolve(skinOutDir, file);
    if (existsSync(outPath) && !force) {
      console.log(`Skip ${skin.slug}/${file} (already rendered)`);
      skipped++;
      continue;
    }

    writeFileSync(tmpPropsPath, JSON.stringify({ skin }));
    console.log(`Render ${skin.slug}/${file}...`);
    execFileSync(
      resolve(__dirname, "node_modules/.bin/remotion"),
      [
        "render",
        "src/index.ts",
        compositionId,
        outPath,
        `--props=${tmpPropsPath}`,
      ],
      { cwd: __dirname, stdio: "inherit" },
    );
    rendered++;
  }
}

if (existsSync(tmpPropsPath)) rmSync(tmpPropsPath);

console.log(`\nDone. Rendered ${rendered}, skipped ${skipped} (already existed).`);
