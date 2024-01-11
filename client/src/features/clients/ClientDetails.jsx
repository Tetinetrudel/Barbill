import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { deleteClient } from '../../redux/clients/clientSlice'

import { API_URL } from '../../utils/apiUrl'

import { BsThreeDots } from "react-icons/bs"
import { BiEdit, BiTrash } from 'react-icons/bi'
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";

import Modal from '../../components/Modal'
import ClientBill from './ClientBill'
import ClientCards from './ClientCards'
import ClientEdit from './ClientEdit'

export default function ClientDetails({ clientId, setClientId }) {
    const { clients } = useSelector((state) => state.client)
    const { accessToken } = useSelector((state) => state.user)
    const { currentUser } = useSelector((state) => state.user)
    const userId = currentUser._id
    const [actionsOpen, setActionsOpen] = useState(false)
    const [editClientOpen, setEditClientOpen] = useState(false)
    const dispatch = useDispatch()
    const menuRef = useRef()

    //popup menu functionnality
    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setActionsOpen(false)
        }
    }
    
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
          document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    //if no client founded, return something to prevent bug
    if(!clientId) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className='text-2xl font-semibold text-zinc-500 text-center'>Selectionnez un client pour commencer</p>
            </div>
        )
    }

    const client = clients.filter((item) => item._id === clientId)

    //Date and bill status functionnality
    const firstDate = client[0].bill.length > 0 ? new Date(client[0].bill[0].AddedAt) : null
    const today = new Date()
    const dateDiff = (today - firstDate) / (1000 * 3600 * 24)

    let since
    if(dateDiff > 0 && dateDiff < 30) {
        since = <span className="mt-1 bg-yellow-100 border border-yellow-600 text-yellow-600 rounded-md text-sm px-3 flex items-center justify-center">Montant dû</span>
    }

    if(dateDiff >= 30) {
        since = <span className="mt-1 bg-red-100 border border-red-600 text-red-600 rounded-md text-sm px-3 flex items-center justify-center">En souffrance</span>
    }

    //action made by clicking something
    const handleAction = () => setActionsOpen(!actionsOpen)

    const handleEdit = () => {
        setEditClientOpen(!editClientOpen)
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
            const data = await res.json()
            if(data.success === false) {
                alert(data.message)
                return
            }
            
            dispatch(deleteClient(clientId))
            setClientId(undefined)
        } catch (error) {
            console.error(error.message)
        }
    }


    const handleSendBill = async () => {
        try {
            const response = await fetch(`${API_URL}/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, clientId })
            });
  
            if (response.ok) {
                setActionsOpen(!actionsOpen)
            } else {
                console.error('Failed to send bill email.')
            }
        } catch (error) {
            console.error('Error sending bill:', error)
        }
    }
  
    //render the page on the web
  return (
        <div className="flex flex-col w-full h-full">
            <div className="flex items-center justify-between w-full py-4 px-10 border-b border-b-zinc-200">
                <div className="flex items-start gap-2">
                    <div className="flex flex-col items-start">
                        <h1 className="text-blue-600 text-xl font-semibold">{client[0].name}</h1>
                        <p className="text-xs text-zinc-400">{client[0].email}</p>
                    </div>
                    {client[0].status ? since 
                        : <span className="mt-1 bg-green-100 border border-green-600 text-green-600 rounded-md text-sm px-3 flex items-center justify-center">Rien à payer</span>
                    }
                </div>
                <div>
                    <div className="relative">
                        <BsThreeDots className="text-2xl cursor-pointer" onClick={handleAction}/>
                        {actionsOpen && (
                            <div className="bg-white shadow-md p-4 absolute right-0 top-6 w-48" ref={menuRef}>
                                <div 
                                    onClick={handleEdit} 
                                    className='flex gap-2 items-center w-full hover:bg-zinc-100 rounded-md py-1 px-3 cursor-pointer'
                                >
                                    <BiEdit />
                                    <p className="text-sm">Mettre à jour</p>
                                </div>
                                {dateDiff > 30 ? (
                                <div 
                                    onClick={handleSendBill} 
                                    className='mt-2 flex gap-2 items-center w-full hover:bg-zinc-100 rounded-md py-1 px-3 cursor-pointer'
                                >
                                    <LiaFileInvoiceDollarSolid />
                                    <p className="text-sm">Envoyer la facture</p>
                                </div>
                                ) : null }
                                <div 
                                    onClick={handleDelete} 
                                    className='mt-2 flex gap-2 items-center w-full hover:bg-zinc-100 rounded-md py-1 px-3 cursor-pointer'
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
                <ClientBill clientId={clientId} />
                <ClientCards clientId={clientId} />
            </div>
            {editClientOpen && (
                <Modal title="Modifier un client" isModalOpen={editClientOpen} setIsModalOpen={setEditClientOpen}>
                    <ClientEdit clientId={clientId} setEditClientOpen={setEditClientOpen} />
                </Modal>
            )}
        </div>
      )
}
      
