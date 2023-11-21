import React from 'react'
import { useSelector } from 'react-redux'

export default function ClientsList({ setClientId }) {
    const { clients } = useSelector((state) => state.client)

    if(!clients) { 
        return (
            <p>client liste</p>
        )
    }

  return (
    <div className="h-full border-r border-r-zinc-200">
        {clients.map((item, index) => (
            <p 
                key={index}
                onClick={() => setClientId(item._id)}
            >{item.name}</p>
        ))}
    </div>
  )
}
