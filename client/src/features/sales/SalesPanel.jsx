import { useState, useEffect } from 'react'

import ProductFilter from '../products/ProductFilter'

import { useSelector, useDispatch } from 'react-redux'
import { addDailySales } from '../../redux/sales/salesSlice'

import { BiPlusMedical } from "react-icons/bi";

export default function SalesPanel() {
    const { products } = useSelector((state) => state.product)
    const [filteredProducts, setFilteredProducts] = useState({})
    const dispatch = useDispatch()

    const handleSale = (product) => {
        dispatch(addDailySales(product))
    }

    useEffect(() => {
      setFilteredProducts(products)
    }, [products])

    return (
      <div className='col-span-8 pt-10 px-10'>
          <ProductFilter setFilteredProducts={setFilteredProducts} />
          <section className="mt-10">
              <div className="grid grid-cols-12 text-xs font-bold">
                <div className='col-span-1 py-1 px-4'>Image</div>
                <div className="col-span-4 py-1 px-4">Nom</div>
                <div className="col-span-2 py-1 px-4">Catégorie</div>
                <div className="col-span-2 py-1 px-4">Quantité</div>
                <div className="col-span-2 py-1 px-4">Prix</div>
                <div className="col-span-1 py-1 px-4"></div>
              </div>

              {!filteredProducts.length && (
                <div className="grid grid-cols-12 text-sm">
                    <div className='col-span-12 py-1 px-4'>Aucun produit disponible</div>
                </div>
              )}

              {filteredProducts.length > 0 && filteredProducts.map((product, index) => (
              <div key={index} className="grid grid-cols-12 bg-white shadow-md rounded-md hover:shadow-lg cursor-pointer mb-4 items-center">
                  <div className='col-span-1 py-1 px-4'>
                      <div className="rounded-full border-2 border-zinc-400 w-8 h-8">
                          <img            
                              className='w-full h-full object-cover rounded-full cursor-pointer'
                              src={product.image}
                              alt="image du produit" 
                          />
                      </div>
                </div>
                <div className="col-span-4 py-1 px-4">{product.name}</div>
                <div className="col-span-2 py-1 px-4">{product.category.name}</div>
                <div className="col-span-2 py-1 px-4 ml-5">{product.quantity}</div>
                <div className="col-span-2 py-1 px-4">{product.price.toFixed(2)} $</div>
                <div className="col-span-1 py-1 px-4 flex items-center gap-3">
                  <BiPlusMedical className='text-green-600 hover:text-green-800 text-md' onClick={() => handleSale(product)} />
                </div>
              </div>
              ))}
          </section>
      </div>
    )
}
