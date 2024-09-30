// LoggedInHeader.js
import React from 'react';
import "../../stylings/styles.css"

const LoggedInHeader = ({ user, pay }) => {
  return (
    <header className="logged-in-header">
      <h2>Welcome, {user}!. <i style={{fontSize:"15px", marginLeft:"20px"}}>(Subscribe now @ 5000 naira/month)</i></h2>
      <button onClick={pay} className="subscribe-button">Proceed</button>
    </header>
  );
};

export default LoggedInHeader;
