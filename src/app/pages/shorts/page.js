import Request from "@/app/components/request";
import ShortListClient from "./ShortListClient"; // Import the new client component

export default async function Page() {
    const shortsData = await Request('shorts');

    return (
      <div
        className="page-background-text"
        style={{ '--page-background-text-content': "'SHORT WORKS'" }}
      >
        <ShortListClient initialShorts={shortsData} /> {/* Pass data to client component */}
      </div>
    )
  }