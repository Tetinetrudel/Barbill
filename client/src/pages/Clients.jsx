import { useState } from 'react'

import ClientsList from '../features/clients/ClientsList'
import ClientDetails from '../features/clients/ClientDetails'

export default function Clients() {
  const [clientId, setClientId] = useState(undefined)
  return (
    <div className='flex w-full h-full'>
        <div className="w-80 flex-none">
            <ClientsList setClientId={setClientId} />
        </div>
        <div className="flex-1">
            <ClientDetails clientId={clientId} setClientId={setClientId} />
        </div>
    </div>
  )
}
