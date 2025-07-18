import axios from "axios";
import { useEffect } from "react";
import { createContext, useState } from "react";

export const DataContext = createContext();

function DataProvider({children}) {
  const localstorageData = localStorage.getItem("laundry_user_id");
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
    if (localstorageData) {
      getUser(localstorageData);
    } else {
      setUser({})  
    };
  }, []);
  return <DataContext.Provider value={{ user, setUser, getUser, load }}>{children}</DataContext.Provider>
};

export default DataProvider