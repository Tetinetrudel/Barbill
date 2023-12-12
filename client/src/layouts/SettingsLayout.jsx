import { Outlet, Link } from 'react-router-dom'

export default function SettingsLayout() {
  return (
    <main className="flex flex-col h-screen">
        <div className="grid grid-cols-12 h-full">
        <nav className="col-span-2">
            <Link to="/settings/category">
                <h2>Catégories</h2>
            </Link>
        </nav>
        <main className='col-span-10'>
            <Outlet />
        </main>
        </div>
    </main>
  )
}
