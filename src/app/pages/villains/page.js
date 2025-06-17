
import Request from "@/app/components/request";
import Header from "@/app/components/header";
import Link from "next/link"; // Added Link import
import { UNDERSCORE_NOT_FOUND_ROUTE } from "next/dist/shared/lib/constants";

export default async function Page() {
    const data = await Request('villains')
  
    return (
      <div>
        <Header title="STEPHEN KING VILLAINS"/>

        {/* Add button here */}
        <div className="flex justify-center my-4">
          <button
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            // onClick will be added in the next step
          >
            Get Random Villain
          </button>
        </div>

        <div className="">
          <ul className="text-2xl">
            {data.data.map((data) => (
              <li key={data.id} className="p-4 m-8 rounded-lg border-2 border-black">
                <b>ID:</b> {data.id}<br/>
                <b>Name:</b> <Link href={`/pages/villains/${data.id}`}>{data.name}</Link><br/> {/* Modified to include Link */}
                <b>Gender:</b> {(data.gender ===null)? "n/a":data.gender}<br/>
                <b>Status:</b> {data.status}<br/>
                <b>Notes:</b> {data.notes.map((notes)=> (notes ==="")? "n/a" : notes ).join(' | ')}<br/>
                <div>
                  {
                    (data.books.length === 0 | data.books === undefined)? "" :<div><b>Books:</b> {data.books.map((books)=> books.title).join(' | ')}<br/></div>
                  }
                </div>
                <div>
                  {
                    (data.shorts.length === 0 | data.shorts === undefined)? "" :<div><b>Shorts:</b> {data.shorts.map((shorts)=> shorts.title).join(' | ')}</div>
                  }
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }