import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Layout from './layouts/Layout'
import PrivateRoute from './layouts/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Products from './pages/Products'
import Clients from './pages/Clients'
import Settings from './pages/Settings'
import Profile from './pages/Profile'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route element={<PrivateRoute/>}>
          <Route index element={<Home />} />

          <Route path="/products">
            <Route index element={<Products />} />
          </Route>

          <Route path="/clients">
            <Route index element={<Clients />} />
          </Route>

          <Route path="/settings">
            <Route index element={<Settings />} />
          </Route>

          <Route path="/profile">
            <Route index element={<Profile />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
