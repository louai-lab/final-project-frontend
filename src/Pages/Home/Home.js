import React, { useContext } from 'react'
import UserContext from '../../Context/UserContext'

function Home() {
  const {user}=useContext(UserContext)
  // console.log(user)
  
  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}

export default Home
