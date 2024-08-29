import React from 'react'
import { auth } from '../../firebase';
export default function Home() {
  const user = auth.currentUser;
  return (
    <div>
     
      {JSON.stringify(user)}
       
    </div>
  )
}