import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { MdAlternateEmail, MdOutlinePersonOutline } from 'react-icons/md'

import BeatLoader from 'react-spinners/BeatLoader'

import { API_URL } from '../../utils/apiUrl'

export default function AddClient({ setIsModalOpen, isUpdated, setIsUpdated}) {
    const nameRef = useRef()
    const { accessToken } = useSelector((state) => state.user)
    const [formData, setFormData] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        nameRef.current.focus();
    }, [])

    useEffect(() => {
        setErrorMessage("")
    }, [formData])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          setIsLoading(true)
          setIsUpdated(true)
          const res = await fetch(`${API_URL}/clients`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(formData),
          })
          const data = await res.json()

          if (data.success === false) {
            setIsLoading(false)
            setErrorMessage(data.message)
            return
          }

          setIsLoading(false)
          setErrorMessage(null)
          setIsModalOpen(false)
        } catch (error) {
          setIsLoading(false)
          setErrorMessage(error.message)
        }
      }

  return (
    <form className="w-full flex flex-col gap-8 p-6" onSubmit={handleSubmit}>
        <div className="relative">
            <MdOutlinePersonOutline className="text-md absolute top-1/2 -translate-y-1/2 text-blue-600"/>
            <input 
                ref={nameRef}
                className="text-sm border-b border-zinc-400 focus:outline-none pl-6 w-full focus:border-blue-600"
                type="name" 
                id="name" 
                placeholder="Nom complet" 
                onChange={handleChange}
            />
        </div>
        <div className="relative">
            <MdAlternateEmail className="text-md absolute top-1/2 -translate-y-1/2 text-blue-600"/>
            <input 
                className="text-sm border-b border-zinc-400 focus:outline-none pl-6 w-full focus:border-blue-600"
                type="email" 
                id="email" 
                placeholder="Courriel" 
                onChange={handleChange}
            />
        </div>
        <button className="bg-blue-600 hover:bg-blue-800 rounded-md p-1 flex items-center justify-center outline-none border-none text-zinc-50">
            {isLoading ? <BeatLoader color={"#fff"} size={10} />: "Ajouter"}
        </button>
        {errorMessage && (
            <p className="mt-1 text-red-500 text-xs">{errorMessage}</p>
        )}
    </form>
  )
}
