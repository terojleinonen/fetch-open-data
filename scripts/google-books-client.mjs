const endpoint = "https://www.googleapis.com/books/v1/volumes";

export function googleBooksApiKey() {
  const key = process.env.GOOGLE_BOOKS_API_KEY?.trim();
  if (!key) {
    throw new Error(
      "GOOGLE_BOOKS_API_KEY is not configured. Add it to .env.local and load that file before running Google Books enrichment.",
    );
  }
  return key;
}

export async function searchGoogleBooks(query, options = {}) {
  const url = new URL(endpoint);
  url.searchParams.set("q", query);
  url.searchParams.set("key", googleBooksApiKey());
  url.searchParams.set("maxResults", String(options.maxResults ?? 10));
  url.searchParams.set("printType", "books");
  url.searchParams.set("projection", "full");

  const response = await fetch(url, {
    headers: { "User-Agent": "StephenKingUniverse-ScholarsEdition/1.0 (bibliographic enrichment)" },
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) {
    throw new Error(`Google Books API request failed (${response.status}).`);
  }
  return response.json();
}
