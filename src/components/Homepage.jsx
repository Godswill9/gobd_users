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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AnimatedMessage from './AnimatedMessage'; // Import the AnimatedMessage component


export default function Homepage() {
  const { data, loginStatus } = useAppContext();
  const [inputMessage, setInputMessage] = useState('');
  // const { car_make, car_model, car_year, engine_type, fault_code } = useParams();
  const { car } = useParams();
  const [messages, setMessages] = useState([]);
  const [loginDisplayHandler, setloginDisplayHandler] = useState("none");
  const [verificationDisplayHandler, setverificationDisplayHandler] = useState("none");
  const [signupDisplayHandler, setsignupDisplayHandler] = useState("none");
  const [wrapperDisplayHandler, setwrapperDisplayHandler] = useState("none");
  const [requestCount, setRequestCount] = useState(0);
  const innerContRef = useRef(null);
  const sendButtonRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const firstMessageCalled = useRef(false); // To track if the first message has been called
  const parseCarParams = (carString) => {
    const paramsArray = carString.split('&');
    return {
      carMake: paramsArray[0] || '',
      carBrand: paramsArray[1] || '',
      carYear: paramsArray[2] || '',
      carEngineType: paramsArray[3] || '',
      faultCode: paramsArray[4] || '',
    };
  };
  const carDetails = parseCarParams(car);

  var car_make = carDetails.carMake
  var car_model = carDetails.carBrand
  var car_year = carDetails.carYear
  var engine_type = carDetails.carEngineType
  var fault_code = carDetails.faultCode
  
    localStorage.setItem('car_make', car_make);
    localStorage.setItem('car_model', car_model);
    localStorage.setItem('car_year', car_year);
    localStorage.setItem('engine_type', engine_type);
    localStorage.setItem('fault_code', fault_code);

  const displayOnScreen = (elem, role, options = []) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { elem, role, options }
    ]);
  };

  const replyMessage = async (message) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL_LL}`, {
        method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message:message, requestCount:requestCount, aiType:"FREE" }),
    });
      const data = await res.json();

      if (data.data) {
        setRequestCount((count) => count + 1);
        if (data.data=="EXHAUSTED" ) {
          displayOnScreen(
            formatStringAndWrapDivs( `You've reached the limit of your free trial. To get full access, click <a href="/checkout" class="paymentLink">here</a> to subscribe. Existing user? Click <a href="/login" class="paymentLink">here</a> to log in.`),
            'receiver'
          )
          setTimeout(()=>{
            displayOnScreen(
              `Click <a href="https://findmechanics.asoroautomotive.com/?_gl=1*z1hic2*_ga*MjA2MTUzMTU1My4xNzA3MjkxMDY1*_ga_NBETF1R9H5*MTcwNzI5MTA2NS4xLjEuMTcwNzI5MTA3MC4wLjAuMA.." class="paymentLink" target="_">Here</a> to find available mechanics`,
              "others"
            );
          },3000)
        }
        else{
          displayOnScreen(formatStringAndWrapDivs(data.data), 'receiver');
          setTimeout(()=>{
            displayOnScreen(
              `Click <a href="https://findmechanics.asoroautomotive.com/?_gl=1*z1hic2*_ga*MjA2MTUzMTU1My4xNzA3MjkxMDY1*_ga_NBETF1R9H5*MTcwNzI5MTA2NS4xLjEuMTcwNzI5MTA3MC4wLjAuMA.." class="paymentLink" target="_">Here</a> to find available mechanics`,
              "others"
            );
          },3000)
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }finally {
      setLoading(false);
    }
  };

  
  const firstMessage = async () => {
    setLoading(true);
    const message = `As a mechanic, for the ${car_year} ${car_make} ${car_model} with fault code ${fault_code}, provide details on its meaning, symptoms, potential causes, and possible solutions. Use asterisks to separate the headings: **Meaning**, **Symptoms**, **Potential Causes**, and **Possible Solutions**. Keep it concise and informative, not more than 70 words `;
   try {
      const res = await fetch(`${import.meta.env.VITE_API_URL_LL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          car_make: car_make,
          car_model:car_model,
          car_year:car_year,
          fault_code:fault_code,
          engine_type:engine_type,
          requestCount,
          aiType:"FREE"
        }),
      });
      const dataAi = await res.json();

      if (dataAi.data) {
        setRequestCount((count) => count + 1);
          displayOnScreen(formatStringAndWrapDivs(dataAi.data), 'receiver');
          setTimeout(()=>{
            displayOnScreen(
              `Click <a href="https://findmechanics.asoroautomotive.com/?_gl=1*z1hic2*_ga*MjA2MTUzMTU1My4xNzA3MjkxMDY1*_ga_NBETF1R9H5*MTcwNzI5MTA2NS4xLjEuMTcwNzI5MTA3MC4wLjAuMA.." class="paymentLink" target="_">Here</a> to find available mechanics`,
              "others"
            );
          },3000)
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
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
  
  useEffect(() => {
    if (!firstMessageCalled.current) {
      firstMessage(); // Call firstMessage only if data is ready and not already called
      firstMessageCalled.current = true; // Mark as called
    }
  }, []);


  const handleSubscribe = () => {
    navigate('/checkout')
  };


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!data) {
        // Use encodeURIComponent to ensure the URL is valid
        const carString = `${encodeURIComponent(car_make)}&${encodeURIComponent(car_model)}&${encodeURIComponent(car_year)}&${encodeURIComponent(engine_type)}&${encodeURIComponent(fault_code)}`;
        navigate(`/${carString}`);
      } else {
        navigate(`/${data.username}/paid`); // Redirect on success
      }
    }, 100);
  
    if (innerContRef.current) {
      innerContRef.current.scrollTop = innerContRef.current.scrollHeight;
    }
  
    return () => clearTimeout(timeoutId); // Clean up the timeout
  }, [data, loginStatus, navigate, car_make, car_model, car_year, engine_type, fault_code]);
  
  
  return (
    <div className="container">
      <div className="cont_header">
        <HeaderUnpaid onSubscribe={handleSubscribe} />
      </div>
      <div className="innerCont" ref={innerContRef}>
        {/* <AnimatedMessage role="reciever" /> */}
        {messages.map((msg, index) => {
          const isError = msg.elem.includes("An error occurred");
          const messageClass = isError ? 'errorMessage' : msg.role;

          // Show AnimatedMessage if loading

          return (
            <div key={index} className={messageClass}>
              <div className={`${messageClass}Inner`} dangerouslySetInnerHTML={{ __html: msg.elem }} />
            </div>
          );
        })}
        {loading && !messages.some(msg => msg.role === 'reciever' && loading) && (
          <AnimatedMessage role="reciever" />
        )}
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
  );
}

function formatStringAndWrapDivs(inputString) {
  const urlPattern = /(\bhttps?:\/\/[^\s]+\.[a-z]{2,6}\b)/gi;
  const emailPattern = /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,6}/gi;

  const urls = [];
  let urlMap = {};

  // Replace URLs with placeholders
  let placeholderText = inputString.replace(urlPattern, (url, offset) => {
      const beforeText = inputString.slice(0, offset);
      const afterText = inputString.slice(offset + url.length);
      const isEmail = emailPattern.test(beforeText) || emailPattern.test(afterText);

      if (!isEmail) {
          const placeholder = `__URL_PLACEHOLDER_${urls.length}__`;
          urls.push(url);
          urlMap[placeholder] = url;
          return placeholder;
      }
      return url;
  });

  // Split the text into sentences
  const sentences = placeholderText.split('.');

  let modifiedText = "";
  sentences.forEach((sentence) => {
      const trimmedSentence = sentence.trim();
      if (trimmedSentence) {
          // Make the bold formatting changes
          const formattedSentence = trimmedSentence.replace(/\*\*(.*?)\*\*/, '<div style="display: block; text-decoration: underline;"><b>$1</b></div>');
          modifiedText += `<div style="margin-bottom: 10px;">${formattedSentence}.</div>`;
      }
  });

  // Replace URL placeholders with the original URLs
  modifiedText = modifiedText.replace(/__URL_PLACEHOLDER_\d+__/g, (placeholder) => {
      return urlMap[placeholder] || placeholder;
  });

  return modifiedText;
}
