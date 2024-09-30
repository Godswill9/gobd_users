import React, { useState, useEffect, useRef } from 'react';
import "../../stylings/styles.css";
import HeaderUnpaid from './header_unpaid.jsx';
import SubscriptionSuccessHeader from './header_subscribe.jsx';
import LoggedInHeader from './header_register.jsx';
import Login from './login_popup.jsx';
import VerificationCode from './verify_popup.jsx';
import Signup from './signup_popup.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from './appContext.jsx';

export default function Homepage() {
  const { data, loginStatus } = useAppContext();
    const [inputMessage, setInputMessage] = useState('');
    const { car_make, car_model, car_year, engine_type} = useParams();
    const [messages, setMessages] = useState([]);
    const [loginDisplayHandler, setloginDisplayHandler] = useState([]);
    const [verificationDisplayHandler, setverificationDisplayHandler] = useState([]);
    const [signupDisplayHandler, setsignupDisplayHandler] = useState([]);
    const [wrapperDisplayHandler, setwrapperDisplayHandler] = useState([]);
    const [requestCount, setRequestCount] = useState(0);
    const innerContRef = useRef(null);
    const sendButtonRef = useRef(null);
    const navigate = useNavigate();
    const carDetails = { car_make, car_model, car_year, engine_type };


    useEffect(() => {
      localStorage.setItem('car_make', car_make);
      localStorage.setItem('car_model', car_model);
      localStorage.setItem('car_year', car_year);
      localStorage.setItem('engine_type', engine_type);
    }, [car_make, car_model, car_year, engine_type]);
  
    const displayOnScreen = (elem, role, options = []) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { elem, role, options }
      ]);
    };
  
    const replyMessage = async (message) => {
      if (requestCount === 4) {
        displayOnScreen(
          `You've reached the limit of your free trial. Click <a href="https://testwebsite.asoroautomotive.com/contact/" class="paymentLink" target="_">Here</a> to speak with a real mechanic.`,
          'reciever'
        );
        setRequestCount(0); // Reset or modify as needed
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
  
    const handleSubscribe = () =>{
      setloginDisplayHandler("flex")
      setsignupDisplayHandler("none")
      setwrapperDisplayHandler("flex")
    }
  
    // const handlePaymet = () =>{
    //   setloginDisplayHandler("flex")
    //   setsignupDisplayHandler("none")
    //   setwrapperDisplayHandler("flex")
    // }
  
    const closeAll = () =>{
      setloginDisplayHandler("none")
      setsignupDisplayHandler("none")
      setwrapperDisplayHandler("none")
    }
  
  
    // useEffect(() => {
    //   setloginDisplayHandler("none")
    //   setsignupDisplayHandler("none")
    //   setverificationDisplayHandler("none")
    //   setwrapperDisplayHandler("none")
  
    //   if (innerContRef.current) {
    //     innerContRef.current.scrollTop = innerContRef.current.scrollHeight;
    //   }
    // }, [messages]);

    
  useEffect(() => {
    console.log(data);

    const timeoutId = setTimeout(() => {
      if (!data) {
        // console.log("error");
        navigate(`/${car_make}/${car_model}/${car_year}/${engine_type}`);
      } else {
        // console.log("good");
        navigate(`/${data.username}`); // Redirect on success
      }
    }, 100);

    setloginDisplayHandler("none");
    setsignupDisplayHandler("none");
    setverificationDisplayHandler("none");
    setwrapperDisplayHandler("none");

    if (innerContRef.current) {
      innerContRef.current.scrollTop = innerContRef.current.scrollHeight;
    }

    return () => clearTimeout(timeoutId); // Clean up the timeout
  }, [data, messages, navigate]);

    
  return (
    <div className="container">
    <div className="cont_header">
      {/* <LoggedInHeader /> */}
      <HeaderUnpaid onSubscribe={handleSubscribe}/>
      {/* <SubscriptionSuccessHeader /> */}
    </div>
    <div className="innerCont" ref={innerContRef}>
      <div className="popups">
        <Login loginDisplay={loginDisplayHandler} setloginDisplayHandler={setloginDisplayHandler} setSignupDisplay={setsignupDisplayHandler} setverificationDisplayHandler={setverificationDisplayHandler} setwrapperDisplayHandler={setwrapperDisplayHandler}/>
        <VerificationCode VerificationDisplay={verificationDisplayHandler} setverificationDisplayHandler={setverificationDisplayHandler} setloginDisplayHandler={setloginDisplayHandler} setSignupDisplay={setsignupDisplayHandler} setwrapperDisplayHandler={setwrapperDisplayHandler} />
        <Signup SignupDisplay={signupDisplayHandler} setverificationDisplayHandler={setverificationDisplayHandler} setloginDisplayHandler={setloginDisplayHandler} setSignupDisplay={setsignupDisplayHandler} setwrapperDisplayHandler={setwrapperDisplayHandler} {...carDetails}/>
      </div>
      <div className="wrapper" style={{display: wrapperDisplayHandler}} onClick={closeAll}></div>
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
      <button ref={sendButtonRef} onClick={handleSendMessage} disabled={!inputMessage.trim()}>
        Send
      </button>
    </div>
  </div>
  )
}
