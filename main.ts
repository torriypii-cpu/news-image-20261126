// Entry point for the news-image-20261126 submission.
//
// The picture is finished before this program ever runs: it lives in
// entry.png, in the same directory as this file. The program's only
// job is to deliver that file to the output directory the grader
// names through MAKEFUN_OUTPUT_DIR (falling back to /output), with
// the checks done up front so a bad file fails loudly here instead
// of silently producing a broken entry. After copying, it proves the
// delivered file is byte-for-byte the source, so a truncated or
// corrupted copy can never pass as a valid entry.

import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, "entry.png");
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const targetPath = join(targetDir, "entry.png");

// The PNG signature every whole PNG starts with; a file without it
// is not the image the entry promises, however large it is.
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

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

// Refuse a file that does not even start as a PNG: the gate would
// reject it, and failing here names the cause instead.
const head = readFileSync(sourcePath).subarray(0, PNG_SIGNATURE.length);
if (!head.equals(PNG_SIGNATURE)) {
  throw new Error("entry.png does not start with the PNG signature; refusing to deliver it");
}

mkdirSync(targetDir, { recursive: true });
copyFileSync(sourcePath, targetPath);

// Prove the delivered copy is the source, byte for byte: a copy
// that silently truncated or corrupted the image must fail here,
// not surface as a broken entry at the gate.
const sourceHash = sha256(sourcePath);
const deliveredHash = sha256(targetPath);
if (sourceHash !== deliveredHash) {
  throw new Error(
    `delivered copy does not match the source (source sha256 ${sourceHash}, delivered ${deliveredHash})`,
  );
}

// Read the size back from the delivered copy, so the log line states
// what really landed in the output directory.
const deliveredSize = statSync(targetPath).size;
console.log(`entry.png delivered to ${targetPath}: ${deliveredSize} bytes (sha256 ${deliveredHash})`);
