import React from 'react'
import { useParams } from 'react-router-dom'

function SingleMatch() {
  const {matchId} = useParams();

  // console.log(matchId)
  return (
    <div>
      <h1>Single Match</h1>
    </div>
  )
}

export default SingleMatch
