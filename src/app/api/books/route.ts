import { NextResponse } from "next/server";

export const revalidate = 86400;

const API_ROOT =  process.env.STEPHEN_KING_API?.replace(/\/$/, "");
const SK_API = `${API_ROOT}/api`;
const GOOGLE_API =  process.env.GOOGLE_API;
const GOOGLE_KEY =  process.env.GOOGLE_BOOKS_API_KEY;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1,Number(searchParams.get("page") || "1"));
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
    const totalPages = Math.max(1,Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const pageRecords = records.slice(start,start + limit);

    const books = await Promise.all(
      pageRecords.map(async (book: any) => {
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

        const query = book.ISBN
          ? `isbn:${book.ISBN}`
          : `intitle:${book.Title} inauthor:Stephen King`;

        try {
          const params = new URLSearchParams({
            q: query,
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

          return {
            ...fallback,
            description: info?.description ?? fallback.description,
            cover:
              info?.imageLinks?.thumbnail
                ?.replace("http://", "https://")
                ?.replace("zoom=1", "zoom=3") ?? null,
            categories: info?.categories || [],
          };
        } catch (err) {
          console.error("GOOGLE BOOK FAILED:", book.Title, err);
          return fallback;
        }
      })
    );

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