export default async function Request(parameter) {
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
      if (data && data.data) {
        const booksToProcess = Array.isArray(data.data) ? data.data : [data.data];

        const fetchGoogleBookDetails = async (book) => {
          let googleBooksApiUrl;
          // Prioritize ISBN for more accurate results
          if (book.ISBN) {
            googleBooksApiUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${book.ISBN}`;
          } else if (book.Title) {
            // Add "Stephen King" to the query for title-based searches to improve accuracy
            googleBooksApiUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(book.Title)}+inauthor:Stephen%20King`;
          } else {
            // If no ISBN or Title, mark as unavailable and skip Google Books API call
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
            const googleBooksResponse = await fetch(googleBooksApiUrl, { next: { revalidate: 3600 } }); // Revalidate data every hour
            if (!googleBooksResponse.ok) {
              console.error(`Google Books API error: Status ${googleBooksResponse.status} for URL: ${googleBooksApiUrl}`);
              throw new Error(`Google Books API error: Status ${googleBooksResponse.status}`);
            }
            const googleBooksData = await googleBooksResponse.json();

            if (googleBooksData.items && googleBooksData.items.length > 0) {
              const volumeInfo = googleBooksData.items[0].volumeInfo;
              book.googleBooksDataAvailable = true;

              // Cover Images
              const imageLinks = volumeInfo.imageLinks;
              let rawCoverImageUrl = "NO_COVER_AVAILABLE";
              let rawLargeCoverImageUrl = "NO_COVER_AVAILABLE";

              if (imageLinks) {
                rawCoverImageUrl = imageLinks.thumbnail || imageLinks.smallThumbnail || "NO_COVER_AVAILABLE";
                // For large cover, try more specific ones first, then fall back to the chosen coverImageUrl
                rawLargeCoverImageUrl = imageLinks.medium || imageLinks.large || imageLinks.small || rawCoverImageUrl;
              }

              // Ensure HTTPS for coverImageUrl
              if (rawCoverImageUrl && typeof rawCoverImageUrl === 'string' && rawCoverImageUrl.startsWith('http://')) {
                book.coverImageUrl = rawCoverImageUrl.replace(/^http:\/\//i, 'https://');
              } else {
                book.coverImageUrl = rawCoverImageUrl;
              }

              // Ensure HTTPS for largeCoverImageUrl
              if (rawLargeCoverImageUrl && typeof rawLargeCoverImageUrl === 'string' && rawLargeCoverImageUrl.startsWith('http://')) {
                book.largeCoverImageUrl = rawLargeCoverImageUrl.replace(/^http:\/\//i, 'https://');
              } else {
                book.largeCoverImageUrl = rawLargeCoverImageUrl;
              }

              // Textual Information from Google Books - prioritize these if available
              book.subtitle = volumeInfo.subtitle || book.subtitle; // Keep original if Google's is undefined
              book.authors = volumeInfo.authors || book.authors; // Google's authors list
              book.publisher = volumeInfo.publisher || book.Publisher; // SK API uses "Publisher"
              book.publishedDate = volumeInfo.publishedDate || book.Year; // SK API uses "Year"
              book.description = volumeInfo.description || book.summary; // SK API uses "summary"
              book.pageCount = volumeInfo.pageCount || book.Pages; // SK API uses "Pages"
              book.categories = volumeInfo.categories || book.categories;
              book.averageRating = volumeInfo.averageRating || book.averageRating;
              book.ratingsCount = volumeInfo.ratingsCount || book.ratingsCount;
              book.language = volumeInfo.language || book.language;
              book.infoLink = volumeInfo.infoLink || book.infoLink;
              book.previewLink = volumeInfo.previewLink || book.previewLink;

              // Update original SK API fields if Google Books provides more specific data
              // For example, if SK API only had Year, and GB has full publishedDate
              if (volumeInfo.publisher) book.Publisher = volumeInfo.publisher;
              if (volumeInfo.pageCount) book.Pages = volumeInfo.pageCount;
              if (volumeInfo.publishedDate && typeof book.Year === 'number') {
                 const gbYear = parseInt(volumeInfo.publishedDate.substring(0,4));
                 if (!isNaN(gbYear)) book.Year = gbYear; // Update Year if GB provides a valid one
              }


            } else {
              // No items found in Google Books API response
              book.googleBooksDataAvailable = false;
              if (!book.coverImageUrl) book.coverImageUrl = "NO_COVER_AVAILABLE"; // Ensure placeholders if not set
              if (!book.largeCoverImageUrl) book.largeCoverImageUrl = "NO_COVER_AVAILABLE";
            }
          } catch (err) {
            console.error(`Error processing Google Books data for '${book.Title}' (URL: ${googleBooksApiUrl}): ${err.message}`);
            book.googleBooksDataAvailable = false;
            book.coverImageUrl = book.coverImageUrl || "NO_COVER_AVAILABLE"; // Preserve if already set by SK API, else placeholder
            book.largeCoverImageUrl = book.largeCoverImageUrl || "NO_COVER_AVAILABLE";
          }
        };

        const detailPromises = booksToProcess.map(book => fetchGoogleBookDetails(book));
        await Promise.all(detailPromises);
      }
    } catch (err) {
      console.error(`Error in Request component: ${err}`); // Log top-level errors
    }
    return data;
}