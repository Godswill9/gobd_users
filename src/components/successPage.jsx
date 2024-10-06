import React, { useEffect, useState } from 'react';
import '../../stylings/styles.css';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from './appContext';

const SuccessPage = () => {
    const { data } = useAppContext();
    const [loading, setLoading] = useState(true);
    const make = localStorage.getItem('car_make');
    const model = localStorage.getItem('car_model');
    const year = localStorage.getItem('car_year');
    const type = localStorage.getItem('engine_type');
    const fault_code = localStorage.getItem('fault_code');
    const navigate = useNavigate();

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

    useEffect(() => {
        // const handleAsyncOperations = async () => {
        //     setLoading(true); // Set loading to true before starting operations
        //         try {
        //             await savePayment();
                    window.location.href = `/${localStorage.getItem("email")}/paid`; // Redirect using window.location
        //         } catch (error) {
        //             console.error('Error during async operations:', error);
        //         }
            
        //     setLoading(false); // Set loading to false after operations
        // };
    
        // handleAsyncOperations();
    }, []);
    

    const updateUser = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/updateUser/${data.email}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subscription_status: data.subscription_status, id: data.id }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }
            await response.json(); // Optionally handle response if needed
        } catch (error) {
            console.error('User update error:', error);
        }
    };

    const savePayment = async () => {
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
            await response.json(); // Optionally handle response if needed
            setTimeout(()=>{
                 window.location.href = `/${data.username}/paid`; 
            },3000)
            // navigate(`/${data.username}/paid`);
        } catch (error) {
            console.error('Payment saving error:', error);
        }
    };

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

