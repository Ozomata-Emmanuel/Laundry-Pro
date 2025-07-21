import axios from "axios";
import { useEffect, createContext, useState } from "react";

export const DataContext = createContext();

function DataProvider({ children }) {
  const localstorageData = {
    customer: localStorage.getItem("laundry_customer_id"),
    admin: localStorage.getItem("laundry_admin_id"),
    manager: localStorage.getItem("laundry_manager_id"),
    employee: localStorage.getItem("laundry_employee_id"),
    supplier: localStorage.getItem("laundry_supplier_id"),
  };

  const [users, setUsers] = useState({});
  const [load, setLoad] = useState(false);

  const getUser = async (id) => {
    try {
      const resp = await axios.get(`http://localhost:5002/laundry/api/user/${id}`);
      if (resp.data.success) {
        return resp.data.data; 
      }
    } catch (error) {
      console.error("Error fetching user", error);
    }
    return null;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoad(false);
      const fetchedUsers = {};

      for (const [role, id] of Object.entries(localstorageData)) {
        if (id) {
          const userData = await getUser(id);
          if (userData) {
            fetchedUsers[role] = userData;
          }
        }
      }

      setUsers(fetchedUsers);
      setLoad(true);
    };

    fetchUsers();
  }, []);

  return (
    <DataContext.Provider value={{ users, setUsers, getUser, load }}>
      {children}
    </DataContext.Provider>
  );
}

export default DataProvider;
