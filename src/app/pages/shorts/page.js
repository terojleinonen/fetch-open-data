import Request from "@/app/components/request";
import ShortListClient from "./ShortListClient"; // Import the new client component

export default async function Page() {
    const shortsData = await Request('shorts');

    return (
      <div>
        <ShortListClient initialShorts={shortsData} /> {/* Pass data to client component */}
      </div>
    )
  }