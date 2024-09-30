import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../stylings/styles.css';
import { useAppContext } from './appContext';

function LoadingPage() {
    const { data, loginStatus } = useAppContext();
    // const navigate = useNavigate();

    useEffect(() => {
        confirmPayment(localStorage.getItem("ref"));
    }, []);

    async function confirmPayment(ref) {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/confirmPayment/${ref}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            if (data.status === 'payment success') {
                updateUser()
                savePayment()
                setTimeout(()=>{
                    navigate("/success");
                },50)
            } else {
                console.log(data);
                navigate('/error');
            }
        } catch (error) {
            console.error(error);
            navigate('/error');
        }
    }

    const updateUser=async ()=>{
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/updateUser/${data.email}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({subscription_status:data.subscription_status})
            });
            const data = await response.json();
        } catch (error) {
            console.error(error);
        }
    }
    const savePayment=async ()=>{
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/savePayment`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({user_id:data.id, amount:5000, subscription_plan:"MONTHLY", payment_status:"completed"})
            });
            const data = await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="loading-page">
            <div className="loader"></div>
            <p>Loading, please wait...</p>
        </div>
    );
}

export default LoadingPage;
