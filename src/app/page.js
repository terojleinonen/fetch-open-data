import Link from 'next/link'
export default async function Page() {
console.log("app started...")
  
  return (
    <>
    <ul>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/books">Books</Link>
      </li>
      <li>
        <Link href="/shorts">Shorts</Link>
      </li>
    </ul>
      
    </>
  )
}