import React, { useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { deleteProduct, updateProduct } from '../../redux/products/productSlice'

import { API_URL } from '../../utils/apiUrl'

import { FaRegStar, FaStar, FaRegEdit, FaRegTrashAlt } from 'react-icons/fa'

import Modal from '../../components/Modal'
import EditProduct from './EditProduct'

export default function ProductsList({ filteredProducts }) {
  const { products } = useSelector((state) => state.product)
  const { accessToken } = useSelector((state) => state.user)
  const [editProductOpen, setEditProductOpen] = useState(false)
  const [productId, setProductId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const dispatch = useDispatch()

  const handleEdit = (id) => {
    setProductId(id)
    setEditProductOpen(!editProductOpen)
  }

  const handleUpdatePopular = async (id) => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/products/${id}/popular`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
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
        dispatch(updateProduct(result))
      } catch (error) {
            setLoading(false)
            setError(error)
      }
  }

  const handleDelete = async (productId) => {
      try {
          const res = await fetch(`${API_URL}/products/${productId}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
              }
          })
          const data = await res.json()
          if(data.success === false) {
              alert(data.message)
              return
          }
          dispatch(deleteProduct(productId))
      } catch (error) {
          console.error(error)
      }
  }

  return (
    <section className="mt-10">
      <div className="grid grid-cols-12 text-xs font-bold">
        <div className='col-span-1 py-1 px-4'>Image</div>
        <div className="col-span-3 py-1 px-4">Nom</div>
        <div className="col-span-3 py-1 px-4">Catégorie</div>
        <div className="col-span-1 py-1 px-4">Populaire</div>
        <div className="col-span-1 py-1 px-4">Quantité</div>
        <div className="col-span-1 py-1 px-4">Prix</div>
        <div className="col-span-2 py-1 px-4"></div>
      </div>

      {!filteredProducts.length && (
        <div className="grid grid-cols-12 text-sm">
            <div className='col-span-12 py-1 px-4'>Aucun produit disponible</div>
        </div>
      )}

      {filteredProducts.length > 0 && filteredProducts.map((product) => (
      <div key={product._id} className="grid grid-cols-12 bg-white shadow-md rounded-md hover:shadow-lg cursor-pointer mb-4 items-center">
          <div className='col-span-1 py-1 px-4'>
              <div className="rounded-full border-2 border-zinc-400 w-8 h-8">
                  <img            
                      className='w-full h-full object-cover rounded-full cursor-pointer'
                      src={product.image}
                      alt="image du produit" 
                  />
              </div>
        </div>
        <div className="col-span-3 py-1 px-4">{product.name}</div>
        <div className="col-span-3 py-1 px-4">{product.category.name}</div>
        <div className="col-span-1 py-1 px-4 ml-5">{
            product.popular ? 
              <FaStar onClick={() => handleUpdatePopular(product._id)} className="text-yellow-500 text-sm hover:text-black" />
               : <FaRegStar onClick={() => handleUpdatePopular(product._id)} className="text-sm hover:text-yellow-500" />
        }</div>
        <div className="col-span-1 py-1 px-4 ml-5">{product.quantity}</div>
        <div className="col-span-1 py-1 px-4">{product.price.toFixed(2)}</div>
        <div className="col-span-2 py-1 px-4 flex items-center gap-3"
        >
          <FaRegEdit onClick={() => handleEdit(product._id)} className="text-blue-600 text-sm hover:text-blue-800" />
          <FaRegTrashAlt onClick={() => handleDelete(product._id)} className="text-sm text-red-600 hover:text-red-800" />
        </div>
      </div>
      ))}
      {editProductOpen && (
        <Modal title="Modifier le produit" isModalOpen={editProductOpen} setIsModalOpen={setEditProductOpen}>
            <EditProduct setEditProductOpen={setEditProductOpen} productId={productId} setProductId={setProductId} />
        </Modal>
      )}
    </section>
  )
}
