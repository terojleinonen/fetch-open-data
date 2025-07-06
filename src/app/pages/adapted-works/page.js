import Request from "@/app/components/request";
import AdaptationListClient from "./AdaptationListClient"; // Import the new client component

export default async function Page() {
    console.log("[DEBUG] adapted-works/page.js: Fetching data...");
    // Fetch all necessary data in parallel
    const [adaptationsData, booksData, shortsData] = await Promise.all([
      Request('adaptations'),
      Request('books'),
      Request('shorts')
    ]);

    console.log("[DEBUG] adapted-works/page.js: Data fetched.");
    console.log(`[DEBUG] adaptationsData: ${adaptationsData ? `OK (items: ${adaptationsData.data?.length})` : 'Error or undefined'}`);
    console.log(`[DEBUG] booksData: ${booksData ? `OK (items: ${booksData.data?.length})` : 'Error or undefined'}`);
    console.log(`[DEBUG] shortsData: ${shortsData ? `OK (items: ${shortsData.data?.length})` : 'Error or undefined'}`);

    if (!adaptationsData || !booksData || !shortsData) {
      console.error("[ERROR] adapted-works/page.js: One or more datasets failed to load. Check Request logs.");
      // Optionally, you could return a dedicated error component here
    }

    return (
      <div
        className="page-background-text"
        style={{ '--page-background-text-content': "'ADAPTED WORKS'" }}
      >
        <AdaptationListClient
          initialAdaptations={adaptationsData}
          initialBooks={booksData}
          initialShorts={shortsData}
        />
      </div>
    )
  }
