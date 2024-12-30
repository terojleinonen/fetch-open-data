
import Request from "@/app/components/request";
import Header from "@/app/components/header";

export default async function Page() {
    const data = await Request('villains')
  console.log(data)
    return (
      <div>
        <Header title="STEPHEN KING VILLAINS"/>
        <div className="">
          <ul className="text-2xl">
            {data.data.map((data) => (
              <li key={data.id} className="p-4 m-8 rounded-lg border-2 border-black">
                <b>ID:</b> {data.id}<br/>
                <b>Name:</b> {data.name}<br/>
                <b>Gender:</b> {(data.gender ===null)? "n/a":data.gender}<br/>
                <b>Status:</b> {data.status}<br/>
                <b>Notes:</b> {data.notes.map((notes)=> (notes ==="")? "n/a" : notes ).join(' | ')}<br/>
                <b>Books:</b> {data.books.map((books)=> (books.title === "")? "n/a" : books.title).join(' | ')}<br/>
                <b>Shorts:</b> {data.shorts.map((shorts)=> (shorts.title === "")? "n/a" : shorts.title).join(' | ')}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }