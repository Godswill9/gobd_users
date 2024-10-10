import React, { useState, useEffect, useRef } from 'react';
import { AppProvider } from './components/appContext.jsx'; // Adjust the path accordingly
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage.jsx'
// import LoggedInPage from './components/loggedIn.jsx';
import SuccessPage from './components/successPage.jsx';
import ErrorPage from './components/errorPage.jsx';
import PaidPage from './components/paidPage.jsx';
import "../stylings/styles.css"
import Login from './components/login_popup.jsx';
import Signup from './components/signup_popup.jsx';
import VerificationCode from './components/verify_popup.jsx';
import Checkout from './components/checkout.jsx';
import LoadingPage from './components/loadingPage.jsx';
import TestPage from './components/testPage.jsx';

function App() {

  return (
    <div>
      <BrowserRouter>
      <AppProvider>
       <Routes>
       <Route path="/:car_make/:car_model/:car_year/:engine_type/:fault_code" element={<Homepage />} />
       {/* <Route path="/:user" element={<LoggedInPage/>} /> */}
       <Route path="/:user/paid" element={<PaidPage/>} />
       <Route path="/:car" element={<TestPage/>} />
       <Route path={"/login"} element={<Login/>}></Route>
       <Route path={"/user_verification"} element={<VerificationCode/>}></Route>
       {/* <Route path={"/signup"} element={<Signup/>}></Route> */}
       <Route path={"/checkout"} element={<Checkout/>}></Route>
       <Route path={"/loader"} element={<LoadingPage/>}></Route>
       <Route path={"/success"} element={<SuccessPage/>}></Route>
       <Route path={"/error"} element={<ErrorPage/>}></Route>
      </Routes>
    </AppProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
