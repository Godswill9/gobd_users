import React, { useEffect, useState } from 'react';
import '../../stylings/styles.css';

const Signup = ({SignupDisplay,  setloginDisplayHandler,setverificationDisplayHandler, setSignupDisplay, setwrapperDisplayHandler, car_make, car_model, car_year, engine_type }) => {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    code:generateRandomString(13)
  });

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  function generateRandomString(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    return randomString;
  }
  


  const handleLogin = () =>{
    setloginDisplayHandler("flex")
    setSignupDisplay("none")
    setwrapperDisplayHandler("flex")
  }

  useEffect(()=>{
    setwrapperDisplayHandler("none")
    // console.log(car_make, car_model, car_year)
  },[])

  const handleSubmit = async (e) => {
    const additionalData = {
      car_make: car_make,
      car_model: car_model,
      car_year: car_year,
      engine_type: engine_type,
    };
  
  const combinedData = {
      ...data,
      ...additionalData,
    };
  
    console.log(combinedData)
    e.preventDefault()
    await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(combinedData),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if(res.status == "success"){
          setSignupDisplay("none")
          setwrapperDisplayHandler("none")
          setverificationDisplayHandler("flex")
        }
      })
      .catch((e)=>{
        console.log(e)
        alert(e)
      })
  };



  return (
    <div className="signup-container" style={{display:SignupDisplay}}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User name"
          required
          name='username'
          // value={name}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          required
          name='email'
          // value={email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          required
          name='password'
          // value={password}
          onChange={handleChange}
        />
        <input
          type="number"
          placeholder="123-456-7890" 
          required
          name='phoneNumber'
          onChange={handleChange}
        />
        <button type="submit" className="btn">Sign Up</button>
      </form>
      <p>
        Don't have an account? <button onClick={handleLogin}>Login</button>
      </p>
    </div>
  );
};

export default Signup;
