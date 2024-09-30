import React from 'react';
import '../../stylings/styles.css';

const ErrorPage = () => {
    return (
        <div className="error-page">
            <h2>Payment Failed</h2>
            <p>There was an issue with your payment. Please try again.</p>
            <a href="/retry" className="btn">Retry Payment</a><br></br>
            <a href="/home" className="btn secondary">Go to Home</a>
        </div>
    );
};

export default ErrorPage;
