import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { BsSearch } from 'react-icons/bs'
import { BiCategory } from 'react-icons/bi'
import { TbFilterDiscount, TbFilterDown, TbFilterUp, TbFilterPlus, TbDotsCircleHorizontal } from "react-icons/tb"
import { FaStar } from 'react-icons/fa'

function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

export default function ProductFilter({ setFilteredProducts }) {
    const { products } = useSelector((state) => state.product)
    const { categories } = useSelector((state) => state.category)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterOpen, setFilterOpen] = useState(false)
    const [filterByCategoryOpen, setFilterByCategoryOpen] = useState(false)

    useEffect(() => {
        if(searchQuery === "") {
            setFilteredProducts(products)
        }
        const normalizedQuery = normalizeString(searchQuery)
        if(!products) return
        const filtered = products.filter((item) => normalizeString(item.name).includes(normalizedQuery)
        )
        setFilteredProducts(filtered)
    }, [searchQuery, products, setFilteredProducts])

    const handleFilter = () => {
        setFilterOpen(!filterOpen)
        setFilterByCategoryOpen(false)
    }

    const handleFilterByCategory = () => {
        setFilterOpen(false)
        setFilterByCategoryOpen(!filterByCategoryOpen)
    }

    const handleAtoZ = () => {
        const filter = [].concat(products).sort((a,b) => a.name > b.name ? 1 : -1)
        setFilteredProducts(filter)
        setFilterOpen(!filterOpen)
    }

    const handleZtoA = () => {
        const filter = [].concat(products).sort((a,b) => a.name < b.name ? 1 : -1)
        setFilteredProducts(filter)
        setFilterOpen(!filterOpen)
    }

    const handleCategory = () => {
        const filter = [].concat(products).sort((a,b) => a.category.name > b.category.name ? 1 : -1)
        setFilteredProducts(filter)
        setFilterOpen(!filterOpen)
    }

    const handleByCategory = (id) => {
        if(!id) {
            setFilteredProducts(products)
            return
        }
        const filtered = products.filter((item) => item.category._id === id)
        setFilteredProducts(filtered)
        setFilterByCategoryOpen(!filterByCategoryOpen)
        setFilterOpen(false)
    }

    const handlePopular = () => {
        const filtered = products.filter((item) => item.popular === true)
        setFilteredProducts(filtered)
        setFilterByCategoryOpen(!filterByCategoryOpen)
        setFilterOpen(false)
    }

  return (
    <div className='flex items-center gap-4 w-full'>
        <div className='relative w-64'>
            <BsSearch className='absolute top-1/2 -translate-y-1/2 left-2 text-sm'/>
            <input 
                type="search" 
                className=" w-full text-sm outline-none border-b border-b-zinc-300 focus:border-b-blue-600 pl-6 text-blue-600"
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <div className='relative bg-white hover:shadow-md border border-zinc-300 rounded-md p-1 cursor-pointer flex items-center justify-center'>
            <TbFilterPlus onClick={handleFilter}/>
            {filterOpen && (
                <div className="absolute top-10 right-0 border bg-white shadow-md p-2 rounded-md flex flex-col gap-1 justify-start w-36">
                    <div 
                        className="flex items-center gap-2 rounded-md p-1 hover:bg-zinc-100 cursor-pointer"
                        onClick={handleAtoZ}
                    >
                        <TbFilterDown className="text-sm text-zinc-600" />
                        <p className='text-xs text-zinc-600'>A à Z</p>
                    </div>
                    <div 
                        className="flex items-center gap-2 rounded-md p-1 hover:bg-zinc-100 cursor-pointer"
                        onClick={handleZtoA}    
                    >
                        <TbFilterUp className="text-sm text-zinc-600" />
                        <p className='text-xs text-zinc-600'>Z à A</p>
                    </div>
                    <div 
                        className="flex items-center gap-2 rounded-md p-1 hover:bg-zinc-100 cursor-pointer"
                        onClick={handleCategory}    
                    >
                        <TbFilterDiscount className="text-sm text-zinc-600" />
                        <p className='text-xs text-zinc-600'>Par catégorie</p>
                    </div>
                    
                </div>
            )}
        </div>
        <div className='relative bg-white hover:shadow-md border border-zinc-300 rounded-md p-1 cursor-pointer flex items-center justify-center'>
            <div onClick={handleFilterByCategory} className="flex items-center gap-1">
                <TbFilterPlus />
                <p className="text-sm">Catégories</p>
            </div>
            {filterByCategoryOpen && (
                <div className="absolute top-10 right-0 border bg-white shadow-md p-2 rounded-md flex flex-col gap-1 justify-start w-36">
                    {categories.map((item) => (
                    <div 
                        key={item._id}
                        className="flex items-center gap-2 rounded-md p-1 hover:bg-zinc-100 cursor-pointer"
                        onClick={() => handleByCategory(item._id)}
                    >
                    
                        <TbFilterDown className="text-sm text-zinc-600" />
                        <p className='text-xs text-zinc-600'>{item.name}</p>
                    </div>
                    ))}
                    <div 
                        className="flex items-center gap-2 rounded-md p-1 hover:bg-zinc-100 cursor-pointer"
                        onClick={handlePopular}    
                    >
                        <FaStar className="text-sm text-zinc-600" />
                        <p className='text-xs text-zinc-600'>Populaire</p>
                    </div>
                </div>
            )}
        </div>
    </div>
  )
}
