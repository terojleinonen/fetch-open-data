"use client"
import { useState } from "react"
import Filter from "./filter"

export default function Search({data}){
    const [value, setValue] = useState("")

    const handleChange = (e) =>{
        setValue(e.target.value)
    }
    let results = Filter(value, data)
    console.log(results)

    return(
        <>
            <input  onChange={(e)=> handleChange(e)}className="m-8" type="text" placeholder="Search..."></input>
            <ul className="text-2xl">
            {results.map((data) => (
              <li key={data.id} className="p-4 m-8 rounded-lg border-2 border-black">
                <b>ID:</b>         {data.id}<br/>
                <b>Year:</b>       {data.Year}<br/>
                <b>Title:</b>      {data.Title}<br/>
                <b>Publisher:</b>  {data.Publisher}<br/>
                <b>ISBN:</b>       {data.ISBN}<br/>
                <b>Pages:</b>      {data.Pages}<br/>
                <b>Notes:</b>      {data.Notes.map((notes)=> notes)}<br/>
                <b>villains:</b>   {data.villains.map((villains)=> villains.name).join(', ')}

              </li>
            ))}
          </ul>
        </>
    )

}