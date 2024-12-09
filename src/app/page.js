export default async function Page() {
  let data = await fetch('http://rajapinnat.ymparisto.fi/api/Hakemistorajapinta/1.0/odata/Tutkl')
  let posts = await data.json()
  console.log(posts.value[0].Nimi)
  return (
    <ul>
      {posts.value.map((post) => (
        <li key={post.Nro}>Tutkl_Id: {post.Tutkl_Id} Nro: {post.Nro} Nimi: {post.Nimi} ICES_rlabo: {post.ICES_rlabo} AikaMuutos: {post.AikaMuutos}</li>
      ))}
    </ul>
  )
}