"use client"
import { useState } from "react"
import Filter from "./filter"

export default function Search_Books({data}){
    const [value, setValue] = useState("")
    const [sorted, setSorted] = useState(false)
    var results = Filter(value, data)

    const sortAlphabetically = () => {
        results = results.sort((a, b)=> a.Title.localeCompare(b.Title))     
    }   

    const handleChange = (e) => {
        setValue(e.target.value)
    }

    const Wiev = (data) => {
        return(
          <ul className="text-2xl">
            {results.map((data) => (
              <li key={data.Title} className="p-4 m-8 rounded-lg border-2 border-black">
                <b>ID:</b>         {data.id}<br/>
                <b>Year:</b>       {data.Year}<br/>
                <b>Title:</b>      {data.Title}<br/>
                <b>Publisher:</b>  {data.Publisher}<br/>
                <b>ISBN:</b>       {data.ISBN}<br/>
                <b>Pages:</b>      {data.Pages}<br/>
                <b>Notes:</b>      {data.Notes.map((notes)=> (notes==="")? "n/a":notes)}<br/>
                <b>villains:</b>   {data.villains.map((villains)=> (villains.name==="")?"n/a":villains.name).join(' | ')}
              </li>
            ))}
          </ul>
        )
      }
          
    

    return(
        <>
            <input  onChange={(e) => handleChange(e)} className="p-2 m-8 rounded-lg border-2 border-black" type="search" placeholder="Search..."></input>
            <button className="p-2 rounded-lg border-2 border-black" onClick={() => setSorted(true)}>Sort by Title</button>
              {sorted? <Wiev data={sortAlphabetically(results)}/> : <Wiev data={results}/>}
        </>
    )
}