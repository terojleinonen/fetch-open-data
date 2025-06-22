export default async function Request(parameter) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    const url = 'https://stephen-king-api.onrender.com/api/';
    const headers = new Headers({
      "User-Agent": "fetch-open-data/1.0"
    });
    let data; 
  
    try {
      const response = await fetch(url + parameter,headers);
      if (!response.ok){
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      data = await response.json();
  
      // Fetch cover images
      if (data && data.data) {
        const booksToProcess = Array.isArray(data.data) ? data.data : [data.data]; // Handle single book or array

        // Helper function to fetch cover for a single book
        const fetchCoverForBook = async (book) => {
          let googleBooksApiUrl;
          if (book.ISBN) {
            googleBooksApiUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${book.ISBN}`;
          } else if (book.Title) {
            googleBooksApiUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(book.Title)}`;
          } else {
            book.coverImageUrl = "NO_COVER_AVAILABLE";
            book.largeCoverImageUrl = "NO_COVER_AVAILABLE";
            return; // Skip if no ISBN or Title
          }

          // Append API key if available
          if (googleBooksApiUrl && apiKey) {
            googleBooksApiUrl += `&key=${apiKey}`;
          } else if (googleBooksApiUrl && !apiKey) {
            if (!global.apiKeyWarningLogged) {
              console.warn("Google Books API key (NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY) is missing. Requests may fail or be rate-limited.");
              global.apiKeyWarningLogged = true;
            }
          }

          try {
            // Use Next.js fetch with caching options
            const googleBooksResponse = await fetch(googleBooksApiUrl, { next: { revalidate: 3600 } }); // Revalidate cache every hour
            if (!googleBooksResponse.ok) {
              throw new Error(`Google Books API error: Status ${googleBooksResponse.status}`);
            }
            const googleBooksData = await googleBooksResponse.json();

            const imageLinks = googleBooksData?.items?.[0]?.volumeInfo?.imageLinks;
            if (imageLinks) {
              book.coverImageUrl = imageLinks.thumbnail || imageLinks.smallThumbnail || "NO_COVER_AVAILABLE";
              if (imageLinks.medium) {
                book.largeCoverImageUrl = imageLinks.medium;
              } else if (imageLinks.large) {
                book.largeCoverImageUrl = imageLinks.large;
              } else if (imageLinks.small) {
                book.largeCoverImageUrl = imageLinks.small;
              } else {
                book.largeCoverImageUrl = "NO_COVER_AVAILABLE";
              }
            } else {
              book.coverImageUrl = "NO_COVER_AVAILABLE";
              book.largeCoverImageUrl = "NO_COVER_AVAILABLE";
            }
          } catch (err) {
            console.log(`Error fetching cover for ${book.Title}: ${err.message}`);
            book.coverImageUrl = "NO_COVER_AVAILABLE";
            book.largeCoverImageUrl = "NO_COVER_AVAILABLE";
          }
        };

        // Create an array of promises for fetching all book covers
        const coverPromises = booksToProcess.map(book => fetchCoverForBook(book));

        // Wait for all cover fetch promises to resolve
        await Promise.all(coverPromises);
      }
    } catch (err) {
      console.log(err);
    }
    return data;
}