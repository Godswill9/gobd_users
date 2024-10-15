import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../stylings/styles.css';
// import { useAppContext } from './appContext';
import Cookies from 'js-cookie'; // Assuming you use js-cookie for cookie handling
import { toast } from 'react-toastify';

function LoadingPage() {
    // const { data } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        // const ref = localStorage.getItem("ref");
        var ref= Cookies.get("ref")
        if (ref) {
            confirmPayment(ref);
        } else {
            navigate('/error');
        }
    }, [navigate]);

    const confirmPayment = async (ref) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/confirmPayment/${ref}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const responseData = await response.json();

            if (responseData.status === 'payment success') {
                await Promise.all([loginUser()]);
                window.location.href = "/success"; 
            } else {
                console.error(responseData);
                navigate('/error');
            }
        } catch (error) {
            console.error('Payment confirmation error:', error);
            navigate('/error');
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
                Cookies.set('jwt_user', res.accessToken, { expires: 30 });
            } else {
                handleError(res.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            handleError('Error during login!');
        }
    };

    const handleError = (message) => {
        console.error(message);
        toast.error(message, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
        });
        navigate('/error');
    };

    return (
        <div className="loading-page">
            <div className="loader"></div>
            <p>Loading, please wait...</p>
        </div>
    );
}

export default LoadingPage;
