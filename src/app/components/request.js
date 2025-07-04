export default async function Request(parameter, options = {}) {
    const { skipGoogleBooks = false } = options;
    // Use GOOGLE_BOOKS_API_KEY (server-side environment variable)
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    let baseUrl = 'https://stephen-king-api.onrender.com/api/';
    const headers = new Headers({
      "User-Agent": "fetch-open-data/1.0"
    });
    let data;

    // console.log(`[INFO] Request: Initiating for "${parameter}", skipGoogleBooks: ${skipGoogleBooks}`);

    // Check if the request is for adaptations, and use the local API route
    if (parameter === 'adaptations') {
      // Determine if running on server or client to construct the correct base URL
      if (typeof window === 'undefined') {
        // Server-side: construct absolute URL
        const protocol = process.env.VERCEL_ENV === 'production' ? 'https' : 'http';
        const host = process.env.VERCEL_URL || 'localhost:3000'; // VERCEL_URL is provided by Vercel, fallback for local
        baseUrl = `${protocol}://${host}/api/`;
      } else {
        // Client-side: relative URL is fine
        baseUrl = '/api/';
      }
    }

    try {
      const finalUrl = baseUrl + parameter;
      const response = await fetch(finalUrl, headers);
      if (!response.ok) {
        console.error(`[ERROR] Request: Primary API error for "${parameter}" from URL "${finalUrl}": Status ${response.status}`);
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      data = await response.json();
      // console.log(`[INFO] Request: Primary API data received for "${parameter}"`);

      if (!skipGoogleBooks && data && data.data && (parameter === 'books' || parameter.startsWith('book/'))) {
        // console.log(`[INFO] Request: Starting Google Books API processing for "${parameter}". Items: ${Array.isArray(data.data) ? data.data.length : 1}`);
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
            // This path should ideally not be reached due to the check above
            book.coverImageUrl = "NO_COVER_AVAILABLE";
            book.largeCoverImageUrl = "NO_COVER_AVAILABLE";
            book.googleBooksDataAvailable = false;
            return;
          }

          if (googleBooksApiUrl && apiKey) {
            googleBooksApiUrl += `&key=${apiKey}`;
          } else if (googleBooksApiUrl && !apiKey) {
            if (!global.apiKeyWarningLogged) { // Log only once
              // Updated warning message to reflect the correct environment variable name
              console.warn("[WARN] Request: Google Books API key (GOOGLE_BOOKS_API_KEY) is missing for server-side requests in request.js. Requests may be rate-limited or fail.");
              global.apiKeyWarningLogged = true;
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
              book.infoLink = volumeInfo.infoLink || book.infoLink;
              book.previewLink = volumeInfo.previewLink || book.previewLink;

              if (volumeInfo.publisher) book.Publisher = volumeInfo.publisher;
              if (volumeInfo.pageCount) book.Pages = volumeInfo.pageCount;
              if (volumeInfo.publishedDate && typeof book.Year === 'number') {
                 const gbYear = parseInt(volumeInfo.publishedDate.substring(0,4));
                 if (!isNaN(gbYear)) book.Year = gbYear;
              }
            } else {
              // console.log(`[INFO] Request: No Google Books items found for "${bookIdentifier}"`);
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
            if (typeof item === 'object' && item !== null && (item.ISBN || item.Title || parameter.startsWith('book/'))) {
                await fetchGoogleBookDetails(item);
                booksProcessedCount++;
            }
        });
        
        await Promise.all(processPromises);
        // console.log(`[INFO] Request: Google Books API calls completed for "${parameter}". ${booksProcessedCount} items processed.`);
      }
    } catch (err) {
      console.error(`[ERROR] Request: Top-level error for "${parameter}": ${err.message}`, err);
      return { data: null, error: err.message }; // Ensure a consistent error structure
    }
    // console.log(`[INFO] Request: Finished for "${parameter}"`);
    return data;
}