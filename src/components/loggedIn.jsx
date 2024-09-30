import React, { useState, useEffect, useRef } from 'react';
import "../../stylings/styles.css";
import HeaderUnpaid from './header_unpaid.jsx';
import SubscriptionSuccessHeader from './header_subscribe.jsx';
import LoggedInHeader from './header_register.jsx';
import Login from './login_popup.jsx';
import VerificationCode from './verify_popup.jsx';
import Signup from './signup_popup.jsx';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from './appContext.jsx';

export default function LoggedInPage() {
  const { data, loginStatus } = useAppContext();
  const [inputMessage, setInputMessage] = useState('');
  const { user } = useParams();
  const [messages, setMessages] = useState([]);
  const [loginDisplayHandler, setLoginDisplayHandler] = useState("none");
  const [verificationDisplayHandler, setVerificationDisplayHandler] = useState("none");
  const [signupDisplayHandler, setSignupDisplayHandler] = useState("none");
  const [wrapperDisplayHandler, setWrapperDisplayHandler] = useState("none");
  const [requestCount, setRequestCount] = useState(0);
  const innerContRef = useRef(null);
  const navigate = useNavigate();
  const [storedValues, setStoredValues] = useState({
    car_make: '',
    car_model: '',
    car_year: '',
    engine_type: '',
  });

  useEffect(() => {
    // Retrieve from localStorage
    const make = localStorage.getItem('car_make');
    const model = localStorage.getItem('car_model');
    const year = localStorage.getItem('car_year');
    const type = localStorage.getItem('engine_type');

    // Update state with retrieved values
    setStoredValues({
      car_make: make,
      car_model: model,
      car_year: year,
      engine_type: type,
    });
  }, []);


  const displayOnScreen = (elem, role, options = []) => {
    setMessages((prevMessages) => [...prevMessages, { elem, role, options }]);
  };

  const replyMessage = async (message) => {
    if (requestCount === 4) {
      displayOnScreen(
        `You've reached the limit of your free trial. Click <a href="https://testwebsite.asoroautomotive.com/contact/" class="paymentLink" target="_">Here</a> to speak with a real mechanic.`,
        'receiver'
      );
      setRequestCount(0);
      return;
    }

    try {
      const res = await fetch('https://aibackend.asoroautomotive.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setRequestCount((count) => count + 1);

      if (data.data) {
        displayOnScreen(data.data, 'receiver');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    displayOnScreen(inputMessage, 'sender');
    setInputMessage('');
    replyMessage(inputMessage);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

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

  const closeAll = () => {
    setLoginDisplayHandler("none");
    setSignupDisplayHandler("none");
    setWrapperDisplayHandler("none");
  };

  useEffect(() => {
    console.log(data);

    const timeoutId = setTimeout(() => {
      if (!data) {
        // console.log("error");
        // navigate('/a/b/c/d'); // Redirect on error
        navigate(`/${storedValues.car_make}/${storedValues.car_model}/${storedValues.car_year}/${storedValues.engine_type}`);
      } else {
        // console.log("good");
        navigate(`/${data.username}`); // Redirect on success
      }
    }, 100);

    setLoginDisplayHandler("none");
    setSignupDisplayHandler("none");
    setVerificationDisplayHandler("none");
    setWrapperDisplayHandler("none");

    if (innerContRef.current) {
      innerContRef.current.scrollTop = innerContRef.current.scrollHeight;
    }

    return () => clearTimeout(timeoutId); // Clean up the timeout
  }, [data, messages, navigate]);

  return (
    <div className="container">
      <div className="cont_header">
        <LoggedInHeader user={user} pay={payHandler} />
      </div>
      <div className="innerCont" ref={innerContRef}>
        <div className="wrapper" style={{ display: wrapperDisplayHandler }} onClick={closeAll}></div>
        {messages.map((msg, index) => (
          <div key={index} className={msg.role}>
            <div className={`${msg.role}Inner`} dangerouslySetInnerHTML={{ __html: msg.elem }} />
          </div>
        ))}
      </div>
      <div className="inputSection">
        <input
          type="text"
          placeholder="Enter your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
