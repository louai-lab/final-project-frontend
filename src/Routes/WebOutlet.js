import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Layouts/DashSidebar/Navbar/Navbar.js'
import Footer from '../Layouts/Footer/Footer.js'

function WebOutlet() {
  return (
    <div>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default WebOutlet
