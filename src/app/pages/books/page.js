
import Request from "@/app/components/request";
import Header from "@/app/components/header";
import Search from "@/app/pages/books/search";

export default async function Page() {
    const data = await Request('books');
    console.log(data);

    return (
      <div>
        <Header title="STEPHEN KING BOOKS"/>
        <Search data={data} />
      </div>
    )
  }