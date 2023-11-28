import { useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { updateClient } from '../../redux/clients/clientSlice'

import { AiOutlinePlus } from 'react-icons/ai'
import { BiSearch, BiChevronDown, BiChevronUp } from 'react-icons/bi'
import { API_URL } from '../../utils/apiUrl'

import ClipLoader from 'react-spinners/ClipLoader'

export default function AddToBill({ clientId }){
    const { accessToken } = useSelector((state) => state.user)
    const { products } = useSelector((state) => state.product)
    const [filteredProducts, setFilteredProducts] = useState(products)
    const [searchQuery, setSearchQuery] = useState("")
    const [showCategory, setShowCategory] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const dispatch = useDispatch()

    const uniqueCategories = Array.from(new Set(products.map(product => product.category.name)))

    useEffect(() => {
        if(searchQuery === "") {
            setFilteredProducts(products)
        }
        const filtered = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
        setFilteredProducts(filtered)
    }, [searchQuery])

    const handleAddProductToClient = async (productId) => {
        try {
            setLoading(true)
            const res = await fetch(`${API_URL}/clients/${clientId}/add`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}` 
                },
                body: JSON.stringify({productId})
            })
            const data = await res.json()

            if(data.success === false) {
                setLoading(false)
                setError(data.message)
                return
            }
    
            setLoading(false)
            dispatch(updateClient(data))
        } catch (error) {
            setLoading(false)
            setError(error.message)
        }
    }
        
  return (
    <div className="py-4 px-10 flex flex-col gap-4 w-full overflow-y-scroll">
        <div className="client-add-product-header">
            <div className="flex gap-1 items-center border-b border-b-zinc-200 bg-white w-64">
                <BiSearch className="text-blue-600 text-md cursor-pointer" />
                <input 
                    type="search" 
                    className="border-none outline-none focus:outline-none p-1 text-sm w-full" 
                    placeholder='Rechercher un produit'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
        <div className="w-full">
            {uniqueCategories.length === 0 && <p>Veuillez ajouter des produits pour en ajouter aux clients</p>}
            {uniqueCategories.map(category => (
                <div key={category._id} className="category-item">
                    <div className="flex items-center justify-between">
                        <h2 className="text-blue-600 text-sm font-semibold">{category}</h2>
                        {showCategory === category ? 
                          <BiChevronUp 
                              onClick={() => setShowCategory(null)} 
                              className="text-xl cursor-pointer"
                          /> 
                          : <BiChevronDown 
                                onClick={() => setShowCategory(category)}
                                className="text-xl cursor-pointer"
                            />
                        }
                    </div>
                    {showCategory === category && (
                        <ul className="w-full">
                        {filteredProducts
                            .filter(product => product.category.name === category)
                            .map(product => (
                            <li 
                                key={product._id} 
                                className="flex items-center justify-between hover:shadow-md hover:bg-blue-50 py-2 px-4 rounded-md cursor-pointer" 
                                onClick={() => handleAddProductToClient(product._id)}
                            >
                                <p className="text-sm">{product.name}</p>
                                {loading ? <ClipLoader size={10}/> 
                                    : <AiOutlinePlus className='cursor-pointer text-md text-blue-600' />
                                }
                            </li>
                        ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    </div>
  )
}
