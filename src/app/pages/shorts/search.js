"use client";
import React, { useState } from "react";

export default function Search({data }) {
const [value, setValue] = useState("")
const [sorted, setSorted] = useState(false)
var results = data.data.filter( el => el.title.match(new RegExp(value,'gi')))

  
const sortAlphabetically = () => {   
    results.sort((a, b)=> a.title.localeCompare(b.title))        
}   
  
const handleChange = (e) => {
    setValue(e.target.value)
}

const Wiev = (data) => {
    return(
      <ul className="text-2xl py-4">
        {results.map((data) => (
          <li key={data.id} className="p-4 m-8 rounded-lg border-2 border-black">
            <b>ID:</b>                      {data.id}<br/>
            <b>Title:</b>                  {data.title}<br/>
            <b>Type:</b>                   {data.type}<br/>
            <div>
              {
                (data.originallyPublishedIn === "")? "": <div><b>Originally Published In:</b> {data.originallyPublishedIn}<br/></div>
              }
            </div>
            <b>Collected In:</b>            {data.collectedIn}<br/>     
            <b>Year:</b>                   {data.year}<br/>
            <div>
            {
              (data.notes.length === 0 | data.notes === undefined)? "" : <div><b>Notes: </b>{data.notes.map((notes)=> notes)}</div>

            }
            </div>
          </li>
        ))}
      </ul>
    )
  } 
    return (
        <div className="">
          <input  onChange={(e) => handleChange(e)} className="m-8 p-2 rounded-lg w-96"  type="search" placeholder="Search..."></input>
            <button className="p-2 rounded-lg hover:bg-black hover:text-white border-2 border-black w-96" onClick={() => sorted? setSorted(false):setSorted(true)}>Sort by Title</button>
              {sorted? <Wiev data={sortAlphabetically(results)}/> : <Wiev data={results}/>}
        </div>
    )
  }