export default async function Request(source_url) {
    //const url = 'https://stephen-king-api.onrender.com/api/books';
    const url = source_url;
    const headers = new Headers({
      "User-Agent": "fetch-open-data/1.0"
    });
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
    return data;
}