import { useState, useEffect } from 'react'

import ClientsTable from './ClientsTable'

import { BiSearch } from 'react-icons/bi'
import { BsPersonPlus } from "react-icons/bs";
import { TbFilterDown, TbFilterPlus, TbFilterUp } from "react-icons/tb"
import Modal from '../Modal';
import AddClient from './AddClient';

function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  }

export default function ClientsList({ clients, filteredClients, setFilteredClients, isUpdated, setIsUpdated }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
   
    useEffect(() => {
        const normalizedQuery = normalizeString(searchQuery)
        const filtered = clients.filter((item) =>
          normalizeString(item.name).includes(normalizedQuery)
        )
        setFilteredClients(filtered)
      }, [searchQuery])
    
    return (
        <section className="py-10 px-4 border-r-zinc-200 border-r h-full">
            <div className="flex flex-col gap-4">
                <h1 className="text-xl text-blue-600 font-bold">Clients</h1>
                <div className="flex gap-2 items-center">
                    <div className="relative w-48">
                        <BiSearch className="absolute top-1/2 -translate-y-1/2 left-2 text-blue-600 text-md"/>
                        <input 
                            onChange={(e) => setSearchQuery(e.target.value)}
                            type="search" 
                            className="w-full outline-none border border-zinc-200 rounded-md py-1 pl-6 bg-white text-sm text-zinc-600"
                            placeholder='Recherche'
                        />
                    </div>
                    <div className="border border-zinc-200 rounded-md p-1 flex justify-center items-center cursor-pointer relative">
                        <TbFilterPlus onClick={() => setIsFilterOpen(!isFilterOpen)} className='text-blue-600 text-md' />
                        {isFilterOpen && (
                            <div className="w-36 bg-white shadow-md rounded-md absolute top-8 right-0 p-2 flex flex-col gap-2">
                                <button className="flex gap-1 items-center hover:bg-zinc-100 py-1 px-2 rounded-md">
                                    <TbFilterDown className="text-xs text-zinc-600" />
                                    <p className="text-xs text-zinc-600">A-Z</p>
                                </button>
                                <button className="flex gap-1 items-center hover:bg-zinc-100 py-1 px-2 rounded-md">
                                    <TbFilterUp className="text-xs text-zinc-600" />
                                    <p className='text-xs text-zinc-600'>Z-A</p>
                                </button>
                                <button className="flex gap-1 items-center hover:bg-zinc-100 py-1 px-2 rounded-md">
                                    <TbFilterUp className="text-xs text-zinc-600" />
                                    <p className='text-xs text-zinc-600'>Sans facture</p>
                                </button>
                                <button className="flex gap-1 items-center hover:bg-zinc-100 py-1 px-2 rounded-md">
                                    <TbFilterUp className="text-xs text-zinc-600" />
                                    <p className='text-xs text-zinc-600'>Avec facture</p>
                                </button>
                            </div>
                        )}
                    </div>
                    <button 
                        className="bg-blue-600 hover:opacity-95 rounded-md py-1 px-3 flex justify-center items-center"
                        onClick={() => setIsModalOpen(!isModalOpen)}
                    >
                        <BsPersonPlus className="text-white text-md" />
                    </button>
                </div>
            </div>
            <ClientsTable filteredClients={filteredClients} />
            {isModalOpen && (
                <Modal title="Ajouter un client" isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
                    <AddClient setIsModalOpen={setIsModalOpen} isUpdated={isUpdated} setIsUpdated={setIsUpdated} />
                </Modal>
            )}
        </section>
    )
}