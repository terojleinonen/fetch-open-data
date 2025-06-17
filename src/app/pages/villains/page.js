import Request from "@/app/components/request";
import Header from "@/app/components/header";


export default async function Page() {
    const villainsData = await Request('villains');

    return (
      <div>
        <Header title="STEPHEN KING VILLAINS"/>

      </div>
    );
  }