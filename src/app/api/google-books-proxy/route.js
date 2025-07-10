// src/app/api/google-books-proxy/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const volumeId = searchParams.get('volumeId'); // New parameter for specific volume ID
  const maxResults = searchParams.get('maxResults') || '20';
  const startIndex = searchParams.get('startIndex') || '0';
  const langRestrict = searchParams.get('langRestrict');
  const filter = searchParams.get('filter');
  const printType = searchParams.get('printType');
  const orderBy = searchParams.get('orderBy') || 'relevance';

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  console.log("Attempting to use Google Books API Key. Is it present?", !!apiKey);

  if (!apiKey) {
    console.error("Google Books API Key (GOOGLE_BOOKS_API_KEY) is not configured in environment variables.");
    return NextResponse.json({ error: 'Server configuration error. API key missing.' }, { status: 500 });
  }

  let apiUrl;
  let logApiUrl;

  if (volumeId) {
    // Fetching a specific volume by ID
    if (volumeId.trim() === '') {
      console.error("Query parameter 'volumeId' is present but empty.");
      return NextResponse.json({ error: 'Query parameter "volumeId" cannot be empty' }, { status: 400 });
    }
    logApiUrl = `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(volumeId)}`;
    apiUrl = `${logApiUrl}?key=${apiKey}`;
    console.log("Constructed Google Books API URL for specific volume (excluding key for security):", logApiUrl);
  } else if (q) {
    // Performing a search query
    logApiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=${encodeURIComponent(maxResults)}&startIndex=${encodeURIComponent(startIndex)}&orderBy=${encodeURIComponent(orderBy)}`;
    if (langRestrict) logApiUrl += `&langRestrict=${encodeURIComponent(langRestrict)}`;
    if (filter) logApiUrl += `&filter=${encodeURIComponent(filter)}`;
    if (printType) logApiUrl += `&printType=${encodeURIComponent(printType)}`;

    apiUrl = `${logApiUrl}&key=${apiKey}`; // Add API key to the actual request URL
    // Note: logApiUrl for search already includes other params, so we form apiUrl by adding the key.
    // For safety, ensure all params are part of logApiUrl before adding key to apiUrl.
    // Rebuilding apiUrl for search to be certain:
    apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=${encodeURIComponent(maxResults)}&startIndex=${encodeURIComponent(startIndex)}&orderBy=${encodeURIComponent(orderBy)}`;
    if (langRestrict) apiUrl += `&langRestrict=${encodeURIComponent(langRestrict)}`;
    if (filter) apiUrl += `&filter=${encodeURIComponent(filter)}`;
    if (printType) apiUrl += `&printType=${encodeURIComponent(printType)}`;
    apiUrl += `&key=${apiKey}`;

    console.log("Constructed Google Books API URL for search (excluding key for security):", logApiUrl);
  } else {
    console.error("Query parameter 'q' or 'volumeId' is required.");
    return NextResponse.json({ error: 'Query parameter "q" or "volumeId" is required' }, { status: 400 });
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
