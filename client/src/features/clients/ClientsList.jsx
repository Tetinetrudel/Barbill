import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import ClientsListHeader from './ClientsListHeader'

export default function ClientsList({ setClientId }) {
    const { clients } = useSelector((state) => state.client)
    const [filteredClient, setFilteredClient] = useState([])

    const handleClientId = (clientId) => {
        setClientId(clientId)
        setFilteredClient(clients)
    }
    
    useEffect(() => {
        setFilteredClient(clients)
    }, [clients])

    return (
        <div className="h-full border-r border-r-zinc-200 flex flex-col gap-2">
            <ClientsListHeader clients={clients} setFilteredClient={setFilteredClient} />
            {!filteredClient.length && (
                <div className="mx-4">
                    <p>Aucun client</p>
                </div>
            )}
            {filteredClient && filteredClient.map((item, index) => (
                <div 
                    className="flex justify-between items-center pr-4 mx-4 hover:bg-zinc-100 rounded-md cursor-pointer"
                    key={index}
                    onClick={() => handleClientId(item._id)}
                >
                    <div className="flex item-center gap-1 py-2 px-4">
                        <span className="flex items-center justify-center text-sm font-semibold bg-zinc-400 rounded-md px-3">
                            {item.name.charAt(0)}
                        </span>
                        <div className='flex flex-col'>
                            <p className="text-sm font-semibold">{item.name}</p>
                            <p className="text-xs">{item.email}</p>
                        </div>
                    </div>
                    <div></div>
                </div>
            ))}
        </div>
  )
}
