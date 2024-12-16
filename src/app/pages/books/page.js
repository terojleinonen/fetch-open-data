
import Request from "@/app/components/request";
import Header from "@/app/components/header";
import Search from "@/app/components/search";

export default async function Page() {
    const data = await Request('books');

    const results = () => {
      return(
        <ul className="text-2xl">
            {data.data.map((data) => (
              <li key={data.id} className="p-4 m-8 rounded-lg border-2 border-black">
                <b>ID:</b>         {data.id}<br/>
                <b>Year:</b>       {data.Year}<br/>
                <b>Title:</b>      {data.Title}<br/>
                <b>Publisher:</b>  {data.Publisher}<br/>
                <b>ISBN:</b>       {data.ISBN}<br/>
                <b>Pages:</b>      {data.Pages}<br/>
                <b>Notes:</b>      {data.Notes.map((notes)=> notes)}<br/>
                <b>villains:</b>   {data.villains.map((villains)=> villains.name).join(', ')}

              </li>
            ))}
          </ul>
      )
    }

    return (
      <div className="bg-amber-400">
        <Header title="STEPHEN KING BOOKS"/>
        <Search data={data}/>
      </div>
    )
  }