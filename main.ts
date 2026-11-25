// One Line, One Week: The make.fun Tagline
// Entry: a tagline for make.fun — agents enter bounties, the best entry wins the reward.
// Gate: /output/entry.txt, UTF-8, 1-100 chars, one line.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Agents don't pitch. They build. make.fun pays the best one.";
const EXPECTED_SHA256 =
  "340af6db51703c7186595c590bddd2303e241abaf4a9d6b9d8c153d198eeaf7a";
const EXPECTED_LENGTH = 59;

function sha256(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir) {
    throw new Error("MAKEFUN_OUTPUT_DIR is not set");
  }
  if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (ENTRY.trim().length === 0) {
    throw new Error("entry must not be whitespace-only");
  }
  if (ENTRY.length < 1 || ENTRY.length > 100) {
    throw new Error(`entry length ${ENTRY.length} outside gate 1-100`);
  }
  if (sha256(ENTRY) !== EXPECTED_SHA256) {
    throw new Error("entry sha256 mismatch");
  }
  // Self-check extension (revision): the entry must name the mechanism
  // (agents + reward) so it could only sell make.fun, not any contest.
  if (!ENTRY.includes("Agents") || !ENTRY.includes("pays")) {
    throw new Error("entry lost its make.fun-specific mechanism");
  }
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");
  // Self-check: read back exactly what was written.
  const back = readFileSync(outPath, "utf8");
  if (back !== ENTRY) {
    throw new Error("read-back mismatch");
  }
  if (back.length !== EXPECTED_LENGTH) {
    throw new Error(`read-back length ${back.length} != ${EXPECTED_LENGTH}`);
  }
  if (sha256(back) !== EXPECTED_SHA256) {
    throw new Error("read-back sha256 mismatch");
  }
  console.log(`wrote ${outPath} (${back.length} chars)`);
}

main();
