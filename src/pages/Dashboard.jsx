import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import SideBar from '../components/Core/Dashboard/Sidebar'

const Dashboard = () => {
    const {loading: authLoading} = useSelector( (state) => state.auth)
    const {loading: profileLoading} = useSelector( (state) => state.profile)

    if(profileLoading || authLoading){
        return (<div className='mt-30'>
            Loading...
        </div>)
    }


  return (
    <div className='mt-20 relative flex min-h-[calc(100vh-3.5rem)]'>
        yoooooooooooooo
      <SideBar className="h-[calc(100vh-3.5rem)] overflow-auto"/>
      <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
        <Outlet/>
      </div>
    </div>
  )
}

export default Dashboard
