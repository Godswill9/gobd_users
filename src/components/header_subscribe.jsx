// SubscriptionSuccessHeader.js
import React from 'react';
import "../../stylings/styles.css"
import { FaCheckCircle } from 'react-icons/fa'; // Importing an icon from react-icons
// import { useAppContext } from './appContext';

const SubscriptionSuccessHeader = ({ username }) => {
  // const { data, fetchData, loginStatus, setFinalAmountHandler } = useAppContext();
  return (
    <header className="subscription-success-header">
      <h2>Welcome, {username}!</h2>
      <div className="success-message">
        <FaCheckCircle className="success-icon" />
        <span>Subscription successful!</span>
      </div>
    </header>
  );
};

export default SubscriptionSuccessHeader;
