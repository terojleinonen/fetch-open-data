
import Request from "@/app/components/request";
import Header from "@/app/components/header";

export default async function Page() {
  const data = await Request('shorts');
  console.log(data);
    
    return (
      <div>
        <Header title="STEPHEN KINGS SHORTS"/>
        <div className="">
          <ul className="text-2xl">
            {data.data.map((data) => (
              <li key={data.id} className="p-4 m-8 rounded-lg border-2 border-black">
                <b>ID:</b>                      {data.id}<br/>
                <b>title:</b>                  {data.title}<br/>
                <b>type:</b>                   {data.type}<br/>
                <b>originallyPublishedIn:</b>  {(data.originallyPublishedIn === "")? "n/a" : data.originallyPublishedIn}<br/>
                <b>collectedIn:</b>            {data.collectedIn}<br/>     
                <b>year:</b>                   {data.year}<br/>
                <div>
                {
                  (data.notes.length === 0 | data.notes === undefined)? "" : <div><b>Notes: </b>{data.notes.map((notes)=> notes)}</div>

                }
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }