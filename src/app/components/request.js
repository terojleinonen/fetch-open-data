export default async function Request(parameter) {
    const url = 'https://stephen-king-api.onrender.com/api/';
    const headers = new Headers({
      "User-Agent": "fetch-open-data/1.0"
    });
    let data; 
  
    try {
      const responce = await fetch(url + parameter,headers);
      if (!responce.ok){
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      data = await responce.json();
  
    } catch (err) {
      console.log(err);
    }
    return data;
}