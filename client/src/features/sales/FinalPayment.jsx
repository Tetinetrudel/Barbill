import { useState } from 'react'

import { useSelector } from 'react-redux'

export default function FinalPayment({ selectedClient }) {
    const { totalPrice } = useSelector((state) => state.sale)
    const [selectedMethod, setSelectedMethod] = useState("")
    const selectMethodClass = "bg-blue-600 text-white"
  return (
    <div className='p-10'>
        <div className="flex flex-col">
            <div className="flex items-center justify-between">
                <p className='font-md font-semibold'>Facture total:</p>
                <h2 className='font-lg text-blue-600 font-semibold'>{totalPrice.toFixed(2)} $</h2>
            </div>
            {selectedClient && (
            <div className="flex items-center justify-between">
                <p className='font-sm '>Facturé à:</p>
                <h2 className='font-sm text-blue-600'>{selectedClient[0].name}</h2>
            </div>
            )}
        </div>
        <div className="flex items-center justify-center gap-x-4 mt-6">
            <button 
                className={`${selectedMethod ==="cash" ? selectMethodClass : ""} flex items-center gap-2 border border-blue-600 hover:shadow-md rounded-md text-blue-600 py-1 px-3`}
                onClick={() => setSelectedMethod("cash")}
              >
                Argent
            </button>
            <button 
                className={`${selectedMethod ==="card" ? selectMethodClass : ""} flex items-center gap-2 border border-blue-600 hover:shadow-md rounded-md text-blue-600 py-1 px-3`}
                onClick={() => setSelectedMethod("card")}
            >
                Carte
            </button>
        </div>
        {selectedMethod === "cash" && (
          <p>Payer en argent</p>
        )}
        {selectedMethod === "card" && (
          <p>payer par carte</p>
        )}
    </div>
  )
}
