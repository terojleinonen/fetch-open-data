import { NextResponse } from "next/server";

const SK_API =
  "https://stephen-king-api.onrender.com/api/books";

const GOOGLE_API =
  "https://www.googleapis.com/books/v1/volumes";

const GOOGLE_KEY =
  process.env.GOOGLE_BOOKS_API_KEY;

export async function GET() {
  try {
    const res = await fetch(SK_API, {
      next: {
        revalidate: 86400,
      },
    });

    if (!res.ok) {
      throw new Error(
        "Failed Stephen King API"
      );
    }

    const data = await res.json();

    const books = [];

    for (const book of data.data) {
      const query = book.ISBN
        ? `isbn:${book.ISBN}`
        : `intitle:${book.Title}+inauthor:Stephen+King`;

      try {
        const url =
          `${GOOGLE_API}?q=${encodeURIComponent(query)}` +
          `&maxResults=1&key=${GOOGLE_KEY}`;

        const gRes = await fetch(url, {
          next: {
            revalidate: 86400,
          },
        });

        if (!gRes.ok) {
          throw new Error(
            `Google Books ${gRes.status}`
          );
        }

        const gJson = await gRes.json();

        const info =
          gJson.items?.[0]?.volumeInfo;

        books.push({
          id: book.id,
          title: book.Title,
          year: book.Year,
          publisher: book.Publisher,
          isbn: book.ISBN,
          pageCount: book.Pages,

          notes: book.Notes || [],
          villains: book.villains || [],

          description:
            info?.description ??
            "No description available",

          cover:
            info?.imageLinks?.thumbnail
              ?.replace(
                "http://",
                "https://"
              )
              ?.replace(
                "zoom=1",
                "zoom=3"
              ) ?? null,

          categories:
            info?.categories || [],
        });

        // prevent rate bursts
        await new Promise((r) =>
          setTimeout(r, 120)
        );
      } catch (err) {
        console.error(
          "BOOK FAILED:",
          book.Title,
          err
        );

        books.push({
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

          description:
            "No description available",
        });
      }
    }

    return NextResponse.json({
      books,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}