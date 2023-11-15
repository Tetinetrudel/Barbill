import React from 'react'
import { useSelector } from 'react-redux'

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user)
  return (
    <div>Profile de {currentUser.company}</div>
  )
}
