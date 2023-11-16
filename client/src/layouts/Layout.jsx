import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function Layout() {
  return (
  <main className="flex flex-col h-screen">
    <Navbar />
    <div className="grid grid-cols-12 h-full">
      <nav className="col-span-2">
        <Sidebar />
      </nav>
      <main className='col-span-10 w-11/12 mx-auto'>
        <Outlet />
      </main>
    </div>
  </main>
  )
}
