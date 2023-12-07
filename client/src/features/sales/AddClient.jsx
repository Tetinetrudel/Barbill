import { useState, useEffect } from 'react'

import { useSelector } from 'react-redux'

import { BiSearch, BiPlus } from 'react-icons/bi'
import { AiOutlineClose } from 'react-icons/ai'

import Modal from '../../components/Modal'
import ClientAdd from '../clients/ClientAdd'

export default function AddClient({ showAddClient, setShowAddClient, setSelectClient }) {
    const { clients } = useSelector((state) => state.client)
    const [searchValue, setSearchValue] = useState("")
    const [filteredClients, setFilteredClients] = useState(clients)
    const [addClientOpen, setAddClientOpen] = useState(false)

    const handleSearch = () => {}

    const handleSelectClient = (clientId) => {
        console.log(clientId)
        setSelectClient(clientId)
        setShowAddClient(false)
    }

  return (
    <div className={`w-[378px] bg-white absolute top-0 right-0 bottom-0 overflow-hidden`}>
        <div className="pt-10 px-10">
            <div 
                className="absolute top-10 right-4 p-1 rounded-md hover:bg-zinc-200 cursor-pointer transition-all delay-200 ease-in-out" 
                onClick={() => setShowAddClient(!showAddClient)}
            >
                <AiOutlineClose />
            </div>
            <div className="flex gap-1 items-center border-b border-b-zinc-200 bg-white w-64">
                <BiSearch className="text-blue-600 text-md cursor-pointer" onClick={handleSearch} />
                <input 
                    type="search" 
                    className="border-none outline-none focus:outline-none p-1 text-sm w-full" 
                    placeholder='Rechercher ...'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
        </div>
        {!clients && (
            <div>
                <p>Aucun client.</p>
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
        )}
        <div className="pt-10 px-10">
        {filteredClients && filteredClients.map((client) => (
            <div 
                key={client._id}
                className="flex items-center justify-between py-1 px-3 cursor-pointer hover:shadow-sm rounded-md"
                onClick={() => handleSelectClient(client._id)}
            >
                <p 
                key={client._id}
                className='mt-2 text-sm'
                >
                    {client.name}
                </p>
                <BiPlus />
            </div>
        ))}
        </div>
    </div>
  )
}
