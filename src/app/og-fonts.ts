// outsource dependencies
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export const geistBold = await readFile(
    join(process.cwd(), "assets/og/Geist-Bold.ttf"),
);
