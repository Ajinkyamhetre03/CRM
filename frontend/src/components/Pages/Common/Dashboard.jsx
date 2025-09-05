import React from 'react'
import { useAuth } from "../../../Context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div>
      <h1>Dashboard</h1>
      {user && <p className=' dark:text-white '>Welcome, {user.username}!</p>}
    </div>
  )
}

export default Dashboard