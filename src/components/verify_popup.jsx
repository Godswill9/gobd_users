import React, { useState } from 'react';
import '../../stylings/styles.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerificationCode = ({ VerificationDisplay, setloginDisplayHandler, setverificationDisplayHandler, setSignupDisplay }) => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(code);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/verifyEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
        credentials: "include",
      });

      const res = await response.json();
      console.log(res);

      if (res.message === "success") {
        toast.success('Success... redirecting to login!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        
        // Uncomment if needed for your state management
        // setSignupDisplay("none");
        // setloginDisplayHandler("flex");
        // setverificationDisplayHandler("none");
        
        navigate('/login');
      } else {
        throw new Error('Verification failed');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error in verifying user', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  return (
    <div className="verification-container" style={{ display: VerificationDisplay }}>
      <h2>Verification Code</h2>
      <ToastContainer />
      <p>Enter the code sent to your email:</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter code"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit" className="btn">Verify</button>
      </form>
    </div>
  );
};

export default VerificationCode;
