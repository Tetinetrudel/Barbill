import SalesPanel from '../features/sales/SalesPanel'
import PaymentPanel from '../features/sales/PaymentPanel'

export default function Home() {
    return (
      <div className='grid grid-cols-12 h-full'>
          <SalesPanel />
          <PaymentPanel />
      </div>
    )
}
