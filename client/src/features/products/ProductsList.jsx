import React from 'react'
import { useSelector } from 'react-redux'

export default function ProductsList() {
  const { products } = useSelector((state) => state.product)
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

      {!products && (
        <p>Aucun produit</p>
      )}
      {products.length > 0 && products.map((product) => (
      <div className="grid grid-cols-12 bg-white shadow-md rounded-md hover:shadow-lg cursor-pointer mb-4">
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
        <div className="col-span-1 py-1 px-4">yes</div>
        <div className="col-span-1 py-1 px-4">{product.quantity}</div>
        <div className="col-span-1 py-1 px-4">{product.price}</div>
        <div className="col-span-2 py-1 px-4">del</div>
      </div>
      ))}
    </section>
  )
}
