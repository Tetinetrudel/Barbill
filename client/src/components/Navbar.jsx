import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { signOutUserStart, deleteUserFailure, deleteUserSuccess } from '../redux/user/userSlice'

import Logo from './logo/Logo'

import { API_URL } from './../utils/apiUrl'

import { BiCog, BiLogOut, BiSearch, BiSolidBell, BiSolidMessageRoundedDetail } from 'react-icons/bi'

export default function Navbar() {
    const { currentUser } = useSelector((state) => state.user)
    const [searchValue, setSearchValue] = useState("")
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleSearch = (e) => {
        e.preventDefault()
        console.log(searchValue)
    }

    const handleSettings = () => {
        setOpen(!open)
        navigate('/settings')
    }

    const handleProfile = () => {
        setOpen(!open)
        navigate(`/profile`)
    }

    const handleLogout = async () => {
        try {
          dispatch(signOutUserStart())
          const res = await fetch(`${API_URL}/auth/logout`)
          const data = await res.json()
          if (data.success === false) {
            dispatch(deleteUserFailure(data.message))
            return
          }
          dispatch(deleteUserSuccess(data))
          navigate('/login')
        } catch (error) {
          dispatch(deleteUserFailure(data.message))
        }
      }

  return (
    <div className='flex justify-between items-center py-4 px-16 border-b border-b-zinc-200'>
        <Logo />
        <form>
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
        </form>
        <div className="flex items-center gap-4">
            <div className="bg-whiteflex items-center hover:bg-zinc-200 rounded-md p-1 transition ease-linear duration-200">
                <BiSolidBell className="text-zinc-500 text-xl cursor-pointer"/>
            </div>
            <div className="bg-whiteflex items-center hover:bg-zinc-200 rounded-md p-1 transition ease-linear duration-200">
                <BiSolidMessageRoundedDetail className="text-zinc-500 text-xl cursor-pointer"/>
            </div>
            <div className="rounded-full border-2 border-zinc-400 w-8 h-8">
                <img 
                    className='w-full h-full object-cover rounded-full cursor-pointer'
                    src={currentUser.avatar ? currentUser.avatar 
                    : "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"}
                    alt="logo de l'entreprise" 
                    onClick={() => setOpen(!open)}
                />
            </div>
        </div>
        {open && (
            <div className="bg-white shadow-md w-64 py-3 absolute top-[66px] right-16">
                <div className="flex flex-col gap-2 items-center border-b border-b-zinc-200">
                    <h1 className="text-sm font-semibold">{currentUser.company}</h1>
                    <button 
                        className="border border-zinc-400 rounded-md bg-white outline-none py-1 px-4 mb-3 hover:shadow-md w-32 text-sm"
                        onClick={handleProfile}
                    >Profile</button>
                </div>
                <div className="flex flex-col justify-start gap-4 mt-3">
                    <div className="px-3">
                        <div onClick={handleSettings} className='cursor-pointer flex gap-1 items-center bg-transparent rounded-md hover:bg-zinc-200 duration-200 ease-in-out transition py-1 px-4'>
                            <BiCog className="text-md"/>
                            <p className="text-sm">Paramêtres</p>
                        </div>
                    </div>
                    <div className="px-3">
                        <div onClick={handleLogout} className='flex cursor-pointer gap-1 items-center bg-transparent rounded-md hover:bg-zinc-200 duration-200 ease-in-out transition py-1 px-4'>
                            <BiLogOut className="text-md"/>
                            <p className="text-sm">Se déconnecter</p>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}
