import Request from "@/app/components/request";
import BookListClient from "./BookListClient"; // Import the new client component

export default async function Page() {
    console.log("[INFO] /pages/books: Fetching books data...");
    let booksData;
    try {
      booksData = await Request('books');
      if (booksData && booksData.data) {
        console.log(`[INFO] /pages/books: Successfully fetched ${booksData.data.length} items.`);
      } else {
        console.warn("[WARN] /pages/books: Fetched data is missing 'data' property or is empty.");
        booksData = { data: [], error: "Data format error or no data returned." }; // Ensure booksData is an object
      }
    } catch (error) {
      console.error("[ERROR] /pages/books: Error fetching books data:", error);
      booksData = { error: "Failed to load book data due to an error.", data: [] };
    }

    return (
      <div
        className="page-background-text"
        style={{ '--page-background-text-content': "'BOOKS'" }}
      >
        <BookListClient initialBooks={booksData} /> {/* Pass data to client component */}
      </div>
    )
  }