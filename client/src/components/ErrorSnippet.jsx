import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

export default function Modal({ error, setError }) {

    setTimeout(() => {
        setError("");
      }, 5000);

  return (
    <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black/75'>
        <div className="bg-white rounded-md relative min-w-[300px] min-h-[30px] flex flex-col">
            <div className="flex justify-between items-center p-4">
                <p className="text-red-600 text-sm">{error}</p>
                <div 
                    className="p-1 ml-4 rounded-md hover:bg-zinc-200 cursor-pointer transition-all delay-200 ease-in-out" 
                    onClick={() => setError("")}
                >
                    <AiOutlineClose className='text-sm text-zinc-500' />
                </div>
            </div>
        </div>
    </div>
  )
}
