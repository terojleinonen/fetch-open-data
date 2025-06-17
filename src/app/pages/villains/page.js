import Request from "@/app/components/request";
import Header from "@/app/components/header";
import VillainListClient from "./VillainListClient"; // Import the new client component

export default async function Page() {
    const villainsData = await Request('villains');

    return (
      <div>
        <Header title="STEPHEN KING VILLAINS"/>
        <VillainListClient initialVillains={villainsData} />
      </div>
    );
  }