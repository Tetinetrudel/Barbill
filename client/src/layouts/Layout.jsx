import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Layout() {
  return (
  <main className="flex flex-col">
    <Navbar />
    <Outlet />
  </main>
  )
}
