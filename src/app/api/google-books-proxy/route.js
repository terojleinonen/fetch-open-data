// src/app/api/google-books-proxy/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const maxResults = searchParams.get('maxResults') || '20';
  const startIndex = searchParams.get('startIndex') || '0';
  const langRestrict = searchParams.get('langRestrict');
  const filter = searchParams.get('filter');
  const printType = searchParams.get('printType');
  const orderBy = searchParams.get('orderBy') || 'relevance';

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

  if (!q) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  if (!apiKey) {
    console.error("Google Books API Key (GOOGLE_BOOKS_API_KEY) is not configured in environment variables.");
    return NextResponse.json({ error: 'Server configuration error. API key missing.' }, { status: 500 });
  }

  let apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=${encodeURIComponent(maxResults)}&startIndex=${encodeURIComponent(startIndex)}&key=${apiKey}&orderBy=${encodeURIComponent(orderBy)}`;

  if (langRestrict) {
    apiUrl += `&langRestrict=${encodeURIComponent(langRestrict)}`;
  }
  if (filter) {
    apiUrl += `&filter=${encodeURIComponent(filter)}`;
  }
  if (printType) {
    apiUrl += `&printType=${encodeURIComponent(printType)}`;
  }

  try {
    const googleRes = await fetch(apiUrl);

    if (!googleRes.ok) {
      const errorData = await googleRes.json().catch(() => ({ message: googleRes.statusText }));
      console.error("Google Books API Error:", googleRes.status, errorData);
      return NextResponse.json(
        { error: `Google Books API error: ${googleRes.statusText}`, details: errorData },
        { status: googleRes.status }
      );
    }

    const data = await googleRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from Google Books API proxy:', error);
    return NextResponse.json({ error: 'Failed to fetch data due to a server error.' }, { status: 500 });
  }
}
