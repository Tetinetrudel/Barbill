import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import ClientsList from '../components/clients/ClientsList'
import ClientDetails from '../components/clients/ClientDetails'

import { API_URL } from '../utils/apiUrl'

export default function Clients() {
  const { accessToken } = useSelector((state) => state.user)
  const [clients, setClients] = useState([])
  const [filteredClients, setFilteredClients] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isUpdated, setIsUpdated] = useState(false)

  const handleGetClients = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`${API_URL}/clients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      })
      const data = await res.json()

      if (data.success === false) {
        setIsLoading(false)
        setErrorMessage(data.message)
        return
      }
      setClients(data)
      setFilteredClients(data)
      setIsLoading(false)
      setErrorMessage(null)
      setIsUpdated(false)
    } catch (error) {
      setIsLoading(false)
      setErrorMessage(error.message)
    }
  }

  useEffect(() => {
    handleGetClients()
  }, [isUpdated])

  return (
    <section className="flex h-full">
      <div className='flex-none w-80'>
        <ClientsList 
          clients={clients} 
          filteredClients={filteredClients} 
          setFilteredClients={setFilteredClients} 
          isUpdated={isUpdated} 
          setIsUpdated={setIsUpdated} 
        />
      </div>
      <div className="flex-1">
        <ClientDetails />
      </div>
    </section>
  )
}
