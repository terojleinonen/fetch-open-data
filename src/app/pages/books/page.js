import BookListClient from "./BookListClient"; // Import the new client component
import booksData from "@/app/data/books.json";

export default function Page() {
    return (
      <div
        className="page-background-text"
        style={{ '--page-background-text-content': "'BOOKS'" }}
      >
        <BookListClient initialBooks={{ data: booksData }} /> {/* Pass data to client component */}
      </div>
    )
  }