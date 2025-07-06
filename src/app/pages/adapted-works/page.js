import Request from "@/app/components/request";
import AdaptationListClient from "./AdaptationListClient"; // Import the new client component
import adaptationsDataJson from '@/app/data/adaptations.json'; // Direct import

export default async function Page() {
    // Structure the directly imported adaptations data as if it came from Request
    const adaptationsData = { data: adaptationsDataJson };

    // Fetch other necessary data in parallel
    const [booksData, shortsData] = await Promise.all([
      Request('books'),
      Request('shorts')
    ]);

    // Basic check if fetched data seems valid, primarily for server-side issues.
    if (!booksData?.data || !shortsData?.data) {
      console.error("[ERROR] adapted-works/page.js: Books or Shorts data failed to load properly.");
      // Consider returning an error component or specific state to AdaptationListClient
    }

    return (
      <div
        className="page-background-text"
        style={{ '--page-background-text-content': "'ADAPTED WORKS'" }}
      >
        <AdaptationListClient
          initialAdaptations={adaptationsData} // Now using directly imported data
          initialBooks={booksData}
          initialShorts={shortsData}
        />
      </div>
    )
  }
