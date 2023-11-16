import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  
  console.log(formData)
  
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

  return (
    <div>
      Profile de {currentUser.company}
      <div className="rounded-full border-2 border-zinc-400 w-8 h-8">
        <input 
          onChange={(e) => setFile(e.target.files[0])}
          type="file" 
          ref={fileRef} 
          hidden 
          accept='image/*' 
        />
        <img 
          onClick={() => fileRef.current.click()}
          className='w-full h-full object-cover rounded-full cursor-pointer'
          src={formData.avatar || currentUser.avatar}
          alt="logo de l'entreprise" 
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
      </div>
    </div>
  )
}
