import { useState, useEffect, useRef } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { addProduct } from '../../redux/products/productSlice'

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../../firebase'

import { API_URL } from '../../utils/apiUrl'

import { MdOutlineCheckCircle, MdErrorOutline } from 'react-icons/md'
import ClipLoader from 'react-spinners/ClipLoader'



export default function AddProduct({ setAddProductOpen }) {
  const { accessToken } = useSelector((state) => state.user)
  const { categories } = useSelector((state) => state.category)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
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
          setFormData({ ...formData, image: downloadURL})
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
      e.preventDefault()
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(formData)
        })
        const data = await response.json()
        if(data.success === false) {
            setLoading(false)
            setError(data.message)
        }
        const product = await fetch(`${API_URL}/products/${data._id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        const result = await product.json()
        if(result.success === false) {
            console.log(product.message)
        }
        setLoading(false)
        setAddProductOpen(false)
        dispatch(addProduct(result))
      } catch (error) {
            setLoading(false)
            setError(error)
      }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6 p-6 w-full'>
        <div className="flex items-center justify-between w-full">
          <label htmlFor="name" className='text-xs font-semibold text-blue-600'>Image du produit</label>
          <div className="rounded-full border-2 border-zinc-400 w-10 h-10">
                <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
                <img 
                  onClick={() => fileRef.current.click()}
                  className='w-full h-full object-cover rounded-full cursor-pointer'
                  src={formData.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }
                  alt="logo de l'entreprise" 
                />
          </div>
        </div>
        <div className="w-full flex items-center">
            <p className='text-sm self-center'>
                {fileUploadError ? ( 
                  <div className="flex items-center gap-4">
                    <MdErrorOutline className='text-red-700 text-md'/>
                    <p className="text-xs text-red-700">Erreur de chargement</p>
                  </div>
                 ) 
                : filePerc > 0 && filePerc < 100 ? ( 
                  <div className="flex items-center gap-4">
                    <ClipLoader size={20} />
                    <p>{filePerc} %</p>
                  </div>
                ) 
                : filePerc === 100 ? ( 
                  <div className="flex items-center gap-4">
                    <MdOutlineCheckCircle className='text-green-700 text-md' />
                    <p className="text-xs text-green-700">Chargement complet</p>
                  </div>
                 ) 
                : ( '' )}
            </p>
        </div>
        <div className='w-full flex flex-col gap-1 items-start'>
            <label htmlFor="name" className='text-xs font-semibold text-blue-600'>Nom du produit</label>
            <input 
                type="text"
                className='w-full rounded-md border border-zinc-200 focus:border-blue-600 outline-none py-1 px-2 bg-white text-sm'
                id="name"
                autoComplete='off'
                placeholder='Nom de la catégorie'
                onChange={handleChange}
            />
        </div>
        <div className='w-full flex flex-col gap-1 items-start'>
            <label htmlFor="category" className='text-xs font-semibold text-blue-600'>Catégorie</label>
            <select
                id="category"
                className='w-full rounded-md border border-zinc-200 focus:border-blue-600 outline-none py-1 px-2 bg-white text-sm'
                autoComplete='off'
                onChange={handleChange}
            >
                <option
                    value="0"
                >Sélectionner une catégorie</option>
                {categories && categories.map((category) => (
                  <option
                      value={category._id}
                      key={category._id}
                  >{category.name}</option>
                ))}
            </select>
        </div>
        <div className='w-full flex flex-col gap-1 items-start'>
            <label htmlFor="quantity" className='text-xs font-semibold text-blue-600'>Quantité</label>
            <input 
                type="number"
                className='w-full rounded-md border border-zinc-200 focus:border-blue-600 outline-none py-1 px-2 bg-white text-sm'
                id="quantity"
                autoComplete='off'
                placeholder='Quantité'
                onChange={handleChange}
            />
        </div>
        <div className='w-full flex flex-col gap-1 items-start'>
            <label htmlFor="price" className='text-xs font-semibold text-blue-600'>Prix</label>
            <input 
                type="number"
                className='w-full rounded-md border border-zinc-200 focus:border-blue-600 outline-none py-1 px-2 bg-white text-sm'
                id="price"
                autoComplete='off'
                placeholder='Prix'
                onChange={handleChange}
            />
        </div>
        <button className='bg-blue-600 hover:opacity-95 text-white p-1 rounded-md text-sm'>
            {loading ? "Loading ..." : "Ajouter" }
        </button>
        {error && (<p className="text-xs text-red-600">{error}</p>)}
    </form>
  )
}
