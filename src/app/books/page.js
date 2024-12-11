
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
        <div className="mb-8 py-4 bg-slate-200 dark:bg-slate-500 ">
          <h1 className="text-xl font-extrabold text-center dark:text-black">{url}</h1>
        </div>
        <div className="">
          <ul className="flex flex-row flex-wrap justify-evenly text-lg text-gray-500">
            {data.data.map((data) => (
              <li key={data.id} className="p-4 mb-8 shadow-2xl">
                id: {data.id}<br/>
                Year: {data.Year}<br/>
                Title: {data.Title}<br/>
                Publisher: {data.Publisher}<br/>
                ISBN: {data.ISBN}<br/>
                Pages: {data.Pages}<br/>
                created_at: {data.created_at}<br/>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }