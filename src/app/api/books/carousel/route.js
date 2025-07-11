import { NextResponse } from 'next/server';
import OriginalRequest from '../../../components/request'; // Adjust path as necessary

const MAX_CAROUSEL_BOOKS = 10;

export async function GET() {
  try {
    // Call the original Request function, ensuring it runs server-side
    // The 'books' parameter is what BookCarousel was using
    const response = await OriginalRequest('books');

    if (response.error) {
      // Log the error server-side
      console.error("Error fetching books for carousel API:", response.error);
      // Return a generic error to the client
      return NextResponse.json({ error: 'Failed to load books' }, { status: 500 });
    }

    if (response.data && Array.isArray(response.data)) {
      // Select a subset of books for the carousel, similar to BookCarousel's original logic
      const carouselBooks = response.data.slice(0, MAX_CAROUSEL_BOOKS);
      return NextResponse.json(carouselBooks);
    } else {
      // This case should ideally be handled within OriginalRequest or result in an error there
      console.warn("Carousel API: No data or data is not an array from OriginalRequest.");
      return NextResponse.json([]); // Return empty array if no books
    }
  } catch (e) {
    console.error("Critical error in /api/books/carousel:", e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
