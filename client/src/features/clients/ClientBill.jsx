import React, { useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { updateClient } from '../../redux/clients/clientSlice'

import Modal from '../../components/Modal'
import AddToBill from './AddToBill'

import { FaRegTrashAlt } from 'react-icons/fa'
import { BsCreditCard2Back } from "react-icons/bs"

import { API_URL } from '../../utils/apiUrl'

import ClipLoader from 'react-spinners/ClipLoader'

export default function ClientBill({ clientId }) {
    const [addToBillOpen, setAddToBillOpen] = useState(false)
    const { clients } = useSelector((state) => state.client)
    const { accessToken } = useSelector((state) => state.user)
    const client = clients.filter((item) => item._id === clientId)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const dispatch = useDispatch()

    const created = (date) => new Date(date).toLocaleString('fr-CA', { day: 'numeric', month: 'numeric', year: 'numeric'})
        
    const handleDelete = async (productId) => {
        try {
            setLoading(true)
            const response = await fetch(`${API_URL}/clients/${clientId}/remove`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ productId })
            })
            const data = await response.json()
            if(data.success === false) {
                setLoading(false)
                setError("data.message")
                return
            }
            setLoading(false)
            dispatch(updateClient(data))
        } catch (error) {
                setLoading(false)
                setError(error)
        }
    }

  return (
    <section>
        <div className="flex justify-between items-center">
          <h2 className="text-blue-600 font-semibold text-sm uppercase">facture</h2>
          <button 
            onClick={() => setAddToBillOpen(!addToBillOpen)}
            className="bg-blue-600 hover:opacity-95 hover:shadow-md py-1 px-4 flex items-center justify-center flex-none text-white rounded-md text-sm"
          >Ajouter</button>
        </div>
        <div className="shadow bg-white rounded-md p-4 h-auto w-full">
            <div className="grid grid-cols-12 text-xs font-bold mb-2">
                <div className='col-span-6 py-1 px-4'>Produit</div>
                <div className='col-span-2 py-1 px-4'>Date ajouté</div>
                <div className="col-span-2 py-1 px-4">Prix</div>
                <div className="col-span-1 py-1 px-4"></div>
            </div>
            {client[0].bill.length === 0 && (
                <div className="col-span-12 py-1 px-4 text-sm">
                    <p>Aucune facture en attente</p>
                </div>
            )}
            {client[0].bill.map((item) => (
                <div 
                    key={item._id}
                    className="grid grid-cols-12 hover:shadow-md mb-1 items-center"
                >
                    <div className="col-span-6 py-1 px-4 text-sm">{item.product.name}</div>           
                    <div className="col-span-2 py-1 px-4 text-sm">{created(item.AddedAt)}</div>
                    <div className="col-span-2 py-1 px-4 text-sm">{item.product.price.toFixed(2)} $</div>
                    <div className="col-span-1 ml-8 flex items-center justify-between w-full">
                        {loading ? <ClipLoader size={10} />
                            : <FaRegTrashAlt onClick={() => handleDelete(item._id)} className="cursor-pointer text-md text-red-600 hover:text-red-800" />
                        }
                        <BsCreditCard2Back className="text-lg text-blue-600 hover:text-blue-800 cursor-pointer" />
                      </div>
                </div>
            ))}
            <div className="grid grid-cols-12 text-sm font-bold mt-2">
                <div className='col-span-6 py-1 px-4'>Total</div>
                <div className='col-span-2 py-1 px-4'></div>
                <div className='col-span-2 py-1 px-4'>{(client[0].bill.reduce((sum, product) => sum + product.product.price, 0)).toFixed(2)} $</div>
                <div className='col-span-1 py-1 px-4'></div>
            </div>
        </div>
        {addToBillOpen && (
          <Modal title="Ajouter à la facture" isModalOpen={addToBillOpen} setIsModalOpen={setAddToBillOpen}>
            <AddToBill clientId={clientId} />
          </Modal>
        )}
    </section>
  )
}
