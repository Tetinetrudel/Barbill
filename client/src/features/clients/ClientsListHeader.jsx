import React, { useState, useEffect } from 'react'

import { BsPersonPlus, BsSearch } from "react-icons/bs"

import ClientsFilter from './ClientsFilter'
import ClientAdd from './ClientAdd'

import Modal from '../../components/Modal'

function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

export default function ClientsListHeader({ clients, setFilteredClient }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [addClientOpen, setAddClientOpen] = useState(false)

    useEffect(() => {
        if(searchQuery === "") {
            setFilteredClient(clients)
        }
        const normalizedQuery = normalizeString(searchQuery)
        if(!clients) return
        const filtered = clients.filter((item) => normalizeString(item.name).includes(normalizedQuery)
        )
        setFilteredClient(filtered)
    }, [searchQuery, clients, setFilteredClient])

  return (
    <div className='flex flex-col gap-4 py-4 px-6'>
        <div>
            <h1 className='text-xl font-semibold text-blue-600'>Liste de client</h1>
        </div>
        <div className='flex items-center gap-3'>
            <div className='relative'>
                <BsSearch className='absolute top-1/2 -translate-y-1/2 left-2 text-sm'/>
                <input 
                    type="search" 
                    className="text-sm outline-none border-b border-b-zinc-300 focus:border-b-blue-600 pl-6 text-blue-600"
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <ClientsFilter clients={clients} setFilteredClient={setFilteredClient} />
            <button 
                className="bg-blue-600 hover:opacity-95 py-1 px-3 rounded-md text-white flex items-center justify-center"
                onClick={() => setAddClientOpen(!addClientOpen)}    
            >
                <BsPersonPlus />
            </button>
            {addClientOpen && (
                <Modal title="Ajouter un client" isModalOpen={addClientOpen} setIsModalOpen={setAddClientOpen}>
                    <ClientAdd setAddClientOpen={setAddClientOpen} />
                </Modal>
            )}
        </div>
    </div>
  )
}
