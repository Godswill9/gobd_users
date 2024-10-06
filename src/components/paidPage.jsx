import React, { useState, useEffect, useRef } from 'react';
import "../../stylings/styles.css";
import SubscriptionSuccessHeader from './header_subscribe.jsx';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from './appContext.jsx';
import AnimatedMessage from './AnimatedMessage'; // Import the AnimatedMessage component

export default function PaidPage() {
  const { data, loginStatus } = useAppContext();
  const [inputMessage, setInputMessage] = useState('');
  const { user } = useParams();
  const [messages, setMessages] = useState([]);
  const [requestCount, setRequestCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const innerContRef = useRef(null);
  const navigate = useNavigate();
  const firstMessageCalled = useRef(false); // To track if the first message has been called

  // Retrieve from localStorage
  const make = localStorage.getItem('car_make');
  const model = localStorage.getItem('car_model');
  const year = localStorage.getItem('car_year');
  const type = localStorage.getItem('engine_type');
  const fault_code = localStorage.getItem('fault_code');

  const displayOnScreen = (elem, role) => {
    setMessages(prevMessages => [...prevMessages, { elem, role }]);
    console.log(messages);
  };

  const replyMessage = async (message) => {
    setLoading(true);
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
          aiType:"PAID"
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
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const firstMessage = async () => {
    setLoading(true);
    const message = `As a mechanic, for the ${year} ${make} ${model} with fault code ${fault_code}, provide details on its meaning, symptoms, potential causes, and possible solutions. Use asterisks to separate the headings: **Meaning**, **Symptoms**, **Potential Causes**, and **Possible Solutions**. Keep it concise and informative.`;
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
          requestCount
        }),
      });
      const dataAi = await res.json();

      if (dataAi.data) {
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

  // useEffect(() => {
  //   if (data && !firstMessageCalled.current) {
  //     firstMessage(); // Call firstMessage only if data is ready and not already called
  //     firstMessageCalled.current = true; // Mark as called
  //   }
  // }, [data]);

  useEffect(() => {
  //   // const timeoutId = setTimeout(() => {
  //   //   if (!data || loginStatus===false) {
  //   //     navigate(`/${make}/${model}/${year}/${type}/${fault_code}`);
  //   //   } else {
  //       // navigate(`/${data.username}/paid`);
  //   //   }
  //   // }, 100);

    if (innerContRef.current) {
      innerContRef.current.scrollTop = innerContRef.current.scrollHeight;
    }

  //   return () => clearTimeout(timeoutId);
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
