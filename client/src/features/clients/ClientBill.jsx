import React, { useState } from 'react'

import Modal from '../../components/Modal'
import AddToBill from './AddToBill'

export default function ClientBill() {
  const [addToBillOpen, setAddToBillOpen] = useState(false)

  return (
    <section>
        <div className="flex justify-between items-center">
          <h2 className="text-blue-600 font-semibold text-sm uppercase">facture</h2>
          <button 
            onClick={() => setAddToBillOpen(!addToBillOpen)}
            className="bg-blue-600 hover:opacity-95 hover:shadow-md py-1 px-4 flex items-center justify-center flex-none text-white rounded-md text-sm"
          >Ajouter</button>
        </div>
        <div className="shadow bg-white rounded-md p-4 h-auto w-full">
          facture listing
        </div>
        {addToBillOpen && (
          <Modal title="Ajouter à la facture" isModalOpen={addToBillOpen} setIsModalOpen={setAddToBillOpen}>
            <AddToBill />
          </Modal>
        )}
    </section>
  )
}
