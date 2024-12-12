import Link from "next/link";
export default async function Page() {
    const url = 'https://stephen-king-api.onrender.com/api/shorts';
    const headers = new Headers({
      "User-Agent": "fetch-open-data/1.0"
    });
    const options = {
      method: 'GET',
      headers: headers
    };
    let data; 
  
    try {
      const responce = await fetch(url,headers);
      if (!responce.ok){
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      data = await responce.json();
  
    } catch (err) {
      console.log(err);
    }
    console.log(data)
    return (
      <>
        <div className="mb-8 py-4">
          <h1 className="text-xl font-extrabold text-center">STEPHEN KINGS SHORT STORIES</h1>
        </div>
        <div className="flex space-x-4 p-8 text-xl font-extrabold">
          <Link href="/">HOME</Link>
          <Link href="/books">BOOOKS</Link>
          <Link href="/villains">VILLAINS</Link>
        </div>
        <div className="">
          <ul className="text-2xl text-gray-500">
            {data.data.map((data) => (
              <li key={data.id} className="p-4 m-8 rounded-lg border-2 border-black">
                <b>ID:</b>                      {data.id}<br/>
                <b>title:</b>                  {data.title}<br/>
                <b>type:</b>                   {data.type}<br/>
                <b>originallyPublishedIn:</b>  {data.originallyPublishedIn}<br/>
                <b>collectedIn:</b>            {data.collectedIn}<br/>     
                <b>year:</b>                   {data.year}<br/>
                <b>Notes:</b>                  {data.notes.map((notes)=> notes)}
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }