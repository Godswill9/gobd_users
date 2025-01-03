import React, { useState, useEffect, useRef } from 'react';
import "../../stylings/styles.css";
import SubscriptionSuccessHeader from './header_subscribe.jsx';
import { useParams, useNavigate } from 'react-router-dom';
// import { useAppContext } from './appContext.jsx';
import AnimatedMessage from './AnimatedMessage'; // Import the AnimatedMessage component
import Cookies from 'js-cookie';


export default function PaidPage() {
  // const { data, loginStatus } = useAppContext();
  const [inputMessage, setInputMessage] = useState('');
  const { user } = useParams();
  const [messages, setMessages] = useState([]);
  const [requestCount, setRequestCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const innerContRef = useRef(null);
  const [conversation , setConversation ] = useState([]);
  const navigate = useNavigate();
  const firstMessageCalled = useRef(false); // To track if the first message has been called

  // // Retrieve from localStorage
  // const make = localStorage.getItem('car_make');
  // const model = localStorage.getItem('car_model');
  // const year = localStorage.getItem('car_year');
  // const type = localStorage.getItem('engine_type');
  // const fault_code = localStorage.getItem('fault_code');
  
  const make = Cookies.get('car_make');
  const model = Cookies.get('car_model');
  const year = Cookies.get('car_year');
  const type = Cookies.get('engine_type');
  const fault_code = Cookies.get('fault_code');

// var val= Cookies.get("jwt_test")
var token= Cookies.get("jwt_user")


  const displayOnScreen = (elem, role) => {
    setMessages(prevMessages => [...prevMessages, { elem, role }]);
    // console.log(messages);
    if (innerContRef.current) {
      innerContRef.current.scrollTop = innerContRef.current.scrollHeight;
    }
  };

  const replyMessage = async (message) => {
    setLoading(true);
    setConversation(prevConversation => [
      ...prevConversation, 
      { role: "user", content: message }
    ]);
    // console.log(conversation)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL_LL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          car_make: make,
          car_model: model,
          car_year: year,
          fault_code,
          engine_type: type,
          requestCount,
          aiType:"PAID",
          conversation:conversation
        }),
      });
      const dataAi = await res.json();
      setRequestCount(count => count + 1);
      displayOnScreen(formatStringAndWrapDivs(dataAi.data), 'receiver');
      setTimeout(()=>{
        displayOnScreen(
          `Click <a href="https://findmechanics.asoroautomotive.com/?_gl=1*z1hic2*_ga*MjA2MTUzMTU1My4xNzA3MjkxMDY1*_ga_NBETF1R9H5*MTcwNzI5MTA2NS4xLjEuMTcwNzI5MTA3MC4wLjAuMA.." class="paymentLink" target="_">Here</a> to find available mechanics`,
          "others"
        );
      },3000)
    } catch (error) {
      // console.error('Error:', error);
      displayOnScreen(
        `Ensure internet connection is on and reload`,
        "errorMessage"
      );
    } finally {
      setLoading(false);
    }
  };

  const firstMessage = async () => {
    setLoading(true);

    const message = generateMechanicPrompt(fault_code, year, model, make);

    // Add the message with proper structure to the conversation (role: "user" and content: message)
    setConversation(prevConversation => [
      ...prevConversation, 
      { role: "user", content: message }
    ]);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL_LL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          car_make: make,
          car_model: model,
          car_year: year,
          fault_code,
          engine_type: type,
          requestCount,
          aiType: "PAID",
          conversation: [{role: "user", content: message}]
        }),
      });

      const dataAi = await res.json();

      if (dataAi.data) {
        setRequestCount(count => count + 1);
        displayOnScreen(formatStringAndWrapDivs(dataAi.data), 'receiver');
        
        setTimeout(() => {
          displayOnScreen(
            `Click <a href="https://findmechanics.asoroautomotive.com/?_gl=1*z1hic2*_ga*MjA2MTUzMTU1My4xNzA3MjkxMDY1*_ga_NBETF1R9H5*MTcwNzI5MTA2NS4xLjEuMTcwNzI5MTA3MC4wLjAuMA.." class="paymentLink" target="_">Here</a> to find available mechanics`,
            "others"
          );
        }, 3000);
      }
    } catch (error) {
      displayOnScreen(`Ensure internet connection is on and reload`, "errorMessage");
    } finally {
      setLoading(false);
    }
};


  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    displayOnScreen(inputMessage, 'sender');
    setInputMessage('');
    if (innerContRef.current) {
      innerContRef.current.scrollTop = innerContRef.current.scrollHeight;
    }
    replyMessage(`${inputMessage}`);
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
      const carString = `${encodeURIComponent(make)}&${encodeURIComponent(model)}&${encodeURIComponent(year)}&${encodeURIComponent(type)}&${encodeURIComponent(fault_code)}`;
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

  useEffect(() => {
    if (innerContRef.current) {
      innerContRef.current.scrollTop = innerContRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="container">
      <div className="cont_header">
        <SubscriptionSuccessHeader/>
      </div>
      <div className="innerCont" ref={innerContRef}>
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
        <button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
// function formatStringAndWrapDivs(inputString) {
//   const urlPattern = /(\bhttps?:\/\/[^\s]+\.[a-z]{2,6}\b)/gi;
//   const emailPattern = /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,6}/gi;

//   const urls = [];
//   let urlMap = {};

//   // Replace URLs with placeholders
//   let placeholderText = inputString.replace(urlPattern, (url, offset) => {
//       const beforeText = inputString.slice(0, offset);
//       const afterText = inputString.slice(offset + url.length);
//       const isEmail = emailPattern.test(beforeText) || emailPattern.test(afterText);

//       if (!isEmail) {
//           const placeholder = `__URL_PLACEHOLDER_${urls.length}__`;
//           urls.push(url);
//           urlMap[placeholder] = url;
//           return placeholder;
//       }
//       return url;
//   });

//   // Split the text into sentences
//   const sentences = placeholderText.split('.');

//   let modifiedText = "";
//   sentences.forEach((sentence) => {
//       const trimmedSentence = sentence.trim();
//       if (trimmedSentence) {
//           // Make the bold formatting changes
//           const formattedSentence = trimmedSentence.replace(/\*\*(.*?)\*\*/, '<div style="display: block; text-decoration: underline;"><b>$1</b></div>');
//           modifiedText += `<div style="margin-bottom: 10px;">${formattedSentence}.</div>`;
//       }
//   });

//   // Replace URL placeholders with the original URLs
//   modifiedText = modifiedText.replace(/__URL_PLACEHOLDER_\d+__/g, (placeholder) => {
//       return urlMap[placeholder] || placeholder;
//   });

//   return modifiedText;
// }



function formatStringAndWrapDivs(inputString) {
  // Define patterns for URLs, emails, and fault codes
  const urlPattern = /(\bhttps?:\/\/[^\s]+\.[a-z]{2,6}\b)/gi;
  const emailPattern = /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,6}/gi;
  // const faultCodePattern = /\b[A-Za-z]\d{4}:\b/g; // Pattern to match strings like A1234: or b9876:
  const faultCodePattern = /\b\w+:\b/g;
  const urls = [];
  const urlMap = {};

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

  // Replace fault codes with styled and bold spans
  placeholderText = placeholderText.replace(faultCodePattern, (match) => {
      return `<div style="font-weight: bold; display: block; margin-top:10px; background-color: black; color: orange; padding: 5px; border-radius: 5px;"><b>${match}</b></div>`;
  });

  // Split the text into sentences
  const sentences = placeholderText.split('.');

  let modifiedText = sentences
      .map((sentence) => {
          const trimmedSentence = sentence.trim();
          if (trimmedSentence) {
              // Apply bold formatting with div styling for **bold text**
              return trimmedSentence.replace(
                /\*\*(.*?)\*\*/,
                  '<div style="font-weight: bold; margin-top:10px; margin-bottom: 5px; background-color: black; color: orange; padding: 5px; border-radius: 5px;"><b>$1</b></div>'
              );
          }
          return '';
      })
      .filter((formattedSentence) => formattedSentence.length > 0)
      .map((formattedSentence) => `<div style="margin-bottom: 10px;">${formattedSentence}.</div>`)
      .join('');

  // Replace URL placeholders with the original URLs
  modifiedText = modifiedText.replace(/__URL_PLACEHOLDER_\d+__/g, (placeholder) => {
      return urlMap[placeholder] || placeholder;
  });

  return modifiedText;
}


function cleanFaultCodes(input) {
  // Regular expression to match the pattern: "P[0-9A-Z]{4}" or "U[0-9]{4}"
  const regex = /P[0-9A-Z]{4}|U[0-9]{4}/g;

  // Use the `match` method to extract all matching substrings
  const matches = input.match(regex);

  // Join the matches with commas and spaces
  const result = matches.join(', ');

  return result;
}

function generateMechanicPrompt(faultCodes, year, model, make) {
    // Ensure fault codes are properly trimmed and formatted
    const trimmedFaultCodes = cleanFaultCodes(faultCodes);
    const faultCodeList = trimmedFaultCodes.split(", ");

    // Generate a dynamic part of the message based on the number of codes
    const faultCodeMessage = faultCodeList.length === 1
        ? `fault code ${faultCodeList[0]}`
        : `fault codes: ${faultCodeList.join(", ")}`;

    // Craft the full message
    // return `As a mechanic, for the ${carDetails.carYear}, ${carDetails.carMake}, ${carDetails.carBrand}, with ${faultCodeMessage}, provide details on each fault code, including its Meaning, Symptoms, Potential Causes, and Possible Solutions. Use asterisks to separate the headings. Keep your explanations concise and informative to a wide audience.`;
    return `As a mechanic, for the ${year}, ${make}, ${model}, with ${faultCodeMessage}. Give a short, one liner explanation for each fault codes, including its Meaning, Symptoms, Potential Causes, and Possible Solutions, using this format (e.g Symptoms: Poor gas mileage and lack of power.). Use this format (**P0236**) to separate each faultcodes. Explain for all in one chat. Keep your explanations concise and informative to a wide audience. Don't start with an intro or outro. Just go straight to the point for the diagnosis.`;
}