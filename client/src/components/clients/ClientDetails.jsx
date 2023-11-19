import { useState } from 'react'

import { BsThreeDots } from "react-icons/bs"
import { BiEdit, BiTrash } from 'react-icons/bi'

export default function ClientDetails({ clients, clientId }) {
    const [action, setAction] = useState(false)

    const handleEdit = () => {
        setAction(!action)
        console.log("editer")
    }

    const handleDelete = (id) => {
        setAction(!action)
        console.log("delete")
    }
    let content
    if(!clientId) {
        content = <section className="h-full flex items-center justify-between px-36">
            <h1 className="text-2xl text-zinc-600 text-center">Sélectionnez un client pour afficher ces détails</h1>
        </section>
    }

    if(clientId){ 
        const client = clients.filter((item) => item._id.toString() === clientId.toString())
        
        content = <section className="flex flex-col gap-3">
            <div className="flex justify-between items-start relative border-b border-b-zinc-200 pt-10 pb-6 px-10">
                <div className="flex gap-2 items-start">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-blue-600 text-2xl font-semibold">
                            {client[0].name}
                        </h1>
                        <p className="text-xs text-zinc-500">{client[0].email}</p>
                    </div>
                    {!client[0].status ?
                        <span className="border rounded-md text-green-600 border-green-600 bg-green-200 text-sm px-3 mt-1">Montant dû</span> :
                        <span className="border rounded-md text-red-600 border-red-600 bg-red-200 text-sm px-3 mt-2">Montant dû</span>
                    }
                </div>
                <BsThreeDots className="text-2xl text-zinc-600 cursor-pointer" onClick={() => setAction(!action)} />
                {action && (
                    <div className="bg-white shadow p-2 absolute top-20 right-0 flex flex-col gap-2">
                        <button 
                            className="rounded-md py-1 px-3 hover:bg-zinc-200 text-sm text-left flex items-center gap-1"
                            onClick={handleEdit}
                        >
                            <BiEdit />
                            <p>Éditer</p>
                        </button>
                        <button 
                            className="rounded-md py-1 px-3 hover:bg-zinc-200 text-sm text-left flex items-center gap-1"
                            onClick={handleDelete}
                        >
                            <BiTrash />
                            <p>Supprimer</p>
                        </button>
                    </div>
                )}
            </div>
            <main className='pt-6 pl-10'>
                <div className='flex flex-col gap-4'>
                    <div>
                        <h2>Facture</h2>
                        <div className="shadow p-4 rounded-md bg-white">facture</div>
                    </div>
                    <div>
                        <h2>cartes</h2>
                        <div className="shadow p-4 rounded-md bg-white">cartes</div>
                    </div>
                </div>
            </main>
        </section>
    }
    return content
}