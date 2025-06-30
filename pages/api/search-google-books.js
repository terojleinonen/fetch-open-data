export default async function handler(req, res) {
  const { q, maxResults = '20', startIndex = '0' } = req.query; // Added maxResults and startIndex
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  if (!apiKey) {
    console.error("Google Books API Key (GOOGLE_BOOKS_API_KEY) is not configured in environment variables.");
    return res.status(500).json({ error: 'Server configuration error. API key missing.' });
  }

  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=${encodeURIComponent(maxResults)}&startIndex=${encodeURIComponent(startIndex)}&key=${apiKey}`;

  try {
    const googleRes = await fetch(apiUrl);

    if (!googleRes.ok) {
      const errorData = await googleRes.json().catch(() => ({ message: googleRes.statusText })); // Try to parse error, fallback to statusText
      console.error("Google Books API Error:", googleRes.status, errorData);
      return res.status(googleRes.status).json({
        error: `Google Books API error: ${googleRes.statusText}`,
        details: errorData
      });
    }

    const data = await googleRes.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching from Google Books API proxy:', error);
    res.status(500).json({ error: 'Failed to fetch data due to a server error.' });
  }
}
