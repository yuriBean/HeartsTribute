import React from 'react'
import { useAuth } from '../utils/AuthContext'
import {signout} from '../auth/emailAuthServices'
import { auth } from '../../firebase';
export default function Home() {
  // const { user } = useAuth();
  const user = auth.currentUser;
  return (
    <div>
     
      {JSON.stringify(user)}
       
    </div>
  )
}