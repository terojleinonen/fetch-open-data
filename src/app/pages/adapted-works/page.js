import Request from "@/app/components/request";
import AdaptationListClient from "./AdaptationListClient"; // Import the new client component

export default async function Page() {
    // Fetch all necessary data in parallel
    const [adaptationsData, booksData, shortsData] = await Promise.all([
      Request('adaptations'),
      Request('books'),
      Request('shorts')
    ]);

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
