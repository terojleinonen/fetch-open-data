import fs from "node:fs";
import { searchGoogleBooks } from "./google-books-client.mjs";

const works = JSON.parse(fs.readFileSync("data/works.json", "utf8"));
const outputPath = "data/google-books.json";
const records = {};
const retrievedAt = new Date().toISOString();
const normalize = (value) => String(value || "").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();

for (const work of works) {
  const result = await searchGoogleBooks(`intitle:${work.title} inauthor:Stephen King`, { maxResults: 8 });
  const match = (result.items || []).find((item) => {
    const info = item.volumeInfo || {};
    return normalize(info.title) === normalize(work.title) &&
      (info.authors || []).some((author) => normalize(author) === "stephen king");
  });
  if (!match) continue;

  const info = match.volumeInfo || {};
  records[work.id] = {
    workId: work.id,
    googleBooksId: match.id,
    title: info.title,
    authors: info.authors || [],
    publisher: info.publisher,
    publishedDate: info.publishedDate,
    pageCount: info.pageCount,
    industryIdentifiers: info.industryIdentifiers || [],
    language: info.language,
    recordUrl: info.infoLink || `https://books.google.com/books?id=${encodeURIComponent(match.id)}`,
    source: { provider: "Google Books", retrievedAt },
  };
}

fs.writeFileSync(outputPath, `${JSON.stringify({ schemaVersion: 1, generatedAt: retrievedAt, records }, null, 2)}\n`);
console.log(JSON.stringify({ works: works.length, matched: Object.keys(records).length, outputPath }, null, 2));
