import React, { useState } from 'react';
import '../../stylings/styles.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const Login = ({ loginDisplay, setloginDisplayHandler, setSignupDisplay, setverificationDisplayHandler, setwrapperDisplayHandler }) => {
  const [data, setData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const res = await response.json();
      console.log(res);

      if (res.status === "success") {
        toast.success('Login success!', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });

        // Save the response data to cookies
        // Cookies.set('jwt_user', res.accessToken, { expires: 7 }); // Set cookie to expire in 7 days

        // Redirect to the user's page
        setTimeout(() => {
          navigate(`/${res.username}/paid`); // Using navigate for a better approach
        }, 1000);
      } else {
        toast.error(res.message || 'Login failed. Please try again.', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Error during login!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container" style={{ display: loginDisplay }}>
     <h2>Login</h2>
     
      <ToastContainer />
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
      {/* <p>
        Don't have an account? <button onClick={handleSignup}>Sign up</button>
      </p> */}
    </div>
  );
};

export default Login;
