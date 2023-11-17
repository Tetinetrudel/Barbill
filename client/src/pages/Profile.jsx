import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import ClipLoader from 'react-spinners/ClipLoader'

import { MdErrorOutline, MdOutlineCheckCircle } from "react-icons/md"
import { BiEdit } from 'react-icons/bi'
import { AiOutlineCloseCircle } from "react-icons/ai";

import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/user/userSlice'
import { API_URL } from '../utils/apiUrl'

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user)
  const { accessToken } = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({
    company: currentUser.company,
    email: currentUser.email,
    avatar: ""
  })
  const [isEditCompany, setIsEditCompany] = useState(false)
  const [isEditEmail, setIsEditEmail] = useState(false)
  const [isEditPassword, setIsEditPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const dispatch = useDispatch()
  
  useEffect(() => {
    if(file) {
      handleFileUpload(file)
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uplaodTask = uploadBytesResumable(storageRef, file)

    uplaodTask.on('state_changed',
      (snapshot) => {
        const progess = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePerc(Math.round(progess))
      },
      (error) => { 
        setFileUploadError(true)
      },
      () => {
        getDownloadURL(uplaodTask.snapshot.ref).then
        ((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL})
        })
      }
    )
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    try {
      dispatch(updateUserStart())
      const res = await fetch(`${API_URL}/users`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
      setIsEditCompany(false)
      setIsEditEmail(false)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleChangePassword = async () => {
    try {
      dispatch(updateUserStart())
      const res = await fetch(`${API_URL}/users/change-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({password: newPassword}),
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }
      setIsEditPassword(false)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  return (
    <div className="flex flex-col gap-3 mt-10">
      <div className="p-4 bg-white shadow-md rounded-md w-full">
        <h1 className="font-bold text-blue-600 text-xl">Profile</h1>
        <div className="mt-5 w-full flex items-center justify-between">
          <h2 className="text-xs uppercase text-zinc-500">Photo du profile</h2>
          <div className="flex gap-3 items-center">
            <div className="rounded-full border-2 border-zinc-400 w-10 h-10">
              <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
              <img 
                onClick={() => fileRef.current.click()}
                className='w-full h-full object-cover rounded-full cursor-pointer'
                src={formData.avatar || currentUser.avatar}
                alt="logo de l'entreprise" 
              />
            </div>
            <p className='text-sm self-center'>
                {fileUploadError ? 
                ( <MdErrorOutline className='text-red-700 text-xl'/> ) 
                : filePerc > 0 && filePerc < 100 ? ( <ClipLoader size={20} />) 
                : filePerc === 100 ? ( <MdOutlineCheckCircle className='text-green-700 text-xl' /> ) 
                : ( '' )}
              </p>
          </div>
        </div>
        <div className="mt-5 w-full flex items-center justify-between">
          <h2 className="text-xs uppercase text-zinc-500">Nom de l'entreprise</h2>
          <div className="flex items-center gap-3">
            {!isEditCompany ? (
              <p className="text-zinc-800 text-md font-semibold">{currentUser.company}</p>
            ) : ( <input 
                    className="rounded-md outline-none border border-zinc-300 focus:border-blue-600 py-1 px-2"
                    type="text" 
                    id="company" 
                    value={formData.company} 
                    onChange={handleChange} 
                  />)}
            {isEditCompany ? 
              <AiOutlineCloseCircle className="text-red-600 cursor-pointer" onClick={() => setIsEditCompany(!isEditCompany)} />
              : <BiEdit className="text-blue-600 cursor-pointer" onClick={() => setIsEditCompany(!isEditCompany)}/>}
          </div>
        </div>
        <div className="mt-5 w-full flex items-center justify-between">
          <h2 className="text-xs uppercase text-zinc-500">Courriel</h2>
          <div className="flex items-center gap-3">
            {!isEditEmail ? (
              <p className="text-zinc-800 text-md font-semibold">{currentUser.email}</p>
            ) : ( <input 
                    className="rounded-md outline-none border border-zinc-300 focus:border-blue-600 py-1 px-2"
                    type="email" 
                    id="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                  />)}
            {isEditEmail ? 
              <AiOutlineCloseCircle className="text-red-600 cursor-pointer" onClick={() => setIsEditEmail(!isEditEmail)}/> 
              : <BiEdit className="text-blue-600 cursor-pointer" onClick={() => setIsEditEmail(!isEditEmail)}/>}
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <button 
            className="bg-blue-600 hover:opacity-95 text-white py-1 px-5 rounded-md"
            onClick={handleSubmit}
          >Sauvegarder</button>
        </div>
      </div>
      <div className="p-4 bg-white shadow-md rounded-md w-full">
        <h1 className="font-bold text-blue-600 text-xl">Sécurité</h1>
        <div className="mt-5 w-full flex items-center justify-between">
          <h2 className="text-xs uppercase text-zinc-500">Mot de passe</h2>
          <div className="flex gap-3 items-center">
            {isEditPassword &&(
              <input 
                className="rounded-md outline-none border border-zinc-300 focus:border-blue-600 py-1 px-2"
                type="password" 
                id="password" 
                onChange={(e) => setNewPassword(e.target.value)} 
            />
            )}
            {isEditPassword ? 
              <AiOutlineCloseCircle className="text-red-600 cursor-pointer" onClick={() => setIsEditPassword(!isEditPassword)}/> 
              : <BiEdit className="text-blue-600 cursor-pointer" onClick={() => setIsEditPassword(!isEditPassword)}/>}
          </div>
        </div>
        <div className="flex justify-end mt-8">
            <button 
              className="bg-blue-600 hover:opacity-95 text-white py-1 px-5 rounded-md"
              onClick={handleChangePassword}
            >Sauvegarder</button>
        </div>
      </div>
    </div>
  )
}
