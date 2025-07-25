let apiKeyWarningLogged = false; // Module-scoped flag
const cache = new Map(); // In-memory cache

export default async function Request(parameter, options = {}) {
    // Check cache first
    if (cache.has(parameter)) {
        // console.log(`[INFO] Request: Cache hit for parameter: "${parameter}"`);
        return cache.get(parameter);
    }

    // console.log(`[INFO] Request: Cache miss for parameter: "${parameter}". Fetching from API.`);

    // skipGoogleBooks option removed, we will always try to augment book data.
    // Use GOOGLE_BOOKS_API_KEY (server-side environment variable)
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    let baseUrl = 'https://stephen-king-api.onrender.com/api/';
    const headers = new Headers({
      "User-Agent": "fetch-open-data/1.0"
    });
    let data;

    // All requests will now go to the external API, as adaptations.json is directly imported.
    // The special handling for 'adaptations' parameter to use a local API route is removed.
    // console.log(`[INFO] Request: Initiating for parameter: "${parameter}"`);

    const finalUrl = baseUrl + parameter;
    // console.log(`[INFO] Request: Attempting to fetch from finalUrl: ${finalUrl}`);

    try {
      const response = await fetch(finalUrl, headers);
      // console.log(`[INFO] Request: Response status for "${finalUrl}": ${response.status}`);
      if (!response.ok) {
        console.error(`[ERROR] Request: API error for "${parameter}" from URL "${finalUrl}": Status ${response.status}, StatusText: ${response.statusText}`);
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      data = await response.json();
      // console.log(`[INFO] Request: Primary API data received for "${parameter}"`);

      // Only process with Google Books API if it's a single book request (e.g., "book/:id")
      // For 'books' list, we skip this step to prevent mass API calls.
      // The augmentation for list items will be handled differently (e.g., on demand by the client).
      if (data && data.data && parameter.startsWith('book/')) {
        // console.log(`[INFO] Request: Starting Google Books API processing for single book: "${parameter}".`);
        // Ensure booksToProcess is always an array, even for a single book object.
        const booksToProcess = Array.isArray(data.data) ? data.data : [data.data];
        let booksProcessedCount = 0;

        const fetchGoogleBookDetails = async (book) => {
          const bookIdentifier = book.Title || book.ISBN || 'Unknown Book (in fetchGoogleBookDetails)';
          
          if (typeof book !== 'object' || book === null || (!book.ISBN && !book.Title)) {
            // console.warn(`[WARN] Request: Insufficient data for Google Books lookup: ${bookIdentifier}`);
            if (book && typeof book === 'object') {
                book.googleBooksDataAvailable = false;
                book.coverImageUrl = book.coverImageUrl || "NO_COVER_AVAILABLE";
                book.largeCoverImageUrl = book.largeCoverImageUrl || "NO_COVER_AVAILABLE";
            }
            return;
          }

          let googleBooksApiUrl;
          if (book.ISBN) {
            googleBooksApiUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${book.ISBN}`;
          } else if (book.Title) {
            googleBooksApiUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(book.Title)}+inauthor:Stephen%20King`;
          } else {
            book.coverImageUrl = "NO_COVER_AVAILABLE";
            book.largeCoverImageUrl = "NO_COVER_AVAILABLE";
            book.googleBooksDataAvailable = false;
            return;
          }

          if (googleBooksApiUrl && apiKey) {
            googleBooksApiUrl += `&key=${apiKey}`;
          } else if (googleBooksApiUrl && !apiKey) {
            if (!apiKeyWarningLogged) {
              console.warn("[WARN] Request: Google Books API key (GOOGLE_BOOKS_API_KEY) is missing for server-side requests in request.js. Requests may be rate-limited or fail.");
              apiKeyWarningLogged = true;
            }
          }
          
          try {
            const googleBooksResponse = await fetch(googleBooksApiUrl);
            if (!googleBooksResponse.ok) {
              console.error(`[ERROR] Request: Google Books API error for "${bookIdentifier}": Status ${googleBooksResponse.status}, URL: ${googleBooksApiUrl.replace(apiKey, "REDACTED_API_KEY")}`);
              book.googleBooksDataAvailable = false;
              book.coverImageUrl = book.coverImageUrl || "NO_COVER_AVAILABLE";
              book.largeCoverImageUrl = book.largeCoverImageUrl || "NO_COVER_AVAILABLE";
              return;
            }
            const googleBooksData = await googleBooksResponse.json();

            if (googleBooksData.items && googleBooksData.items.length > 0) {
              const volumeInfo = googleBooksData.items[0].volumeInfo;
              book.googleBooksDataAvailable = true;

              const imageLinks = volumeInfo.imageLinks;
              let finalCoverImageUrl = "NO_COVER_AVAILABLE";
              let finalLargeCoverImageUrl = "NO_COVER_AVAILABLE";

              if (imageLinks) {
                if (imageLinks.thumbnail) finalCoverImageUrl = imageLinks.thumbnail;
                else if (imageLinks.smallThumbnail) finalCoverImageUrl = imageLinks.smallThumbnail;

                if (imageLinks.medium) finalLargeCoverImageUrl = imageLinks.medium;
                else if (imageLinks.large) finalLargeCoverImageUrl = imageLinks.large;
                else if (imageLinks.small) finalLargeCoverImageUrl = imageLinks.small;
                else finalLargeCoverImageUrl = finalCoverImageUrl;
              }

              book.coverImageUrl = finalCoverImageUrl.startsWith('http://') ? finalCoverImageUrl.replace(/^http:\/\//i, 'https://') : finalCoverImageUrl;
              book.largeCoverImageUrl = finalLargeCoverImageUrl.startsWith('http://') ? finalLargeCoverImageUrl.replace(/^http:\/\//i, 'https://') : finalLargeCoverImageUrl;
              
              book.subtitle = volumeInfo.subtitle || book.subtitle;
              book.authors = volumeInfo.authors || book.authors;
              book.publisher = volumeInfo.publisher || book.Publisher;
              book.publishedDate = volumeInfo.publishedDate || book.Year;
              book.description = volumeInfo.description || book.summary;
              book.pageCount = volumeInfo.pageCount || book.Pages;
              book.categories = volumeInfo.categories || book.categories;
              book.averageRating = volumeInfo.averageRating || book.averageRating;
              book.ratingsCount = volumeInfo.ratingsCount || book.ratingsCount;
              book.language = volumeInfo.language || book.language;

              if (volumeInfo.publisher) book.Publisher = volumeInfo.publisher;
              if (volumeInfo.pageCount) book.Pages = volumeInfo.pageCount;
              if (volumeInfo.publishedDate && typeof book.Year === 'number') {
                 const gbYear = parseInt(volumeInfo.publishedDate.substring(0,4));
                 if (!isNaN(gbYear)) book.Year = gbYear;
              }
            } else {
              book.googleBooksDataAvailable = false;
              if (!book.coverImageUrl) book.coverImageUrl = "NO_COVER_AVAILABLE";
              if (!book.largeCoverImageUrl) book.largeCoverImageUrl = "NO_COVER_AVAILABLE";
            }
          } catch (err) {
            console.error(`[ERROR] Request: Error processing Google Books data for "${bookIdentifier}": ${err.message}`, err);
            book.googleBooksDataAvailable = false;
            book.coverImageUrl = book.coverImageUrl || "NO_COVER_AVAILABLE";
            book.largeCoverImageUrl = book.largeCoverImageUrl || "NO_COVER_AVAILABLE";
          }
        };

        const processPromises = booksToProcess.map(async (item) => {
            // Ensure we only process items that are actual book objects with necessary identifiers
            if (typeof item === 'object' && item !== null && (item.ISBN || item.Title)) {
                await fetchGoogleBookDetails(item);
                booksProcessedCount++;
            }
        });
        
        await Promise.all(processPromises);
        // console.log(`[INFO] Request: Google Books API calls completed for "${parameter}". ${booksProcessedCount} items processed.`);
        console.log(JSON.stringify(data, null, 2));
      }
      // Store successful response in cache
      // console.log(`[INFO] Request: Storing successful response for "${parameter}" in cache.`);
      cache.set(parameter, data);
    } catch (err) {
      console.error(`[ERROR] Request: Top-level error for "${parameter}": ${err.message}`, err);
      // Do not cache errors, return them directly
      return { data: null, error: err.message }; // Ensure a consistent error structure
    }
    // console.log(`[INFO] Request: Finished for "${parameter}"`);
    return data;
}