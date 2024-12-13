
import Request from "@/app/components/request";
import Header from "@/app/components/header";

export default async function Page() {
    const data = await Request('https://stephen-king-api.onrender.com/api/villains')

    return (
      <div className="bg-amber-400">
        <Header title="STEPHEN KING VILLAINS"/>
        <div className="">
          <ul className="text-2xl">
            {data.data.map((data) => (
              <li key={data.id} className="p-4 m-8 rounded-lg border-2 border-black">
                <b>ID:</b> {data.id}<br/>
                <b>Name:</b> {data.name}<br/>
                <b>Gender:</b> {data.gender}<br/>
                <b>Status:</b> {data.status}<br/>
                <b>Notes:</b> {data.notes.map((notes)=> notes + "/ ")}<br/>
                <b>Books:</b> {data.books.map((books)=> books.title + "/ ")}<br/>
                <b>Shorts:</b> {data.shorts.map((shorts)=> shorts.title + "/ ")}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }