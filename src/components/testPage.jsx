import "../../stylings/styles.css";
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import HeaderUnpaid from "./header_unpaid";
import AnimatedMessage from "./AnimatedMessage";
import Cookies from 'js-cookie';

function TestPage() {
  const { car } = useParams();
  const [messages, setMessages] = useState([]);
  const [conversation , setConversation ] = useState([]);
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
// var token= localStorage.getItem("jwt_user")

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
Cookies.set('fault_code',  cleanFaultCodes(carDetails.faultCode), { expires: 30 }); // Set cookie to expire in 30 days


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
    setConversation(prevConversation => [...prevConversation, message]);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL_LL}`, {
        method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message:message, requestCount:requestCount, aiType:"FREE", conversation:conversation }),
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
          },1000)
        }
        else{
          displayOnScreen(formatStringAndWrapDivs(data.data), 'receiver');
          setTimeout(()=>{
            displayOnScreen(
              `Click <a href="https://findmechanics.asoroautomotive.com/?_gl=1*z1hic2*_ga*MjA2MTUzMTU1My4xNzA3MjkxMDY1*_ga_NBETF1R9H5*MTcwNzI5MTA2NS4xLjEuMTcwNzI5MTA3MC4wLjAuMA.." class="paymentLink" target="_">Here</a> to find available mechanics`,
              "others"
            );
          },1000)
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
    const message = generateMechanicPrompt(carDetails);
    setConversation(prevConversation => [...prevConversation, message]);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL_LL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          requestCount,
          aiType:"FREE",
          conversation:conversation 
        }),
      });
      const dataAi = await res.json();

      if (dataAi.data) {
        setRequestCount((count) => count + 1);
          // displayOnScreen(dataAi.data, 'receiver');
          displayOnScreen(formatStringAndWrapDivs(dataAi.data), 'receiver');
          // displayOnScreen(formatStringAndWrapDivs(dataAi.data), 'receiver');
          setTimeout(()=>{
            displayOnScreen(
              `Click <a href="https://findmechanics.asoroautomotive.com/?_gl=1*z1hic2*_ga*MjA2MTUzMTU1My4xNzA3MjkxMDY1*_ga_NBETF1R9H5*MTcwNzI5MTA2NS4xLjEuMTcwNzI5MTA3MC4wLjAuMA.." class="paymentLink" target="_">Here</a> to find available mechanics`,
              "others"
            );
          },1000)
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
  const errFirstMessage = async (email) => {
    setLoading(true);
    setRequestCount((count) => count + 1);
    try {
      displayOnScreen(
        formatStringAndWrapDivs( `You've reached the limit of your free trial. To get full access, click <a href="/checkout" class="paymentLink">here</a> to subscribe. This is your email: ${email}`),
        'receiver'
      )
      setTimeout(()=>{
        displayOnScreen(
          `Click <a href="https://findmechanics.asoroautomotive.com/?_gl=1*z1hic2*_ga*MjA2MTUzMTU1My4xNzA3MjkxMDY1*_ga_NBETF1R9H5*MTcwNzI5MTA2NS4xLjEuMTcwNzI5MTA3MC4wLjAuMA.." class="paymentLink" target="_">Here</a> to find available mechanics`,
          "others"
        );
      },1000)
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

  const userChecker = async (email) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/checkDiagnosticsValidity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email:email
        }),
      }).then((res)=>res.json())
      .then((res)=>{
        console.log(res)
        if(res.message !== "Continue" ){
          errFirstMessage(email);
        }else{
          firstMessage();
        }
      })
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


  
  // useEffect(() => {
  //   if (!firstMessageCalled.current) {
  //     firstMessage(); // Call firstMessage only if data is ready and not already called
  //     firstMessageCalled.current = true; // Mark as called
  //   }
  // }, []);

  
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
          userChecker(data.email)
     } else {
          navigate(`/${data.username}/paid`);
        }
      }, 100);

      return () => clearTimeout(timeoutId);
  
    } catch (error) {
      console.error('Error:', error);
   
    }
  };

// useEffect(() => {
//   checkUser(token)  
// }, []);

