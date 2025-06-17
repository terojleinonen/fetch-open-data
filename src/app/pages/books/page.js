import Request from "@/app/components/request";
import Header from "@/app/components/header";
import BookListClient from "./BookListClient"; // Import the new client component

export default async function Page() {
    const booksData = await Request('books'); // Renamed to booksData for clarity

    return (
      <div>
        <Header title="STEPHEN KING BOOKS"/>
        <BookListClient initialBooks={booksData} /> {/* Pass data to client component */}
      </div>
    )
  }