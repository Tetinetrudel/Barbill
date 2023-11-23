import { useState, useEffect, useRef } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { updateProduct } from '../../redux/products/productSlice'

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../../firebase'

import { API_URL } from '../../utils/apiUrl'

export default function EditProduct({ productId, setProductId, setEditProductOpen }) {
  const { accessToken } = useSelector((state) => state.user)
  const { products } = useSelector((state) => state.product)
  const product = products.filter((item) => item._id === productId)
  const [formData, setFormData] = useState({
    image: product[0].image,
    name: product[0].name,
    category: product[0].category._id,
    quantity: product[0].quantity,
    price: product[0].price
  })
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
        const response = await fetch(`${API_URL}/products/${productId}`, {
            method: 'PATCH',
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
        if(product.success === false) {
            console.log(product.message)
        }
        setLoading(false)
        setEditProductOpen(false)
        dispatch(updateProduct(result))
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
                  src={formData.image || product[0].image }
                  alt="logo de l'entreprise" 
                />
          </div>
        </div>
        <div className='w-full flex flex-col gap-1 items-start'>
            <label htmlFor="name" className='text-xs font-semibold text-blue-600'>Nom du produit</label>
            <input 
                type="text"
                className='placeholder:text-black w-full rounded-md border border-zinc-200 focus:border-blue-600 outline-none py-1 px-2 bg-white text-sm'
                id="name"
                autoComplete='off'
                placeholder={product[0].name}
                onChange={handleChange}
            />
        </div>
        <div className='w-full flex flex-col gap-1 items-start'>
            <label htmlFor="category" className='text-xs font-semibold text-blue-600'>Catégorie</label>
            <input 
                type="text"
                className='placeholder:text-black w-full rounded-md border border-zinc-200 focus:border-blue-600 outline-none py-1 px-2 bg-white text-sm'
                id="category"
                autoComplete='off'
                placeholder={product[0].category.name}
                disabled
                onChange={handleChange}
            />
        </div>
        <div className='w-full flex flex-col gap-1 items-start'>
            <label htmlFor="quantity" className='text-xs font-semibold text-blue-600'>Quantité</label>
            <input 
                type="number"
                className='placeholder:text-black w-full rounded-md border border-zinc-200 focus:border-blue-600 outline-none py-1 px-2 bg-white text-sm'
                id="quantity"
                autoComplete='off'
                placeholder={product[0].quantity}
                onChange={handleChange}
            />
        </div>
        <div className='w-full flex flex-col gap-1 items-start'>
            <label htmlFor="price" className='text-xs font-semibold text-blue-600'>Prix</label>
            <input 
                type="number"
                className='placeholder:text-black w-full rounded-md border border-zinc-200 focus:border-blue-600 outline-none py-1 px-2 bg-white text-sm'
                id="price"
                autoComplete='off'
                placeholder={product[0].price}
                onChange={handleChange}
            />
        </div>
        <button className='bg-blue-600 hover:opacity-95 text-white p-1 rounded-md text-sm'>
            {loading ? "Loading ..." : "Modifier" }
        </button>
        {error && (<p className="text-xs text-red-600">{error}</p>)}
    </form>
  )
}
