import Request from "@/app/components/request";
import VillainListClient from "./VillainListClient"; // Import the new client component

export default async function Page() {
    const villainsData = await Request('villains');

    return (
      <div
        className="page-background-text"
        style={{ '--page-background-text-content': "'VILLAINS'" }}
      >
        <VillainListClient initialVillains={villainsData} />
      </div>
    );
  }