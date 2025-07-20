import axios from "axios";
import { useEffect } from "react";
import { createContext, useState } from "react";

export const DataContext = createContext();

function DataProvider({children}) {
  const localstorageCustomerData = localStorage.getItem("laundry_customer_id");
  const localstorageAdminData = localStorage.getItem("laundry_admin_id");
  const localstorageManagerData = localStorage.getItem("laundry_manager_id");
  const localstorageEmployeeData = localStorage.getItem("laundry_employee_id");
  const localstorageSupplierData = localStorage.getItem("laundry_supplier_id");
  const [user, setUser] = useState({});
  const [load, setLoad] = useState(false);

  const getUser = async(id)=> {
    const resp = await axios.get(`http://localhost:5002/laundry/api/user/${id}`);
    setLoad(true)
    console.log(resp.data.data)
    if (resp.data.success){
      setUser(resp.data.data);
    } else {
      setLoad(false);
    }
  };

  
  useEffect(() => {
    if (localstorageCustomerData) {
      getUser(localstorageCustomerData);
    } else if (localstorageAdminData) {
      getUser(localstorageAdminData);
    } else if (localstorageManagerData) {
      getUser(localstorageManagerData);
    } else if (localstorageEmployeeData) {
      getUser(localstorageEmployeeData);
    } else if (localstorageSupplierData) {
      getUser(localstorageSupplierData);
    } else {
      setUser({})  
    };
  }, []);
  return <DataContext.Provider value={{ user, setUser, getUser, load }}>{children}</DataContext.Provider>
};

export default DataProvider