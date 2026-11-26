// Entry point for the news-image-20261126 submission.
//
// The picture is finished before this program ever runs: it lives in
// entry.png, in the same directory as this file. The program's only
// job is to deliver that file to the output directory the grader
// names through MAKEFUN_OUTPUT_DIR (falling back to /output), with
// the checks done up front so a bad file fails loudly here instead
// of silently producing a broken entry.

import { copyFileSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, "entry.png");
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const targetPath = join(targetDir, "entry.png");

// The artwork has to exist and hold something: copying a missing
// or empty file would only show up as a failed entry downstream.
let sourceSize: number;
try {
  sourceSize = statSync(sourcePath).size;
} catch {
  throw new Error(`cannot find entry.png next to main.ts (expected at ${sourcePath})`);
}
if (sourceSize === 0) {
  throw new Error("entry.png is present but holds 0 bytes; refusing to deliver an empty image");
}

// The competition caps the image at 1 MiB; rejecting an oversized
// file here, naming its actual size, is clearer than failing at the gate.
const MAX_ENTRY_BYTES = 1_048_576;
if (sourceSize > MAX_ENTRY_BYTES) {
  throw new Error(`entry.png is ${sourceSize} bytes, above the ${MAX_ENTRY_BYTES}-byte cap`);
}

mkdirSync(targetDir, { recursive: true });
copyFileSync(sourcePath, targetPath);

// Read the size back from the delivered copy, so the log line states
// what really landed in the output directory.
const deliveredSize = statSync(targetPath).size;
console.log(`entry.png delivered to ${targetPath}: ${deliveredSize} bytes`);
