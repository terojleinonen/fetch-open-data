import Request from "@/app/components/request";
import BookListClient from "./BookListClient"; // Import the new client component

export default async function Page() {
    const booksData = await Request('books'); // Renamed to booksData for clarity

    return (
      <div>
        <BookListClient initialBooks={booksData} /> {/* Pass data to client component */}
      </div>
    )
  }