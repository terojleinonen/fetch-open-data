import Link from 'next/link'

// Page component - Renders the main page with links to other sections.
export default function Page() {
console.log("app started...")
  
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-4xl">        
        <div className="text-6xl">
          <h1>Stephen King</h1>
        </div>
        <div>
          {/* Link to the books page */}
          <Link href="/pages/books">BOOKS</Link>
        </div>
        <div>
          {/* Link to the shorts page */}
          <Link href="/pages/shorts">SHORTS</Link>
        </div>
        <div>
          {/* Link to the villains page */}
          <Link href="/pages/villains">VILLAINS</Link>
        </div>
      </div>
    </div>
  )
}