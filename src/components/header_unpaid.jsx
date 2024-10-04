// PlainHeader.js
import React from 'react';
import "../../stylings/styles.css"

const HeaderUnpaid = ({ username, onSubscribe }) => {

  const payHandler = () => {
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
          localStorage.setItem("ref", res.data.reference);
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
    <header className="plain-header">
      <h2>Subscribe for full experience!👌👍</h2>
      <button onClick={onSubscribe} className="subscribe-button">Subscribe</button>
    </header>
  );
};

export default HeaderUnpaid;
