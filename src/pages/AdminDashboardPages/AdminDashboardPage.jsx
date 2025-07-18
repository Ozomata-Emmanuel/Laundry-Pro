import React from 'react'
import AdminDashboardSideBar from './AdminComponents/AdminDashboardSideBar'
import AdminDashboardHeader from './AdminComponents/AdminDashboardHeader'
import { Outlet } from 'react-router-dom'

const AdminDashboardPage = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-200">
        <AdminDashboardSideBar className="pr-10" />
        <div className="lg:pl-72">
          <AdminDashboardHeader />
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

export default AdminDashboardPage
