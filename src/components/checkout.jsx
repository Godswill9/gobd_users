import React, { useState } from 'react';
import '../../stylings/styles.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';

const Checkout = ({ SignupDisplay, setloginDisplayHandler, setverificationDisplayHandler, setSignupDisplay, setwrapperDisplayHandler, car_make, car_model, car_year, engine_type }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem("email", data.email)
    localStorage.setItem("password", data.password)

    const additionalData = {
      car_make:Cookies.get('car_make'),
      car_model:Cookies.get('car_model'), 
      car_year:Cookies.get('car_year'), 
      engine_type:Cookies.get('engine_type'), 
    };

    // const additionalData = {
    //   car_make:localStorage.getItem("car_make"),
    //   car_model:localStorage.getItem("car_model"),
    //   car_year:localStorage.getItem("car_year"),
    //   engine_type:localStorage.getItem("engine_type"),
    // };

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
        })
        handleVerifyUser()
           // Proceed to payment
        payHandler(data.email); 
      }else if(res.message === "user already exists" && res.result[0].subscription_status === "in-active"){
        payHandler(data.email); 
        console.log(res)
        return;
      } else if(res.message === "user already exists" && res.result[0].subscription_status === "active"){
        toast.success('You are still an active user, redirecting to login...!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        window.location.href = "/login" 
      } 
      else {
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

  const handleVerifyUser = async () => {
    // console.log(code);
    var code = data.code
    
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
        toast.success('Success!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        
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

  const payHandler = () => {
    Cookies.set('email', data.email, { expires: 2});
    Cookies.set('password', data.password, { expires: 2});
    fetch(`${import.meta.env.VITE_API_URL}/acceptPayment`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: data.email}),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.data && res.data.authorization_url) {
          // Redirect using navigate
          window.location.href = res.data.authorization_url; 
          // localStorage.setItem("ref", res.data.reference);
          Cookies.set('ref', res.data.reference, { expires: 2});
        } else {
          console.error("Authorization URL not found in the response.");
          alert('Error: Authorization URL not found');
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="signup-container" style={{ display: SignupDisplay }}>
      <h2>Checkout page</h2>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Create a Username"
          required
          name='username'
          value={data.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Enter a valid email address"
          required
          name='email'
          value={data.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Create a password..."
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
        <button type="submit" className="btn">Proceed to paystack</button>
      </form>
    </div>
  );
};

export default Checkout;
