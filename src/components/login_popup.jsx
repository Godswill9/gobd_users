import React, { useEffect, useState } from 'react';
import '../../stylings/styles.css';
import Cookies from 'js-cookie';

const Login = ({loginDisplay, setloginDisplayHandler, setSignupDisplay, setverificationDisplayHandler, setwrapperDisplayHandler}) => {
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    console.log(data)
    e.preventDefault()
    await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.status === "success") {
            // Save the response data to cookies
            Cookies.set('jwt_user', res.accessToken, { expires: 7 }); // Set cookie to expire in 7 days
            // Redirect to the user's page
            setTimeout(()=>{
               window.location.href = `${import.meta.env.VITE_CLIENT_URL}/${res.username}`;
            })
           
        }
    })
      .catch((e)=>{
        console.log(e)
        alert(e)
      })
  };

  const handleSignup = () =>{
    setloginDisplayHandler("none")
    setSignupDisplay("flex")
    setwrapperDisplayHandler("flex")
  }

  
  useEffect(()=>{
    setwrapperDisplayHandler("none")
  },[])
  


  return (
    <div className="login-container" style={{display: loginDisplay}}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name='email'
          placeholder="Email"
          required
          value={data.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name='password'
          placeholder="Password"
          required
          value={data.password}
          onChange={handleChange}
        />
        <button type="submit" className="btn">Login</button>
      </form>
      <p>
        Don't have an account? <button onClick={handleSignup}>Sign up</button>
      </p>
    </div>
  );
};

export default Login;
