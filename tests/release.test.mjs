import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("uses the Vercel-compatible Next.js runtime", async () => {
  const packageJson = JSON.parse(await readFile(new URL("package.json", projectRoot), "utf8"));
  assert.equal(packageJson.scripts.dev, "next dev");
  assert.equal(packageJson.scripts.build, "next build");
  assert.equal(packageJson.scripts.start, "next start");
  assert.equal(packageJson.dependencies.next, "16.3.0");
  for (const removed of ["vinext", "wrangler", "@cloudflare/vite-plugin", "drizzle-orm"]) {
    assert.equal(packageJson.dependencies[removed] ?? packageJson.devDependencies[removed], undefined);
  }
});

test("configures release security headers", async () => {
  const config = await readFile(new URL("next.config.ts", projectRoot), "utf8");
  for (const header of ["Content-Security-Policy", "Strict-Transport-Security", "X-Content-Type-Options", "X-Frame-Options"]) {
    assert.match(config, new RegExp(header));
  }
  assert.match(config, /frame-ancestors 'none'/);
});

test("does not expose credentials or database clients in browser assets", async () => {
  const files = await collectFiles(new URL("../.next/static/", import.meta.url));
  const bundle = (await Promise.all(files.map((file) => readFile(file, "utf8").catch(() => "")))).join("\n");
  assert.doesNotMatch(bundle, /TMDB_READ_ACCESS_TOKEN|GOOGLE_BOOKS_API_KEY|drizzle-orm\/d1|cloudflare:workers/);
});

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directory);
    if (entry.isDirectory()) files.push(...await collectFiles(child));
    else if (/\.(?:js|css|html|json)$/.test(entry.name)) files.push(child);
  }
  return files;
}
