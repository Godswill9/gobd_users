import "../../stylings/styles.css";
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import HeaderUnpaid from "./header_unpaid";
import AnimatedMessage from "./AnimatedMessage";
import Cookies from 'js-cookie';

function TestPage() {
  const { car } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const innerContRef = useRef(null);
  const sendButtonRef = useRef(null);
  const navigate = useNavigate();
  const firstMessageCalled = useRef(false);


  // const make = localStorage.getItem('car_make');
  // const model = localStorage.getItem('car_model');
  // const year = localStorage.getItem('car_year');
  // const type = localStorage.getItem('engine_type');
  // const fault_code = localStorage.getItem('fault_code');

// var val= Cookies.get("jwt_test")
var token= Cookies.get("jwt_user")

  // Split the car string to get individual parameters
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

  const handleSubscribe = () => {
    navigate('/checkout')
  };

  Cookies.set('car_make', carDetails.carMake, { expires: 30 }); // Set cookie to expire in 30 days
Cookies.set('car_model', carDetails.carBrand, { expires: 30 }); // Set cookie to expire in 30 days
Cookies.set('car_year', carDetails.carYear, { expires: 30 }); // Set cookie to expire in 30 days
Cookies.set('engine_type', carDetails.carEngineType, { expires: 30 }); // Set cookie to expire in 30 days
Cookies.set('fault_code', processAndTrim(carDetails.faultCode), { expires: 30 }); // Set cookie to expire in 30 days


console.log(processAndTrim(carDetails.faultCode))

  const displayOnScreen = (elem, role, options = []) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { elem, role, options }
    ]);
    if (innerContRef.current) {
      innerContRef.current.scrollTop = innerContRef.current.scrollHeight;
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    displayOnScreen(inputMessage, 'sender');
    setInputMessage('');
    if (innerContRef.current) {
      innerContRef.current.scrollTop = innerContRef.current.scrollHeight;
    }
    replyMessage(inputMessage);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
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
      // console.error('Error:', error);
      displayOnScreen(
        `Ensure internet connection is on and reload`,
        "errorMessage"
      );
    }finally {
      setLoading(false);
    }
  };

  
  const firstMessage = async () => {
    setLoading(true);
    // if(val2){
    //   displayOnScreen(val2, 'others');
    // }else{

    // }
    const message = generateMechanicPrompt(carDetails);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL_LL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
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
      displayOnScreen(
        `Ensure internet connection is on and reload`,
        "errorMessage"
      );
    } finally {
      setLoading(false);
    }
  };


  
  useEffect(() => {
    if (!firstMessageCalled.current) {
      firstMessage(); // Call firstMessage only if data is ready and not already called
      firstMessageCalled.current = true; // Mark as called
    }
  }, []);

  
  const checkUser = async (token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/verifyMeWithData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ jwt_user:token}),
    });
      const data = await res.json();
      const timeoutId = setTimeout(() => {
        if (!data || data.message=="login first") {
      const carString = `${encodeURIComponent(carDetails.carMake)}&${encodeURIComponent(carDetails.carBrand)}&${encodeURIComponent(carDetails.carYear)}&${encodeURIComponent(carDetails.carEngineType)}&${encodeURIComponent(carDetails.faultCode)}`;
          navigate(`/${carString}`);
     } else {
          navigate(`/${data.username}/paid`);
        }
      }, 100);

      return () => clearTimeout(timeoutId);
  
    } catch (error) {
      console.error('Error:', error);
   
    }
  };

useEffect(() => {
  checkUser(token)  
}, []);



  useEffect(()=>{
    if (innerContRef.current) {
      innerContRef.current.scrollTop = innerContRef.current.scrollHeight;
    }
  },[])


  return (
     <div className="container">
      <div className="cont_header">
        <HeaderUnpaid onSubscribe={handleSubscribe} login={()=>navigate(`/login`)}/>
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

export default TestPage;


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

function processAndTrim(input) {
  // Split the input string into an array
  const inputArray = input.split(", ").map((item) => item.trim());

  // Helper function to trim a single value to 5 characters
  const trimString = (value) => (value.length > 5 ? value.slice(0, 5) : value);

  // Process each item in the array
  const trimmedArray = inputArray.map(trimString);

  // Return the trimmed array as a string (comma-separated)
  return trimmedArray.join(", ");
}


function generateMechanicPrompt(carDetails) {
    // Ensure fault codes are properly trimmed and formatted
    const trimmedFaultCodes = processAndTrim(carDetails.faultCode);
    const faultCodeList = trimmedFaultCodes.split(", ");

    // Generate a dynamic part of the message based on the number of codes
    const faultCodeMessage = faultCodeList.length === 1
        ? `fault code ${faultCodeList[0]}`
        : `fault codes: ${faultCodeList.join(", ")}`;

    // Craft the full message
    return `As a mechanic, for the ${carDetails.carYear} ${carDetails.carMake} ${carDetails.carBrand} with ${faultCodeMessage}, provide details on each code including its **Meaning**, **Symptoms**, **Potential Causes**, and **Possible Solutions**. Use asterisks to separate the headings. Keep your explanations concise and informative to a wide audience, with a maximum of 170 words.`;
}
