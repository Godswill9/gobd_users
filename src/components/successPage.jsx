import React, { useEffect, useState } from 'react';
import '../../stylings/styles.css';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from './appContext';
import Cookies from 'js-cookie';

const SuccessPage = () => {
    const { data } = useAppContext();
    const [loading, setLoading] = useState(true);
    const make = localStorage.getItem('car_make');
    const model = localStorage.getItem('car_model');
    const year = localStorage.getItem('car_year');
    const type = localStorage.getItem('engine_type');
    const fault_code = localStorage.getItem('fault_code');
    const navigate = useNavigate();


    var token= Cookies.get("jwt_user")


    // useEffect(() => {
    //     const handleAsyncOperations = async () => {
    //         setLoading(true); // Set loading to true before starting operations
    //             try {
    //                 console.log(data)
    //                 // Update user information
    //                 await updateUser();
    //             } catch (error) {
    //                 console.error('Error during async operations:', error);
    //             }
            
    //         setLoading(false); // Set loading to false after operations
    //     };
    
    //     handleAsyncOperations();
    // }, [data]);

    // const checkUser = async (token) => {
    //     try {
    //       const res = await fetch(`${import.meta.env.VITE_API_URL}/verifyMeWithData`, {
    //         method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ jwt_user:token}),
    //     });
    //       const data = await res.json();
    //       savePayment(data.user)
    //       updateUser(data.user)
    //     } catch (error) {
    //       console.error('Error:', error);
       
    //     }
    //   };
    

    const getUser = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/getUser/${Cookies.get("email")}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                });
            if (!response.ok) {
                throw new Error('Failed to update user');
            }
           const data= await response.json(); // Optionally handle response if needed
           updateUser(data)
           savePayment(data)
           loginUser()
          } catch (error) {
            console.error('User update error:', error);
        }
    };
    const updateUser = async (data) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/updateUser/${data.email}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subscription_status: "active", id: data.id }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }
           } catch (error) {
            console.error('User update error:', error);
        }
    };

    const savePayment = async (data) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/savePayment`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: data.id, amount: 5000, subscription_plan: "MONTHLY", payment_status: "completed" }),
            });

            if (!response.ok) {
                throw new Error('Failed to save payment');
            }
            // window.location.href = `/${Cookies.get("email")}/paid`; 
        } catch (error) {
            console.error('Payment saving error:', error);
        }
    };

    
    const loginUser = async () => {
        var email= Cookies.get("email")
        var userPass= Cookies.get("userPass")
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email:Cookies.get("email"), password:Cookies.get("password")}),
                credentials: "include",
            });

            const res = await response.json();

            if (res.status === "success") {
                Cookies.set('email', res.email, { expires: 30 })
                // Cookies.set('jwt_user', res.accessToken, { expires: 30 });
                window.location.href = `/${Cookies.get("email")}/paid`; 
            } else {
                handleError(res.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            handleError('Error during login!');
        }
    };

    useEffect(() => {
        getUser() 
      }, []);

    // Show loading state while waiting for operations to complete
    if (loading) {
        return <div>Loading...</div>; // You can customize this message or component
    }

    return (
        <div className="success-page">
            <h2>Payment Successful! 🎉🤝</h2>
            <p>Your payment has been processed successfully.</p>
            <p>Redirecting you now...</p>
        </div>
    );
};

export default SuccessPage;

