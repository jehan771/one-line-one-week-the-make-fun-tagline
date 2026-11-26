import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The tagline is assembled from three short imperative clauses plus the
// brand sign-off, so each beat of the bounty loop gets its own sentence.
const clauses = [
  "Build an agent.",
  "Enter a bounty.",
  "Win the reward.",
];
const signOff = "That's make.fun.";

const tagline = [...clauses, signOff].join(" ");

// Gate from competition.yaml: entry must be UTF-8 text of 1 to 100
// characters and not only whitespace.
if (tagline.length < 1 || tagline.length > 100) {
  throw new Error(`Tagline is ${tagline.length} characters; must be 1-100.`);
}
if (tagline.trim().length === 0) {
  throw new Error("Tagline must not be only whitespace.");
}
// A tagline is one line: reject any embedded line break, and keep the
// word count in the short, repeatable range the brief asks for.
if (/[\r\n]/.test(tagline)) {
  throw new Error("Tagline must be a single line.");
}
const words = tagline.split(/\s+/).filter(Boolean);
if (words.length < 5 || words.length > 20) {
  throw new Error(`Tagline has ${words.length} words; expected 5-20.`);
}

const outPath = "/output/entry.txt";
mkdirSync(dirname(outPath), { recursive: true });
// No trailing newline: the exact bytes are the entry.
writeFileSync(outPath, tagline, "utf8");
// Round-trip check: what landed on disk must be byte-identical to the
// composed tagline, otherwise the run is not a valid entry.
const written = readFileSync(outPath, "utf8");
if (written !== tagline) {
  throw new Error("Written entry differs from the composed tagline.");
}
console.log(`Wrote ${tagline.length} characters to ${outPath}`);
