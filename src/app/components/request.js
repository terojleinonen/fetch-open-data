export default async function Request(parameter, options = {}) {
    const { skipGoogleBooks = false } = options;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    const url = 'https://stephen-king-api.onrender.com/api/';
    const headers = new Headers({
      "User-Agent": "fetch-open-data/1.0"
    });
    let data;

    console.log(`[Request] Initiating request for parameter: "${parameter}", skipGoogleBooks: ${skipGoogleBooks}`);

    try {
      const response = await fetch(url + parameter, headers);
      if (!response.ok) {
        console.error(`[Request] Primary API error: Status ${response.status} for ${url + parameter}`);
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      data = await response.json();
      console.log(`[Request] Primary API data received for "${parameter}"`);

      // Fetch additional details from Google Books API
      if (!skipGoogleBooks && data && data.data && (parameter === 'books' || parameter.startsWith('book/'))) {
        console.log(`[Request] Starting Google Books API processing for "${parameter}". Attempting to process ${Array.isArray(data.data) ? data.data.length : 1} item(s).`);
        const booksToProcess = Array.isArray(data.data) ? data.data : [data.data];
        let booksProcessedCount = 0;

        const fetchGoogleBookDetails = async (book) => {
          const bookIdentifier = book.Title || book.ISBN || 'Unknown Book';
          console.log(`[Request] Processing Google Books details for: ${bookIdentifier}`);

          if (typeof book !== 'object' || book === null || (!book.ISBN && !book.Title)) {
            console.warn(`[Request] Insufficient data to fetch Google Books details for item:`, book);
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
            console.warn(`[Request] Should not happen: No ISBN or Title for Google Books API call for ${bookIdentifier}`);
            book.coverImageUrl = "NO_COVER_AVAILABLE";
            book.largeCoverImageUrl = "NO_COVER_AVAILABLE";
            book.googleBooksDataAvailable = false;
            return;
          }

          if (googleBooksApiUrl && apiKey) {
            googleBooksApiUrl += `&key=${apiKey}`;
          } else if (googleBooksApiUrl && !apiKey) {
            if (!global.apiKeyWarningLogged) {
              console.warn("[Request] Google Books API key (NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY) is missing. Requests may fail or be rate-limited.");
              global.apiKeyWarningLogged = true;
            }
          }

          console.log(`[Request] Google Books API URL for ${bookIdentifier}: ${googleBooksApiUrl.replace(apiKey, "REDACTED_API_KEY")}`);

          try {
            const googleBooksResponse = await fetch(googleBooksApiUrl);
            if (!googleBooksResponse.ok) {
              console.error(`[Request] Google Books API error for ${bookIdentifier}: Status ${googleBooksResponse.status}, URL: ${googleBooksApiUrl.replace(apiKey, "REDACTED_API_KEY")}`);
              book.googleBooksDataAvailable = false;
              book.coverImageUrl = book.coverImageUrl || "NO_COVER_AVAILABLE";
              book.largeCoverImageUrl = book.largeCoverImageUrl || "NO_COVER_AVAILABLE";
              return;
            }
            const googleBooksData = await googleBooksResponse.json();

            if (googleBooksData.items && googleBooksData.items.length > 0) {
              console.log(`[Request] Google Books data found for ${bookIdentifier}`);
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
              console.log(`[Request] No Google Books items found for ${bookIdentifier} (URL: ${googleBooksApiUrl.replace(apiKey, "REDACTED_API_KEY")})`);
              book.googleBooksDataAvailable = false;
              if (!book.coverImageUrl) book.coverImageUrl = "NO_COVER_AVAILABLE";
              if (!book.largeCoverImageUrl) book.largeCoverImageUrl = "NO_COVER_AVAILABLE";
            }
          } catch (err) {
            console.error(`[Request] Error processing Google Books data for ${bookIdentifier} (URL: ${googleBooksApiUrl.replace(apiKey, "REDACTED_API_KEY")}): ${err.message}`, err);
            book.googleBooksDataAvailable = false;
            book.coverImageUrl = book.coverImageUrl || "NO_COVER_AVAILABLE";
            book.largeCoverImageUrl = book.largeCoverImageUrl || "NO_COVER_AVAILABLE";
          }
        };

        const processPromises = booksToProcess.map(async (item) => {
            if (typeof item === 'object' && item !== null && (item.ISBN || item.Title || parameter.startsWith('book/'))) {
                await fetchGoogleBookDetails(item);
                booksProcessedCount++;
            } else {
                console.log("[Request] Skipping non-book item for Google Books processing:", item);
            }
        });

        console.log(`[Request] Waiting for all Google Books API calls to complete for "${parameter}"...`);
        await Promise.all(processPromises);
        console.log(`[Request] All Google Books API calls completed for "${parameter}". ${booksProcessedCount} books were processed.`);
      } else {
        if (skipGoogleBooks) console.log(`[Request] Skipping Google Books API processing due to skipGoogleBooks=true for "${parameter}"`);
        else console.log(`[Request] Skipping Google Books API processing for "${parameter}" (no data or not applicable parameter)`);
      }
    } catch (err) {
      console.error(`[Request] Top-level error in Request component for "${parameter}": ${err.message}`, err);
      return { data: null, error: err.message };
    }
    console.log(`[Request] Finished request for parameter: "${parameter}"`);
    return data;
}