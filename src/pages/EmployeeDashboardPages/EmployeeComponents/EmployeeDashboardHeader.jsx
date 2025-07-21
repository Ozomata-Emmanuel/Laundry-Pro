import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../../context/DataContext";
import axios from "axios";

const EmployeeDashboardHeader = () => {
  const { users } = useContext(DataContext);

  const [branch, setBranch] = useState({});
  const [loading, setLoading] = useState(false);
  const employeeUser = users.employee;

  const fetchBranch = async (branchId) => {
    const EmployeeToken = localStorage.getItem("EmployeeToken");
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5002/laundry/api/branch/${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${EmployeeToken}`,
          },
        }
      );

      console.log(res);
      if (res.data.success) {
        setBranch(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching branch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeUser?.branch) {
      fetchBranch(employeeUser.branch);
    }
  }, [employeeUser]);

  return (
    <>
      <div className="h-13 flex items-center  bg-white z-50 w-full shadow-lg fixed top-0">
        <div className="flex mx-10 items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            <span className="text-blue-800">Laundry</span> Pro
          </h1>
          {!loading && branch && (
            <div className="ml-8 hidden md:block">
              <span className="text-sm text-gray-500">Branch:</span>
              <span className="ml-2 font-medium text-gray-700">
                {branch.branch_name || "N/A"}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center">
          {!loading && employeeUser && (
            <div className="ml-8 hidden md:block">
              <span className="ml-2 font-medium text-gray-700">
                {employeeUser.first_name  || "N/A"}{" "}{employeeUser.last_name  || "N/A"} | Employee
              </span>
            </div>
          )}
        </div>
        
      </div>
    </>
  );
};

export default EmployeeDashboardHeader;
