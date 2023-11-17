import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

export default function Modal({ title, isModalOpen, setIsModalOpen, children }) {
  return (
    <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black/75'>
        <div className="bg-white rounded-md relative min-w-[300px] min-h-[30px] flex flex-col">
            <div className="flex justify-between items-center pt-10 pr-8 pb-6 pl-8 border-zinc-200 border-b">
                <h1 className="text-blue-600 text-lg font-bold">{title}</h1>
                <div 
                    className="p-1 rounded-md hover:bg-zinc-200 cursor-pointer transition-all delay-200 ease-in-out" 
                    onClick={() => setIsModalOpen(!isModalOpen)}
                >
                    <AiOutlineClose className="modal-close" />
                </div>
            </div>
            {children}
        </div>
    </div>
  )
}
