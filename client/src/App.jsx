import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import { getClients } from './redux/clients/clientSlice'
import { getCategories } from './redux/categories/categorySlice'
import { getProducts } from './redux/products/productSlice'

import { API_URL } from './utils/apiUrl'

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
  const { accessToken } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handleGetClients = async () => {
    try {
      const response = await fetch(`${API_URL}/clients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      })
      const data = await response.json()
      if(response.success === false) {
        console.error(data.message)
      }

      dispatch(getClients(data))
    } catch (error) {
      console.error(error)
    }
  }

  const handleGetProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      })
      const data = await response.json()
      if(data.success === false) {
        console.error(data.message)
      }

      dispatch(getProducts(data))
    } catch (error) {
      console.error(error)
    }
  }

  const handleGetCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      })
      const data = await response.json()
      if(data.success === false) {
        console.error(data.message)
      }
      dispatch(getCategories(data))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if(!accessToken) return
    handleGetClients()
    handleGetProducts()
    handleGetCategories()
  }, [accessToken])

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
