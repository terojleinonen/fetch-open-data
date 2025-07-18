import Request from '../src/app/components/request.js';
import { readFileSync, writeFileSync } from 'fs';

const books = JSON.parse(readFileSync('./src/app/data/books.json', 'utf-8'));

const fetchAllBooks = async () => {
  const allBooksData = [];
  for (const book of books) {
    const bookData = await Request(`book/${book.id}`);
    allBooksData.push(bookData.data);
  }
  writeFileSync('./src/app/data/books.json', JSON.stringify(allBooksData, null, 2));
};

fetchAllBooks();
