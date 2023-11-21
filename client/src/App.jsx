import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'

import { getClients } from './redux/clients/clientSlice'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const dispatch = useDispatch()

  useEffect(() => {
    const handleGetClients = async () => {
      setLoading(true)
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
          setError(data.message)
          setLoading(false)
        }

        dispatch(getClients(data))
        setLoading(false)
        setError("")
      } catch (error) {
        setLoading(false)
        setError(error)
      }
    }
    handleGetClients()
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
