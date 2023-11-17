export default function ClientsTable({ filteredClients }) {
  return (
    <section className="mt-6">
        {!filteredClients.length ? <p>Aucun client</p> 
        : (
            filteredClients.map((item) => (
                <div 
                    key={item._id}
                    className="flex justify-between items-start hover:bg-zinc-100 p-2 rounded-md"
                >
                    <div className="flex items-center gap-2">
                        <p className="bg-zinc-200 px-2 rounded-md uppercase text-lg font-semibold text-zinc-500">{item.name.charAt(0)}</p>
                        <div className="flex flex-col">
                            <p className="text-sm font-semibold">{item.name}</p>
                            <p className="text-xs">{item.email}</p>
                        </div>
                    </div>
                </div>
            ))
        )}
    </section>
  )
}
