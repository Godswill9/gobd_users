// PlainHeader.js
import React from 'react';
import "../../stylings/styles.css"

const HeaderUnpaid = ({ username, onSubscribe }) => {
  return (
    <header className="plain-header">
      <h2>Subscribe to enjoy all the features!</h2>
      <button onClick={onSubscribe} className="subscribe-button">Subscribe</button>
    </header>
  );
};

export default HeaderUnpaid;
