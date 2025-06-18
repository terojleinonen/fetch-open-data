"use client"
import { useState } from "react"
import Link from "next/link" // Added Link import

export default function Search({data}){
    const [value, setValue] = useState("")
    const [sorted, setSorted] = useState(false)
    var results = data.data.filter( el => el.Title.match(new RegExp(value,'gi')))

    const sortAlphabetically = () => {   
        results.sort((a, b)=> a.Title.localeCompare(b.Title))        
    }   

    const handleChange = (e) => {
        setValue(e.target.value)
    }

    const Wiev = (data) => {
        return(
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((data) => (
              <li key={data.Title} className="p-4 bg-gray-800 rounded-lg shadow hover:bg-gray-700 transition-colors">
                <h2 className="text-xl font-semibold text-purple-400">
                <Link href={`/pages/books/${data.id}`}>{data.Title}</Link><br/> {/* Modified line */}
                <p className="text-sm text-gray-400"><b>ISBN: </b>{data.ISBN}</p>
                </h2>
              </li>
            ))}
          </ul>
        )
      }   

    return(
      <div>
          <button className="p-2 rounded-lg hover:bg-black hover:text-white border-2 border-black" onClick={() => sorted? setSorted(false):setSorted(true)}>Sort by Title</button>
          <div className="mb-4 p-4 bg-gray-800 rounded-lg shadow w-full">
            <input  onChange={(e) => handleChange(e)} className=" p-2 rounded bg-gray-700 text-white w-full"  type="search books" placeholder="Search..."></input>
          </div>
              {sorted? <Wiev data={sortAlphabetically(results)}/> : <Wiev data={results}/>}
        </div>
    )
}