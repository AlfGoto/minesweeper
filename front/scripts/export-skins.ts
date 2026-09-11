import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { CellSkins } from "../src/features/skins/cells/skins";

const skins = Object.entries(CellSkins)
  .filter(([, skin]) => skin.slug && skin.name)
  .map(([id, skin]) => ({
    id,
    slug: skin.slug!,
    name: skin.name!,
  }));

const outDir = resolve(__dirname, "../../video/data");
mkdirSync(outDir, { recursive: true });
writeFileSync(
  resolve(outDir, "skins.json"),
  JSON.stringify(skins, null, 2) + "\n",
);

console.log(`Exported ${skins.length} skins -> video/data/skins.json`);
