import Link from 'next/link'
export default async function Page() {
console.log("app started...")
  
  return (
    <div className="flex justify-center items-center h-screen bg-amber-400">
      <div className="text-4xl">        
        <div className="text-6xl">
          <h1>Stephen King</h1>
        </div>
        <div>
          <Link href="/pages/books">BOOKS</Link>
        </div>
        <div>
          <Link href="/pages/shorts">SHORTS</Link>
        </div>
        <div>
          <Link href="/pages/villains">VILLAINS</Link>
        </div>
      </div>
    </div>
  )
}