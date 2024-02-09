import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Layouts/DashSidebar/Navbar/Navbar.js'

function WebOutlet() {
  return (
    <div>
      <Navbar/>
      <Outlet/>
    </div>
  )
}

export default WebOutlet
