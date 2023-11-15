import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import FormLogo from "../components/logo/FormLogo"

import { FaLock } from 'react-icons/fa'
import { MdAlternateEmail } from "react-icons/md"
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs"

import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import { API_URL } from '../utils/apiUrl'

export default function Login() {
  const [showPwd, setShowPwd] = useState(false)
  const [formData, setFormData] = useState({})
  const { loading, error } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(signInStart())
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (data.success === false) {
        dispatch(signInFailure(data.message))
        return
      }
      dispatch(signInSuccess(data))
      navigate('/')
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

    return ( 
        <div className="flex justify-center p-20">
            <div className="shadow-md rounded-lg bg-white w-96 p-8">
                <div className="flex flex-col items-center gap-5">
                    <FormLogo />
                </div>
                <div className="flex flex-col gap-1 mt-10">
                    <h1 className="text-2xl font-bold">Connection</h1>
                    <p className="text-sm">
                        Vous n'avez pas de compte ? <Link to="/login"><span className="text-blue-600 underline hover:text-blue-800">S'inscrire</span></Link>
                    </p>
                </div>
                <form className="mt-10 w-full flex flex-col gap-8" onSubmit={handleSubmit}>
                    <div className="relative">
                        <MdAlternateEmail className="text-md absolute top-1/2 -translate-y-1/2 text-blue-600"/>
                        <input 
                            className="text-sm border-b border-zinc-400 focus:outline-none pl-6 w-full focus:border-blue-600"
                            type="email" 
                            id="email" 
                            placeholder="Courriel" 
                            onChange={handleChange}/>
                    </div>
                    <div className="relative">
                        <FaLock className="text-md absolute top-1/2 -translate-y-1/2 text-blue-600"/>
                        <input 
                            className="text-sm border-b border-zinc-400 focus:outline-none pl-6 w-full focus:border-blue-600"
                            type={!showPwd ? "password" : "text"} 
                            id="password" 
                            placeholder="Mot de passe" 
                            onChange={handleChange}
                        />
                        {showPwd ? 
                            <BsEyeSlashFill 
                                className="absolute top-1/2 -translate-y-1/2 right-0 cursor-pointer text-blue-600 hover:text-blue-800" 
                                onClick={() => setShowPwd(!showPwd)}
                            /> 
                            : <BsEyeFill 
                                className="absolute top-1/2 -translate-y-1/2 right-0 cursor-pointer text-blue-600 hover:text-blue-800"
                                onClick={() => setShowPwd(!showPwd)}
                            />
                        }
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-800 rounded-md p-1 outline-none border-none text-zinc-50">
                        {loading ? "Loading ..." : "Connection"}
                    </button>
                </form>
                {error ? <p className="text-sm text-red-500 mt-2">{error}</p> : ""}
            </div>
        </div>
    )
}