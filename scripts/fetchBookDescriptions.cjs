const fs = require('fs');
const path = require('path');
const booksPath = path.join(__dirname, '..', 'src', 'app', 'data', 'books.json');
const books = require(booksPath);

// This is a placeholder for the actual API key.
// You should replace this with your actual Google Books API key.
const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

if (!apiKey) {
    console.error("Google Books API key is missing. Set the GOOGLE_BOOKS_API_KEY environment variable.");
    process.exit(1);
}

const fetchGoogleBookDetails = async (book) => {
    const bookIdentifier = book.Title || book.ISBN || 'Unknown Book';

    if (typeof book !== 'object' || book === null || (!book.ISBN && !book.Title)) {
        console.warn(`Insufficient data for Google Books lookup: ${bookIdentifier}`);
        return;
    }

    let googleBooksApiUrl;
    if (book.ISBN) {
        googleBooksApiUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${book.ISBN}`;
    } else {
        googleBooksApiUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(book.Title)}+inauthor:Stephen%20King`;
    }

    googleBooksApiUrl += `&key=${apiKey}`;

    try {
        const response = await fetch(googleBooksApiUrl);
        if (!response.ok) {
            console.error(`Google Books API error for "${bookIdentifier}": Status ${response.status}`);
            return;
        }
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const volumeInfo = data.items[0].volumeInfo;
            book.googleBooksDataAvailable = true;
            book.description = volumeInfo.description || book.description;
            book.subtitle = volumeInfo.subtitle || book.subtitle;
            book.authors = volumeInfo.authors || book.authors;
            book.publisher = volumeInfo.publisher || book.Publisher;
            book.publishedDate = volumeInfo.publishedDate || book.Year;
            book.pageCount = volumeInfo.pageCount || book.Pages;
            book.categories = volumeInfo.categories || book.categories;
            book.averageRating = volumeInfo.averageRating || book.averageRating;
            book.ratingsCount = volumeInfo.ratingsCount || book.ratingsCount;
            book.language = volumeInfo.language || book.language;

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

            console.log(`Successfully fetched data for ${book.Title}`);
        } else {
            book.googleBooksDataAvailable = false;
            console.log(`No data found for ${book.Title}`);
        }
    } catch (error) {
        console.error(`Error fetching Google Books data for "${bookIdentifier}":`, error);
    }
};

const updateBooks = async () => {
    for (const book of books) {
        await fetchGoogleBookDetails(book);
    }

    fs.writeFileSync(booksPath, JSON.stringify(books, null, 2));
    console.log('books.json has been updated.');
};

updateBooks();