useEffect(() => {
    if (!firstMessageCalled.current) {
      checkUser(token); // Call firstMessage only if data is ready and not already called
      firstMessageCalled.current = true; // Mark as called
    }
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
          style={{color:"black"}}
        />
        <button ref={sendButtonRef} onClick={handleSendMessage} disabled={!inputMessage.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}

export default TestPage;



// function formatStringAndWrapDivs(inputString) {
//   const urlPattern = /(\bhttps?:\/\/[^\s]+\.[a-z]{2,6}\b)/gi;
//   const emailPattern = /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,6}/gi;

//   const urls = [];
//   const urlMap = {};

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

//   let modifiedText = sentences
//       .map((sentence) => {
//           const trimmedSentence = sentence.trim();
//           if (trimmedSentence) {
//               // Apply bold formatting with div styling
//               return trimmedSentence.replace(
//                   /\*\*(.*?)\*\*/,
//                   '<div style="display: block; text-decoration: underline;"><b>$1</b></div>'
//               );
//           }
//           return '';
//       })
//       .filter((formattedSentence) => formattedSentence.length > 0)
//       .map((formattedSentence) => `<div style="margin-bottom: 10px;">${formattedSentence}.</div>`)
//       .join('');

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

function generateMechanicPrompt(carDetails) {
    // Ensure fault codes are properly trimmed and formatted
    const trimmedFaultCodes = cleanFaultCodes(carDetails.faultCode);
    const faultCodeList = trimmedFaultCodes.split(", ");

    // Generate a dynamic part of the message based on the number of codes
    const faultCodeMessage = faultCodeList.length === 1
        ? `fault code ${faultCodeList[0]}`
        : `fault codes: ${faultCodeList.join(", ")}`;

    // Craft the full message
    // return `As a mechanic, for the ${carDetails.carYear}, ${carDetails.carMake}, ${carDetails.carBrand}, with ${faultCodeMessage}, provide details on each fault code, including its Meaning, Symptoms, Potential Causes, and Possible Solutions. Use asterisks to separate the headings. Keep your explanations concise and informative to a wide audience.`;
    return `As a mechanic, for the ${carDetails.carYear}, ${carDetails.carMake}, ${carDetails.carBrand}, with ${faultCodeMessage}. Give a short, one liner explanation for each fault codes, including its Meaning, Symptoms, Potential Causes, and Possible Solutions, using this format (e.g Symptoms: Poor gas mileage and lack of power.). Use this format (**P0236**) to separate each faultcodes. Explain for all in one chat. Keep your explanations concise and informative to a wide audience. Don't start with an intro or outro. Just go straight to the point for the diagnosis.`;
}


// function formatText(inputText) {
//   // Regular expression to match fault codes (e.g., **P0101**) and labels (e.g., **Symptoms:**)
//   const patterns = [
//     // Match fault codes like **P0101**
//     { regex: /\*\*([A-Za-z0-9]+)\*\*/g, style: 'font-weight: bold; display: block; margin-top:10px; background-color: black; color: orange; padding: 5px; border-radius: 5px;' },
//     // Match labels like **Symptoms:**
//     { regex: /\*\*(Symptoms|Meaning|Potential Causes|Possible Solutions):\*\*/g, style: 'font-weight: bold; text-decoration: underline; display: block;' }
//   ];

//   let formattedText = inputText;

//   // Loop through patterns to apply styles
//   patterns.forEach(pattern => {
//     formattedText = formattedText.replace(pattern.regex, (match, group1) => {
//       // Remove the ** markers and wrap with <span> for styling
//       return `<span style="${pattern.style}">${group1}</span>`;
//     });
//   });

//   return formattedText;
// }

function formatText(inputText) {
   // Define the regex pattern for fault codes like P0101, P0116, etc.
   const faultCodePattern = /\b[A-Za-z]\d{4}:\b/g; 
   
   // Replace the fault codes with styled versions
   const styledText = inputText.replace(faultCodePattern, (match) => {
     return `<div style="font-weight: bold; display: inline-block; margin-top:10px; background-color: black; color: orange; padding: 5px; border-radius: 5px;">${match}</div>`;
   });
 
   return styledText;
}
