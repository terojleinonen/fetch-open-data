import Request from "@/app/components/request";
import VillainListClient from "./VillainListClient"; // Import the new client component

export default async function Page() {
    const villainsData = await Request('villains');

    return (
      <div>
        <VillainListClient initialVillains={villainsData} />
      </div>
    );
  }