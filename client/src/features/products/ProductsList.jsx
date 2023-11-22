import React from 'react'

export default function ProductsList() {
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

      {/* Looping throught products array comes here */}
      <div className="grid grid-cols-12 bg-white shadow-md rounded-md hover:shadow-lg cursor-pointer mb-4">
        <div className='col-span-1 py-1 px-4'>Image</div>
        <div className="col-span-3 py-1 px-4">Budweiser</div>
        <div className="col-span-3 py-1 px-4">Bière</div>
        <div className="col-span-1 py-1 px-4">yes</div>
        <div className="col-span-1 py-1 px-4">1</div>
        <div className="col-span-1 py-1 px-4">4.00 $</div>
        <div className="col-span-2 py-1 px-4">del</div>
      </div>

      <div className="grid grid-cols-12 bg-white shadow-md rounded-md hover:shadow-lg cursor-pointer">
        <div className='col-span-1 py-1 px-4'>Image</div>
        <div className="col-span-3 py-1 px-4">Drink</div>
        <div className="col-span-3 py-1 px-4">Alcool</div>
        <div className="col-span-1 py-1 px-4">No</div>
        <div className="col-span-1 py-1 px-4">1</div>
        <div className="col-span-1 py-1 px-4">4.75 $</div>
        <div className="col-span-2 py-1 px-4">del</div>
      </div>
    </section>
  )
}
