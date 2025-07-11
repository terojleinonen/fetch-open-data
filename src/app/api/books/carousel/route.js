import { NextResponse } from 'next/server';
import Request from '@/app/components/request'; // Using path alias

const MAX_CAROUSEL_BOOKS = 10;

export async function GET() {
  console.log("[Carousel API] Received request.");
  try {
    // First, get the list of all book IDs or basic book info
    const listResponse = await Request('books');
    console.log("[Carousel API] Initial list response status:", listResponse ? 'received' : 'not received');


    if (listResponse.error || !listResponse.data || !Array.isArray(listResponse.data)) {
      console.error("[Carousel API] Error fetching initial book list for carousel:", listResponse.error || 'No data or data not an array');
      return NextResponse.json({ error: 'Failed to load books for carousel list' }, { status: 500 });
    }

    // Take a slice of books to be potentially shown in the carousel
    // Ensure we don't go out of bounds and handle cases with fewer books than MAX_CAROUSEL_BOOKS
    const booksToConsider = listResponse.data.slice(0, MAX_CAROUSEL_BOOKS);
    console.log(`[Carousel API] Considering ${booksToConsider.length} books for detailed fetch.`);

    const detailedCarouselBooks = [];

    for (const basicBook of booksToConsider) {
      if (basicBook.id) {
        console.log(`[Carousel API] Fetching details for book ID: ${basicBook.id} (Title: ${basicBook.Title})`);
        // Now fetch full details for each book. This will trigger Google Books API augmentation
        // if the Request utility is configured to do so for "book/:id" type requests.
        const detailResponse = await Request(`book/${basicBook.id}`);

        if (detailResponse && detailResponse.data) {
          console.log(`[Carousel API] Successfully fetched details for book ID: ${basicBook.id}. Cover: ${detailResponse.data.coverImageUrl}`);
          detailedCarouselBooks.push(detailResponse.data);
        } else {
          console.warn(`[Carousel API] Failed to get full details for carousel book ID: ${basicBook.id}. Response:`, JSON.stringify(detailResponse));
          // Optional: Push the basicBook data if detail fetch fails, so the carousel can still display something
          // detailedCarouselBooks.push(basicBook);
          // Or skip this book if details are crucial
        }
      } else {
         console.warn('[Carousel API] Book in list missing ID:', basicBook.Title || '(No Title)');
      }
    }

    console.log(`[Carousel API] Returning ${detailedCarouselBooks.length} detailed books.`);
    return NextResponse.json(detailedCarouselBooks);

  } catch (e) {
    console.error("[Carousel API] Critical error in /api/books/carousel:", e.message, e.stack);
    return NextResponse.json({ error: 'Internal server error in carousel API' }, { status: 500 });
  }
}
