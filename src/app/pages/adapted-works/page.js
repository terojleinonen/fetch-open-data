import Request from "@/app/components/request";
import AdaptationListClient from "./AdaptationListClient"; // Import the new client component

export default async function Page() {
    const adaptationsData = await Request('adaptations');

    return (
      <div
        className="page-background-text"
        style={{ '--page-background-text-content': "'ADAPTED WORKS'" }}
      >
        <AdaptationListClient initialAdaptations={adaptationsData} /> {/* Pass data to client component */}
      </div>
    )
  }
