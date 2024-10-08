import React, { useState } from 'react';
import '../../stylings/styles.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const Signup = ({ SignupDisplay, setloginDisplayHandler, setverificationDisplayHandler, setSignupDisplay, setwrapperDisplayHandler, car_make, car_model, car_year, engine_type }) => {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    code: generateRandomString(13)
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  function generateRandomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    return randomString;
  }

  const handleLogin = () => {
    navigate('/login');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const additionalData = {
      car_make,
      car_model,
      car_year,
      engine_type,
    };

    const combinedData = {
      ...data,
      ...additionalData,
    };

    console.log(combinedData);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(combinedData),
        credentials: "include",
      });

      const res = await response.json();
      console.log(res);

      if (res.status === "success") {
        toast.success('Signup successful!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate('/user_verification');
      } else {
        toast.error(res.message || 'Signup failed. Please try again.', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Error in signup. Please try again.', {
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
    <div className="signup-container" style={{ display: SignupDisplay }}>
      <h2>Sign Up</h2>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User name"
          required
          name='username'
          value={data.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          required
          name='email'
          value={data.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          required
          name='password'
          value={data.password}
          onChange={handleChange}
        />
        <input
          type="tel"
          placeholder="123-456-7890"
          required
          name='phoneNumber'
          value={data.phoneNumber}
          onChange={handleChange}
        />
        <button type="submit" className="btn">Sign Up</button>
      </form>
      <p>
        Already have an account? <button onClick={handleLogin}>Login</button>
      </p>
    </div>
  );
};

export default Signup;
