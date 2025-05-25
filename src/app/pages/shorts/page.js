
import Request from "@/app/components/request";
import Header from "@/app/components/header";
import Search from "@/app/pages/shorts/search";

export default async function Page() {
  const data = await Request('shorts');
  console.log(data);

  
    return (
      <div>
        <Header title="STEPHEN KINGS SHORTS"/>
        <Search data={data} />  
      </div>
    )
  }