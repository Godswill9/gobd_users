import React, { useState, useEffect, useRef } from 'react';
import { AppProvider } from './components/appContext.jsx'; // Adjust the path accordingly
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage.jsx'
import LoggedInPage from './components/loggedIn.jsx';
import SuccessPage from './components/successPage.jsx';
import ErrorPage from './components/errorPage.jsx';
import PaidPage from './components/paidPage.jsx';
import "../stylings/styles.css"

function App() {

  return (
    <div>
      <BrowserRouter>
      <AppProvider>
       <Routes>
       <Route path="/:car_make/:car_model/:car_year/:engine_type" element={<Homepage />} />
       <Route path="/:user" element={<LoggedInPage/>} />
       <Route path="/:user/paid" element={<PaidPage/>} />
       <Route path={"/success"} element={<SuccessPage/>}></Route>
       <Route path={"/error"} element={<ErrorPage/>}></Route>
      </Routes>
    </AppProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
