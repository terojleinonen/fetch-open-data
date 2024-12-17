
import Request from "@/app/components/request";
import Header from "@/app/components/header";
import Search from "@/app/components/search_books";

export default async function Page() {
    const data = await Request('books');

    return (
      <div className="bg-amber-400">
        <Header title="STEPHEN KING BOOKS"/>
        <Search data={data} />
      </div>
    )
  }