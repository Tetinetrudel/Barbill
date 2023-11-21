import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { deleteClient } from '../../redux/clients/clientSlice'

import { API_URL } from '../../utils/apiUrl'

export default function ClientDetails({ clientId, setClientId }) {
    const { clients } = useSelector((state) => state.client)
    const { accessToken } = useSelector((state) => state.user) 
    const dispatch = useDispatch()

    if(!clientId) {
        return (
            <p>Selectionnez un client</p>
        )
    }

    const client = clients.filter((item) => item._id === clientId)

    const handleDelete = async () => {
        try {
            const res = await fetch(`${API_URL}/clients/${clientId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            const result = await res.json()
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
        <div>
            {client[0].name}
            <p onClick={handleDelete}>delete</p>
        </div>
      )
}
      
