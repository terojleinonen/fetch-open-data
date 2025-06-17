import Request from "@/app/components/request";
import Header from "@/app/components/header";
import ShortListClient from "./ShortListClient"; // Import the new client component

export default async function Page() {
    const shortsData = await Request('shorts');

    return (
      <div>
        <Header title="STEPHEN KINGS SHORTS"/> {/* Keeping existing title */}
        <ShortListClient initialShorts={shortsData} /> {/* Pass data to client component */}
      </div>
    )
  }