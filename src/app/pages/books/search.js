"use client"
import { useState } from "react"

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
          <ul className="text-2xl py-4">
            {results.map((data) => (
              <li key={data.Title} className="p-4 m-8 rounded-lg border-2 border-black">
                <b>ID:</b>         {data.id}<br/>
                <b>Year:</b>       {data.Year}<br/>
                <b>Title:</b>      {data.Title}<br/>
                <b>Publisher:</b>  {data.Publisher}<br/>
                <b>ISBN:</b>       {data.ISBN}<br/>
                <b>Pages:</b>      {data.Pages}<br/>
                <div>
                {(data.notes === "" | data.notes === undefined)? "" :
                  <div>
                    <b>Notes:</b> {data.Notes.map((notes)=> notes)}<br/>
                  </div>}
                </div>
                <div>
                {(data.villains.length === 0)?"" :
                  <div>
                  <b>Villains:</b> {data.villains.map((villains)=> villains.name).join(' | ')}
                  </div>}
                </div>
              </li>
            ))}
          </ul>
        )
      }   

    return(
        <div className="">
            <input  onChange={(e) => handleChange(e)} className="m-8 p-2 rounded-lg w-96"  type="search" placeholder="Search..."></input>
            <button className="p-2 rounded-lg hover:bg-black hover:text-white border-2 border-black w-96" onClick={() => sorted? setSorted(false):setSorted(true)}>Sort by Title</button>
              {sorted? <Wiev data={sortAlphabetically(results)}/> : <Wiev data={results}/>}
        </div>
    )
}