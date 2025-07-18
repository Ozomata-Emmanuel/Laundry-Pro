import React from 'react'
import SupplierDashboardSideBar from './SupplierComponents/SupplierDashboardSideBar'
import SupplierDashboardHeader from './SupplierComponents/SupplierDashboardHeader'
import { Outlet } from 'react-router-dom'

const SupplierDashboardPage = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-200">
        <SupplierDashboardSideBar className="pr-10" />
        <div className="lg:pl-72">
          <SupplierDashboardHeader />
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

export default SupplierDashboardPage
