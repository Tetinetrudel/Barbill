import React, { useState } from 'react'

import { TbFilterDiscount, TbFilterDollar, TbFilterDown, TbFilterUp, TbFilterPlus, TbDotsCircleHorizontal } from "react-icons/tb"

export default function ClientsFilter({ clients, setFilteredClient }) {
    const [filterOpen, setFilterOpen] = useState(false)

    const handleAtoZ = () => {
        const filter = [].concat(clients).sort((a,b) => a.name > b.name ? 1 : -1)
        setFilteredClient(filter)
        setFilterOpen(!filterOpen)
    }

    const handleZtoA = () => {
        const filter = [].concat(clients).sort((a,b) => a.name < b.name ? 1 : -1)
        setFilteredClient(filter)
        setFilterOpen(!filterOpen)
    }

    const handleWithBill = () => {
        const filter = clients.filter((client) => client.status === true)
        setFilteredClient(filter)
        setFilterOpen(!filterOpen)
    }

    const handleWithNoBill = () => {
        const filter = clients.filter((client) => client.status === false)
        setFilteredClient(filter)
        setFilterOpen(!filterOpen)
    }

  return (
    <div className='relative bg-white hover:shadow-md border border-zinc-300 rounded-md p-1 cursor-pointer flex items-center justify-center'>
        <TbFilterPlus onClick={() => setFilterOpen(!filterOpen)}/>
        {filterOpen && (
            <div className="absolute top-10 right-0 border bg-white shadow-md p-2 rounded-md flex flex-col gap-1 justify-start w-36">
                <div 
                    className="flex items-center gap-2 rounded-md p-1 hover:bg-zinc-200 cursor-pointer"
                    onClick={handleAtoZ}
                >
                    <TbFilterDown className="text-sm text-zinc-600" />
                    <p className='text-xs text-zinc-600'>A à Z</p>
                </div>
                <div 
                    className="flex items-center gap-2 rounded-md p-1 hover:bg-zinc-200 cursor-pointer"
                    onClick={handleZtoA}    
                >
                    <TbFilterUp className="text-sm text-zinc-600" />
                    <p className='text-xs text-zinc-600'>Z à A</p>
                </div>
                <div 
                    className="flex items-center gap-2 rounded-md p-1 hover:bg-zinc-200 cursor-pointer"
                    onClick={handleWithNoBill}    
                >
                    <TbFilterDiscount className="text-sm text-zinc-600" />
                    <p className='text-xs text-zinc-600'>Sans facture</p>
                </div>
                <div 
                    className="flex items-center gap-2 rounded-md p-1 hover:bg-zinc-200 cursor-pointer"
                    onClick={handleWithBill}    
                >
                    <TbFilterDollar className="text-sm text-zinc-600" />
                    <p className='text-xs text-zinc-600'>Avec facture</p>
                </div>
            </div>
        )}
    </div>
  )
}
