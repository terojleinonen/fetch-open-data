import Link from "next/link"
export default function Header({title}){

    return(
    <div>
        <div className="mb-8 py-4">
            <h1 className="text-xl font-extrabold text-center">{title}</h1>
        </div>
        <div>
             <div className="flex space-x-4 text-xl font-extrabold">
                <Link href="/">HOME</Link>
                <Link href="/pages/books">BOOKS</Link>
                <Link href="/pages/shorts">SHORTS</Link>
                <Link href="/pages/villains">VILLAINS</Link>
            </div>
        </div>
    </div>
    )

}