import React, { useState } from 'react';
import '../../stylings/styles.css';

const VerificationCode = ({VerificationDisplay, setloginDisplayHandler, setverificationDisplayHandler, setSignupDisplay}) => {
  const [code, setCode] = useState('');

  const handleSubmit = async (e) => {
    console.log(code)
    e.preventDefault()
    await fetch(`${import.meta.env.VITE_API_URL}/verifyEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({code:code}),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if(res.message == "success"){
          setSignupDisplay("none")
          setloginDisplayHandler("flex")
          setverificationDisplayHandler("none")
        }
      })
      .catch((e)=>{
        console.log(e)
      })
  };


  return (
    <div className="verification-container" style={{display: VerificationDisplay}}>
      <h2>Verification Code</h2>
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
