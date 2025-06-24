export default async function Request(parameter, options = {}) {
    const { skipGoogleBooks = false } = options;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    const url = 'https://stephen-king-api.onrender.com/api/';
    const headers = new Headers({
      "User-Agent": "fetch-open-data/1.0"
    });
    let data;

    try {
      const response = await fetch(url + parameter, headers);
      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      data = await response.json();

      // Fetch additional details from Google Books API
      // Conditionally skip if skipGoogleBooks is true or if the data isn't book-related
      if (!skipGoogleBooks && data && data.data && (parameter === 'books' || parameter.startsWith('book/'))) {
        const booksToProcess = Array.isArray(data.data) ? data.data : [data.data];

        const fetchGoogleBookDetails = async (book) => {
          // Ensure book is an object and has a Title or ISBN to proceed
          if (typeof book !== 'object' || book === null || (!book.ISBN && !book.Title)) {
            if (book && typeof book === 'object') {
                book.googleBooksDataAvailable = false;
                book.coverImageUrl = book.coverImageUrl || "NO_COVER_AVAILABLE";
                book.largeCoverImageUrl = book.largeCoverImageUrl || "NO_COVER_AVAILABLE";
            }
            return;
          }

          let googleBooksApiUrl;
          // Prioritize ISBN for more accurate results
          if (book.ISBN) {
            googleBooksApiUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${book.ISBN}`;
          } else if (book.Title) {
            // Add "Stephen King" to the query for title-based searches to improve accuracy
            googleBooksApiUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(book.Title)}+inauthor:Stephen%20King`;
          } else {
            // This case should ideally be caught by the check above
            book.coverImageUrl = "NO_COVER_AVAILABLE";
            book.largeCoverImageUrl = "NO_COVER_AVAILABLE";
            book.googleBooksDataAvailable = false;
            return;
          }

          if (googleBooksApiUrl && apiKey) {
            googleBooksApiUrl += `&key=${apiKey}`;
          } else if (googleBooksApiUrl && !apiKey) {
            if (!global.apiKeyWarningLogged) {
              console.warn("Google Books API key (NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY) is missing. Requests may fail or be rate-limited.");
              global.apiKeyWarningLogged = true; // Prevent logging this warning multiple times
            }
          }

          try {
            const googleBooksResponse = await fetch(googleBooksApiUrl); // Removed revalidate option
            if (!googleBooksResponse.ok) {
              console.error(`Google Books API error: Status ${googleBooksResponse.status} for URL: ${googleBooksApiUrl}`);
              // Do not throw error here to allow partial data processing, mark book as unavailable
              book.googleBooksDataAvailable = false;
              book.coverImageUrl = book.coverImageUrl || "NO_COVER_AVAILABLE";
              book.largeCoverImageUrl = book.largeCoverImageUrl || "NO_COVER_AVAILABLE";
              return; // Stop processing for this book if Google API fails
            }
            const googleBooksData = await googleBooksResponse.json();

            if (googleBooksData.items && googleBooksData.items.length > 0) {
              const volumeInfo = googleBooksData.items[0].volumeInfo;
              book.googleBooksDataAvailable = true;

              // Cover Images
              const imageLinks = volumeInfo.imageLinks;
              let finalCoverImageUrl = "NO_COVER_AVAILABLE";
              let finalLargeCoverImageUrl = "NO_COVER_AVAILABLE";

              if (imageLinks) {
                // Prioritize thumbnail, then smallThumbnail for standard cover
                if (imageLinks.thumbnail) {
                  finalCoverImageUrl = imageLinks.thumbnail;
                } else if (imageLinks.smallThumbnail) {
                  finalCoverImageUrl = imageLinks.smallThumbnail;
                }

                // Prioritize medium, then large, then small for large cover
                // Fall back to standard cover if specific large ones aren't available
                if (imageLinks.medium) {
                  finalLargeCoverImageUrl = imageLinks.medium;
                } else if (imageLinks.large) {
                  finalLargeCoverImageUrl = imageLinks.large;
                } else if (imageLinks.small) {
                  finalLargeCoverImageUrl = imageLinks.small;
                } else {
                  finalLargeCoverImageUrl = finalCoverImageUrl; // Fallback to the chosen standard cover
                }
              }

              // Ensure HTTPS
              if (finalCoverImageUrl && typeof finalCoverImageUrl === 'string' && finalCoverImageUrl.startsWith('http://')) {
                book.coverImageUrl = finalCoverImageUrl.replace(/^http:\/\//i, 'https://');
              } else {
                book.coverImageUrl = finalCoverImageUrl;
              }

              if (finalLargeCoverImageUrl && typeof finalLargeCoverImageUrl === 'string' && finalLargeCoverImageUrl.startsWith('http://')) {
                book.largeCoverImageUrl = finalLargeCoverImageUrl.replace(/^http:\/\//i, 'https://');
              } else {
                book.largeCoverImageUrl = finalLargeCoverImageUrl;
              }

              // Textual Information
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
              book.googleBooksDataAvailable = false;
              if (!book.coverImageUrl) book.coverImageUrl = "NO_COVER_AVAILABLE";
              if (!book.largeCoverImageUrl) book.largeCoverImageUrl = "NO_COVER_AVAILABLE";
            }
          } catch (err) {
            console.error(`Error processing Google Books data for '${book.Title || 'Unknown Title'}' (URL: ${googleBooksApiUrl}): ${err.message}`);
            book.googleBooksDataAvailable = false;
            book.coverImageUrl = book.coverImageUrl || "NO_COVER_AVAILABLE";
            book.largeCoverImageUrl = book.largeCoverImageUrl || "NO_COVER_AVAILABLE";
          }
        };

        // Ensure that we only attempt to process items that are likely books
        // This check is a bit broad, might need refinement based on actual API responses for non-book endpoints
        const processPromises = booksToProcess.map(item => {
            if (typeof item === 'object' && item !== null && (item.ISBN || item.Title || parameter.startsWith('book/'))) {
                return fetchGoogleBookDetails(item);
            }
            return Promise.resolve(); // Skip non-book items
        });
        await Promise.all(processPromises);
      }
    } catch (err) {
      console.error(`Error in Request component: ${err.message}`);
      // To ensure function returns something predictable in case of top-level error
      return { data: null, error: err.message };
    }
    return data;
}