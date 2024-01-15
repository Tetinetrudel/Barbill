import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { updateClient } from '../../redux/clients/clientSlice'
import { API_URL } from '../../utils/apiUrl'

import ErrorSnippet from '../../components/ErrorSnippet'

export default function ClientEdit({ setEditClientOpen, clientId }) {
    const { accessToken } = useSelector((state) => state.user)
    const { clients } = useSelector((state) => state.client)
    const client = clients.filter((item) => item._id === clientId)
    const [formData, setFormData] = useState({
        name: client[0].name,
        email: client[0].email
    })
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
            const res = await fetch(`${API_URL}/clients/${clientId}`, {
                method: 'PATCH',
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
            setEditClientOpen(false)
            dispatch(updateClient(data))
        } catch (error) {
            setLoading(false)
            setError(error.message)
        }
    }

    useEffect(() => {
        setError("")
    }, [formData])

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
                value={formData.name}
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
                value={formData.email}
                onChange={handleChange}
            />
        </div>
        <button className='bg-blue-600 hover:opacity-95 text-white p-1 rounded-md text-sm'>
            {loading ? "Loading ..." : "Modifier" }
        </button>
        {error && (
                <ErrorSnippet error={error} setError={setError} />
            )}
    </form>
  )
}
