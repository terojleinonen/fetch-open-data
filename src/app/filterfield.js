'use client'
import { useState } from 'react'

export default function Filterfield(){
    const [userInput, setUserInput] = useState("");
    console.log(userInput);
    return(
        <input type="text" placeholder="Search..." autoComplete="off" className="text-3xl" onChange={ e =>{setUserInput(e.target.value)}}/>
    )
}