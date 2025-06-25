import Request from "@/app/components/request";
import BookListClient from "./BookListClient"; // Import the new client component

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default async function Page() {
    console.log("[/pages/books/page.js] Server Component execution started.");
    
    // Artificial delay for testing Vercel timing issues
    console.log("[/pages/books/page.js] Starting 2-second artificial delay...");
    await delay(2000);
    console.log("[/pages/books/page.js] Finished 2-second artificial delay.");

    let booksData;
    try {
      console.log("[/pages/books/page.js] Attempting to call Request('books').");
      booksData = await Request('books');
      console.log("[/pages/books/page.js] Call to Request('books') completed.");
      if (booksData && booksData.data) {
        console.log(`[/pages/books/page.js] Request('books') returned ${booksData.data.length} items in data.`);
      } else if (booksData) {
        console.log("[/pages/books/page.js] Request('books') returned data, but no 'data' property or it's empty:", booksData);
      } else {
        console.log("[/pages/books/page.js] Request('books') returned no data (undefined or null).");
      }
    } catch (error) {
      console.error("[/pages/books/page.js] Error during Request('books') call:", error);
      // Optionally, set booksData to a default error state to pass to client
      booksData = { error: "Failed to load book data.", data: [] };
    }

    console.log("[/pages/books/page.js] Preparing to render BookListClient.");
    return (
      <div>
        <BookListClient initialBooks={booksData} /> {/* Pass data to client component */}
      </div>
    )
  }