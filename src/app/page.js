import Filterfield from "./filterfield";  

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
      <div className="py-4 bg-slate-200 dark:bg-slate-500 ">
        <h1 className="text-4xl font-extrabold text-center dark:text-black">{source}</h1>
        <Filterfield/>
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