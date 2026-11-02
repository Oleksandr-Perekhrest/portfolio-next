// outsource dependencies
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export const geistRegular = await readFile(
    join(process.cwd(), "assets/og/Geist-Regular.ttf"),
);

export const geistBold = await readFile(
    join(process.cwd(), "assets/og/Geist-Bold.ttf"),
);
