import Link from 'next/link'

// Page component - Renders the main page with links to other sections.
export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen bg-transparent">
      <div className="text-center"> {/* Changed text-4xl to text-center for better alignment of title and links */}
        <div> {/* Removed text-6xl from here */}
          <h1 className="text-6xl text-[var(--text-color)]">
            Stephen King Universe
          </h1>
        </div>
        <div className="mt-8"> {/* Added margin-top for spacing between title and links */}
          {/* Link to the books page */}
          <Link href="/pages/books" className="home-link text-2xl mx-4">BOOKS</Link> {/* Added text-2xl and mx-4 for better appearance */}
        </div>
        <div className="mt-4"> {/* Added margin-top for spacing between links */}
          {/* Link to the shorts page */}
          <Link href="/pages/shorts" className="home-link text-2xl mx-4">SHORTS</Link> {/* Added text-2xl and mx-4 */}
        </div>
        <div className="mt-4"> {/* Added margin-top for spacing between links */}
          {/* Link to the villains page */}
          <Link href="/pages/villains" className="home-link text-2xl mx-4">VILLAINS</Link> {/* Added text-2xl and mx-4 */}
        </div>
      </div>
    </div>
  )
}