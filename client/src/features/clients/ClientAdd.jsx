import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { addClient } from '../../redux/clients/clientSlice'
import { API_URL } from '../../utils/apiUrl'

import ClipLoader from 'react-spinners/ClipLoader'

export default function ClientAdd({ setAddClientOpen }) {
    const { accessToken } = useSelector((state) => state.user)
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const dispatch = useDispatch()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await fetch(`${API_URL}/clients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}` 
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            
            if(data.success === false) {
                setLoading(false)
                setError(data.message)
                return
            }
            setLoading(false)
            setAddClientOpen(false)
            dispatch(addClient(data))
        } catch (error) {
            setLoading(false)
            setError(error.message)
        }
    }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6 p-6 w-full'>
        <div className='w-full flex flex-col gap-1 items-start'>
            <label htmlFor="name" className='text-xs font-semibold text-blue-600'>Nom complet</label>
            <input 
                type="text"
                className='w-full rounded-md border border-zinc-200 focus:border-blue-600 outline-none py-1 px-2 bg-white text-sm'
                id="name"
                autoComplete='off'
                placeholder='Nom complet'
                onChange={handleChange}
            />
        </div>
        <div className='w-full flex flex-col gap-1 items-start'>
            <label htmlFor="email" className='text-xs font-semibold text-blue-600'>Courriel</label>
            <input 
                type="email"
                className='w-full rounded-md border border-zinc-200 focus:border-blue-600 outline-none py-1 px-2 bg-white text-sm'
                id="email"
                autoComplete='off'
                placeholder='Courriel'
                onChange={handleChange}
            />
        </div>
        <button className='bg-blue-600 hover:opacity-95 text-white p-1 rounded-md text-sm'>
            {loading ? <ClipLoader size={10} color={"#fff"} /> : "Ajouter" }
        </button>
        {error && (
            <p className="text-xs text-red-600">{error}</p>
        )}
    </form>
  )
}
