import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ErrorPage from './components/errorPage.jsx'
import SuccessPage from './components/successPage.jsx'
import LoadingPage from './components/loadingPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
      {/* <Login/> */}
   {/* <VerificationCode/> */}
   {/* <Signup/> */}
   {/* <ErrorPage/> */}
   {/* <SuccessPage/> */}
   {/* <LoadingPage/> */}
  </StrictMode>,
)
