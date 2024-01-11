import React, { useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { deleteDailySales, removeAllDailySales, addDailySales } from '../../redux/sales/salesSlice'

import AddClient from './AddClient'
import Modal from '../../components/Modal'
import FinalPayment from './FinalPayment'

import { FaUserPlus } from "react-icons/fa"
import { AiOutlineClose, AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'

export default function PaymentPanel() {
    const { clients } = useSelector((state) => state.client)
    const { dailySales, totalPrice } = useSelector((state) => state.sale)
    const [showAddClient, setShowAddClient] = useState(false)
    const [finalPaymentOpen, setFinalPaymentOpen] = useState(false)

    const [selectClient, setSelectClient] = useState(null)
    const [selectedClient, setSelectedClient] = useState(null)

    const dispatch = useDispatch()

    useEffect(() => {
        if(selectClient === null) { 
            setSelectedClient(null)
            return
        } else {
            setSelectedClient(clients.filter((item) => item._id === selectClient))
        }
    }, [selectClient])

    const handleRemoveProduct = (productId) => {
        dispatch(removeAllDailySales(productId))
    }

    const handleDecreaseProduct = (productId) => {
        dispatch(deleteDailySales(productId))
    }

    const handleIncreaseProduct = (productId) => {
        dispatch(addDailySales(productId))
    }

    const uniqueProductIds = new Set()
    const uniqueProducts = dailySales.filter(item => {
          if (uniqueProductIds.has(item._id)) {
              return false 
          }
          uniqueProductIds.add(item._id)
          return true
    })

    const productStatsMap = {}
    dailySales.forEach(item => {
        const { name, price } = item
        if (!productStatsMap[name]) {
            productStatsMap[name] = {
                count: 1,
                sum: price,
            }
        } else {
            productStatsMap[name].count++
            productStatsMap[name].sum += price
        }
    })

  return (
      <section className='col-span-4 h-full border-l border-l-zinc-200 pt-10 px-10 w-full relative'>
          <button 
              className="rounded-md bg-blue-600 hover:opacity-95 text-white py-1 px-3 w-full flex items-center gap-2 justify-center"
              onClick={() => setShowAddClient(!showAddClient)}
          >
              <FaUserPlus />
              <span>Facturer un client</span>
          </button>
          {showAddClient && (
              <AddClient 
                  showAddClient={showAddClient} 
                  setShowAddClient={setShowAddClient}
                  setSelectClient={setSelectClient}
              />
          )}
          <div className="flex items-center justify-between mt-4">
              <p className='text-sm'>Facturé à :</p>
              {selectedClient && (
                  <div className='flex items-center gap-2'>
                      <h2 className='text-zinc-600 font-semibold text-sm'>{selectedClient[0].name}</h2>
                      <AiOutlineClose className="text-sm text-red-600 hover:text-red-800 cursor-pointer" onClick={() => setSelectClient(null)}/>
                  </div>
              )}
          </div>
          <div className="mt-6">
                {dailySales && uniqueProducts.map((sales) => (
                    <div key={sales._id} className='flex items-center justify-between'>
                      <p>{sales.name}</p>
                      <div className="flex items-center gap-x-3">
                          <div className='flex items-center justify-between w-full border border-zinc-300 rounded-md px-2'>
                              <AiOutlineMinus className='text-xs text-blue-600 hover:text-blue-800 cursor-pointer' onClick={() => handleDecreaseProduct(sales._id)} />
                              <p className="mx-2 text-sm px-2">{productStatsMap[sales.name].count}</p>
                              <AiOutlinePlus className='text-xs text-blue-600 hover:text-blue-800 cursor-pointer' onClick={() => handleIncreaseProduct(sales)} />
                          </div>
                          <p onClick={() => handleRemoveProduct(sales._id)}>
                              <AiOutlineClose className="text-red-600 hover:text-red-800 cursor-pointer flex items-center" />
                          </p>
                      </div>
                    </div>
                ))}
                <div className="flex items-center justify-between mt-4">
                    <p className='text-sm font-semibold'>Total</p>
                    <p className='text-sm font-semibold'>{totalPrice ? totalPrice.toFixed(2) : 0} $</p>
                </div>
          </div>
          <div className='absolute bottom-10 left-0 right-0 w-full px-10'>
              <button 
                  className={ uniqueProducts.length 
                    ? 'bg-blue-600 hover:opacity-95 text-white font-semibold w-full rounded-md py-1 cursor-pointer'
                    : 'bg-zinc-400 text-zinc-700 font-semibold w-full rounded-md py-1 cursor-default'
                  }
                  onClick={() => setFinalPaymentOpen(!finalPaymentOpen)}
              >Payer</button>
          </div>
          {finalPaymentOpen && (
              <Modal title="Payer" isModalOpen={finalPaymentOpen} setIsModalOpen={setFinalPaymentOpen}>
                  <FinalPayment selectedClient={selectedClient} />
              </Modal>
          )}
      </section>
  )
}
