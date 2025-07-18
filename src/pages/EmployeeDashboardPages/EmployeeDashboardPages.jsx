import React from 'react'
import { Outlet } from 'react-router-dom'
import EmployeeDashboardSiderbar from './EmployeeComponents/EmployeeDashboardSiderbar'
import EmployeeDashboardHeader from './EmployeeComponents/EmployeeDashboardHeader'

const EmployeeDashboardPages = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-200">
        <EmployeeDashboardSiderbar className="pr-10" />
        <div className="lg:pl-72">
          <EmployeeDashboardHeader />
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

export default EmployeeDashboardPages