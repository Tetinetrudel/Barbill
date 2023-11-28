import React, { useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { updateClient } from '../../redux/clients/clientSlice'

import { FaPlus, FaMinus } from 'react-icons/fa'

import { API_URL } from '../../utils/apiUrl'

import ClipLoader from 'react-spinners/ClipLoader'

export default function ClientCards({ clientId }) {
  const { clients } = useSelector((state) => state.client)
  const { accessToken } = useSelector((state) => state.user)
  const client = clients.filter((item) => item._id === clientId)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const dispatch = useDispatch()
  const created = (date) => new Date(date).toLocaleString('fr-CA', { day: 'numeric', month: 'numeric', year: 'numeric'})

  const handleDecreaseCount = async (cardId) => {
      try {
          setLoading(true)
          const response = await fetch(`${API_URL}/clients/${clientId}/decrease`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
              },
              body: JSON.stringify({ cardId })
          })
          const data = await response.json()
          if(data.success === false) {
              setLoading(false)
              setError("data.message")
          }
          setLoading(false)
          dispatch(updateClient(data))
      } catch (error) {
          setLoading(false)
          setError(error)
      }
  }

  const handleIncreaseCount = async (cardId) => {
      try {
          setLoading(true)
          const response = await fetch(`${API_URL}/clients/${clientId}/increase`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
              },
              body: JSON.stringify({ cardId })
          })
          const data = await response.json()
          if(data.success === false) {
              setLoading(false)
              setError("data.message")
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
          <h2 className="text-blue-600 font-semibold text-sm uppercase">Carte</h2>
        </div>
        <div className="shadow bg-white rounded-md p-4 h-auto w-full">
            <div className="grid grid-cols-12 text-xs font-bold mb-2">
                <div className='col-span-8 py-1 px-4'>Produit</div>
                <div className='col-span-2 py-1 px-4'>Date ajouté</div>
                <div className="col-span-2 py-1 px-4"></div>
            </div>
            {client[0].cards.length === 0 && (
                <div className="col-span-12 py-1 px-4 text-sm">
                    <p>Aucune carte</p>
                </div>
            )}
            {client[0].cards.map((item) => (
                <div 
                    key={item._id}
                    className="grid grid-cols-12 hover:shadow-md mb-1 items-center"
                >
                    <div className="col-span-8 py-1 px-4 text-sm">{item.product.name}</div>           
                    <div className="col-span-2 py-1 px-4 text-sm">{created(item.AddedAt)}</div>
                    <div className="col-span-2 py-1 px-4 text-sm">
                      <div className="flex items-center justify-between w-full border border-zinc-300 rounded-md px-2 py-1">
                          <FaMinus 
                              className='text-sm text-blue-600 hover:text-blue-800 cursor-pointer'
                              onClick={() => handleDecreaseCount(item._id)}
                          />
                          {loading ? <ClipLoader size={18} /> : <p className="font-bold">{item.count}</p>}
                          <FaPlus 
                              className='text-sm text-blue-600 hover:text-blue-800 cursor-pointer'
                              onClick={() => handleIncreaseCount(item._id)}
                          />
                      </div>
                    </div>
                </div>
            ))}
        </div>
    </section>
  )
}

