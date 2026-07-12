import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const revalidate = 86400;

const API_ROOT = process.env.STEPHEN_KING_API?.replace(/\/$/, "");
const SK_API = `${API_ROOT}/api`;
const GOOGLE_API = process.env.GOOGLE_API;
const GOOGLE_KEY = process.env.GOOGLE_BOOKS_API_KEY;

const cachePath = path.join(process.cwd(), "data", "enriched-books.json");

// In-memory cache to handle concurrent requests in the same process
let inMemoryCache: any[] | null = null;

function loadCache(): any[] {
  if (inMemoryCache) {
    return inMemoryCache;
  }
  try {
    if (fs.existsSync(cachePath)) {
      const fileData = fs.readFileSync(cachePath, "utf-8");
      inMemoryCache = JSON.parse(fileData || "[]");
      return inMemoryCache || [];
    }
  } catch (err) {
    console.error("Error loading cache file:", err);
  }
  inMemoryCache = [];
  return inMemoryCache;
}

function saveCache(cache: any[]) {
  inMemoryCache = cache;
  try {
    const dir = path.dirname(cachePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing cache file:", err);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || "12")));
    const query = searchParams.get("q") || "";
    const sort = searchParams.get("sort") || "TITLE_ASC";
    const res = await fetch(`${SK_API}/books`);

    if (!res.ok) {
      throw new Error(`Stephen King API ${res.status}`);
    }

    if (!GOOGLE_API) {
      throw new Error("Missing GOOGLE_API");
    }

    const data = await res.json();
    let records = data.data as any[];
    if (query) {
      const q = query.toLowerCase();
      records = records.filter(
        (book: any) =>
          book.Title
          ?.toLowerCase()
          .includes(q)
      );
    }

    switch (sort) {
      case "TITLE_ASC":
        records.sort((a, b) => a.Title.localeCompare(b.Title));
      break;

      case "TITLE_DESC":
        records.sort((a, b) => b.Title.localeCompare(a.Title));
      break;

      case "YEAR_ASC":
        records.sort((a, b) => (a.Year || 0) - (b.Year || 0));
        break;

      case "YEAR_DESC":
        records.sort((a, b) => (b.Year || 0) - (a.Year || 0));
      break;
    }

    const total = records.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const pageRecords = records.slice(start, start + limit);

    const cache = loadCache();
    let cacheUpdated = false;

    const books = await Promise.all(
      pageRecords.map(async (book: any) => {
        // Try to find in cache
        const cached = cache.find((c: any) =>
          c.id === book.id ||
          (book.ISBN && c.isbn === book.ISBN) ||
          (c.title === book.Title && c.year === book.Year)
        );

        if (cached) {
          return cached;
        }

        const fallback = {
          id: book.id,
          title: book.Title,
          year: book.Year,
          publisher: book.Publisher,
          isbn: book.ISBN,
          pageCount: book.Pages,
          notes: book.Notes || [],
          villains: book.villains || [],
          cover: null,
          categories: [],
          description: "No description available",
        };

        const queryStr = book.ISBN
          ? `isbn:${book.ISBN}`
          : `intitle:${book.Title} inauthor:Stephen King`;

        try {
          const params = new URLSearchParams({
            q: queryStr,
            maxResults: "1",
          });

          if (GOOGLE_KEY) {
            params.set("key", GOOGLE_KEY);
          }

          const gRes = await fetch(`${GOOGLE_API}?${params.toString()}`);

          if (!gRes.ok) {
            throw new Error(`Google Books ${gRes.status}`);
          }

          const gJson = await gRes.json();
          const info = gJson.items?.[0]?.volumeInfo;

          let coverUrl: string | null = null;
          if (info?.imageLinks?.thumbnail) {
            const volumeId = gJson.items?.[0]?.id;
            if (volumeId) {
              coverUrl = `https://books.google.com/books/publisher/content/images/frontcover/${volumeId}?fife=w400-h600&source=gbs_api`;
            } else {
              coverUrl = info.imageLinks.thumbnail
                .replace("http://", "https://")
                .replace("zoom=1", "zoom=0");
            }
          }

          const enriched = {
            ...fallback,
            description: info?.description ?? fallback.description,
            cover: coverUrl,
            categories: info?.categories || [],
          };

          cache.push(enriched);
          cacheUpdated = true;
          return enriched;
        } catch (err) {
          console.error("GOOGLE BOOK FAILED:", book.Title, err);
          return fallback;
        }
      })
    );

    if (cacheUpdated) {
      saveCache(cache);
    }

    return NextResponse.json({
      books,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (err) {
    console.error("BOOK ROUTE FAILED:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
