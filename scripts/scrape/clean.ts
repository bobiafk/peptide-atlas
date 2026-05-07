import fs from "node:fs/promises";
import path from "node:path";

import { DATA_DIR } from "./constants";

async function run(): Promise<void> {
  const targets = [
    "peptides.json",
    "categories.json",
    "comparisons.json",
    "providers.json",
    "errors.json",
  ];
  await Promise.all(
    targets.map(async (file) => {
      const abs = path.join(DATA_DIR, file);
      try {
        await fs.rm(abs);
      } catch {
        // Ignore missing files.
      }
    }),
  );
  console.log("Removed generated data files.");
}

void run();
