import React from 'react'
import { Outlet } from 'react-router-dom'
import ManagerDashboardHeader from './ManagerComponents/ManagerDashboardHeader'
import ManagerDashboardSideBar from './ManagerComponents/ManagerDashboardSideBar'

const ManagerDashboardPage = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-200">
        <ManagerDashboardSideBar className="pr-10" />
        <div className="lg:pl-72">
          <ManagerDashboardHeader />
          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default ManagerDashboardPage