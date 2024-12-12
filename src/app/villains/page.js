import Link from "next/link";
export default async function Page() {
    const url = 'https://stephen-king-api.onrender.com/api/books';
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
    //console.log(data)
    return (
      <>
        <div className="mb-8 py-4">
          <h1 className="text-xl font-extrabold text-center">STEPHEN KING VILLAINS</h1>
        </div>
        <div className="flex space-x-4 p-8 text-xl font-extrabold">
          <Link href="/">HOME</Link>
          <Link href="/books">BOOKS</Link>
          <Link href="/shorts">SHORTS</Link>
        </div>
        <div className="">
          <ul className="text-2xl text-gray-500">
            {data.data.map((data) => (
              <li key={data.id} className="p-4 m-8 rounded-lg border-2 border-black">
                <b>ID:</b>             {data.id}<br/>
                <b>Year:</b>           {data.Year}<br/>
                <b>Title:</b>          {data.Title}<br/>
                <b>Publisher:</b>      {data.Publisher}<br/>
                <b>ISBN:</b>           {data.ISBN}<br/>
                <b>Pages:</b>          {data.Pages}<br/>
                <b>villains:</b>       
                  <ul>
                  {data.villains.map((villain)=> (
                    <li key={villain.name} className="px-4">
                      <b>{villain.name}</b> {villain.url}
                    </li>
                    ))}
                  </ul><br/>                  
                <b>Notes:</b>          {data.Notes.map((notes)=> notes)}
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }