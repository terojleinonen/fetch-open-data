import Link from "next/link"

// Header component - Renders the header section of the page.
// It displays the page title and navigation links.
export default function Header({title}){ // title: The title to be displayed in the header.

    return(
    <div className="p-8">
        <div className="mb-8 py-4">
            <h1 className="text-xl font-extrabold text-center">{title}</h1>
        </div>
        <div>
             <div className="flex space-x-4 text-xl font-extrabold">
                {/* Link to the home page */}
                <Link href="/">HOME</Link>
                {/* Link to the books page */}
                <Link href="/pages/books">BOOKS</Link>
                {/* Link to the shorts page */}
                <Link href="/pages/shorts">SHORTS</Link>
                {/* Link to the villains page */}
                <Link href="/pages/villains">VILLAINS</Link>
            </div>
        </div>
    </div>
    )

}