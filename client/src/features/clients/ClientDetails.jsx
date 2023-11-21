import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { deleteClient } from '../../redux/clients/clientSlice'

import { API_URL } from '../../utils/apiUrl'

import { BsThreeDots } from "react-icons/bs"
import { BiEdit, BiTrash } from 'react-icons/bi'

import Modal from '../../components/Modal'
import ClientBill from './ClientBill'
import ClientCards from './ClientCards'

export default function ClientDetails({ clientId, setClientId }) {
    const { clients } = useSelector((state) => state.client)
    const { accessToken } = useSelector((state) => state.user) 
    const [actionsOpen, setActionsOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const dispatch = useDispatch()

    if(!clientId) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className='text-2xl font-semibold text-zinc-500 text-center'>Selectionnez un client pour commencer</p>
            </div>
        )
    }

    const client = clients.filter((item) => item._id === clientId)

    const handleAction = () => setActionsOpen(!actionsOpen)

    const handleEdit = () => {
        setEditOpen(!editOpen)
        setActionsOpen(!actionsOpen)
    }

    const handleDelete = async () => {
        setActionsOpen(!actionsOpen)
        try {
            const res = await fetch(`${API_URL}/clients/${clientId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            await res.json()
            if(res.success === false) {
                console.log(error)
            }
            dispatch(deleteClient(clientId))
            setClientId(undefined)
        } catch (error) {
            console.error(error)
        }
    }

  return (
        <div className="flex flex-col w-full">
            <div className="flex items-center justify-between w-full py-4 px-10 border-b border-b-zinc-200">
                <div className="flex items-start gap-2">
                    <div className="flex flex-col items-start">
                        <h1 className="text-blue-600 text-xl font-semibold">{client[0].name}</h1>
                        <p className="text-xs text-zinc-400">{client[0].email}</p>
                    </div>
                    {client[0].status 
                        ? <span className="bg-red-600">Montant dû</span>
                            : <span className="mt-1 bg-green-100 border border-green-600 text-green-600 rounded-md text-sm px-3 flex items-center justify-center">Rien à payer</span>
                    }
                </div>
                <div>
                    <div className="relative">
                        <BsThreeDots className="text-2xl cursor-pointer" onClick={handleAction}/>
                        {actionsOpen && (
                            <div className="bg-white shadow-md p-4 absolute right-0 top-6 w-48">
                                <div 
                                    onClick={handleEdit} 
                                    className='flex gap-2 items-center w-full hover:bg-zinc-200 rounded-md py-1 px-3 cursor-pointer'
                                >
                                    <BiEdit />
                                    <p className="text-sm">Mettre à jour</p>
                                </div>
                                <div 
                                    onClick={handleDelete} 
                                    className='mt-2 flex gap-2 items-center w-full hover:bg-zinc-200 rounded-md py-1 px-3 cursor-pointer'
                                >
                                    <BiTrash />
                                    <p className="text-sm">Spprimer</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="p-4 flex flex-col gap-10">
                <ClientBill />
                <ClientCards />
            </div>
        </div>
      )
}
      
