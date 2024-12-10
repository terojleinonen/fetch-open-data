export default async function Page() {
  console.log("application started...");
  const source = 'http://rajapinnat.ymparisto.fi/api/Hakemistorajapinta/1.0/odata/Tutkl';
  let data;

  try {
    const responce = await fetch(source);
    if (!responce.ok){
      throw new Error(`HTTP error: Status ${response.status}`);
    }
    data = await responce.json();

  } catch (err) {
    console.log(err);
  }
  
  return (
    <>
      <div className="bg-slate-200 py-4">
        <h1 className="text-4xl font-extrabold text-center">{source}</h1>
        <input type="text" placeholder="Search..." autoComplete="off" className="text-3xl"/>
      </div>
      <div className="">
        <ul className="my-4 text-lg text-gray-500">
          {data.value.map((data) => (
            <li key={data.Nro}>Tutkl_Id: {data.Tutkl_Id} Nro: {data.Nro} Nimi: {data.Nimi} ICES_rlabo: {data.ICES_rlabo} AikaMuutos: {data.AikaMuutos}</li>
          ))}
        </ul>
      </div>
    </>
  )
}