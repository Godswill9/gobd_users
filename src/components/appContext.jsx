import React, { createContext, useContext, useEffect, useState } from 'react';
import "../../stylings/styles.css"

const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loginStatus, setLoginStatus] = useState(false);

  // const setFinalAmountHandler=(val)=>{
  //   setFinalAmount(val)
  // }

  const fetchData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/verifyAUser`, {
        method: "GET",
        credentials: "include" 
      });
      const data = await response.json();
      if (data === null || (data && data.message === "login again")) {
        setLoginStatus(false);
      } else {
        // console.log(data)   
        setData(data);
        setLoginStatus(true); // Update loginStatus when the user is logged in
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(()=>{
    fetchData()
  },[])

  return (
    <AppContext.Provider value={{ data, loginStatus}}>
      {children}
    </AppContext.Provider>
  );
};