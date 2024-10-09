import "../../stylings/styles.css"
import React, { useState, useEffect } from 'react';

function TestPage() {
  const [carDetails, setCarDetails] = useState({
    carMake: '',
    carBrand: '',
    carYear: '',
    carEngineType: '',
  });

  useEffect(() => {
    // Read car details from cookies
    const carMake = readCookie('carMake');
    const carBrand = readCookie('carBrand');
    const carYear = readCookie('carYear');
    const carEngineType = readCookie('carEngineType');
    const faultCode = readCookie('faultCode');

    // Set car details in state
    setCarDetails({
      carMake,
      carBrand,
      carYear,
      carEngineType,
      faultCode
    });
  }, []);

  return (
    <div className="headTest">
      <div>Hello, this is the test page</div>
      <p>Car Make: {carDetails.carMake}</p>
      <p>Car Brand: {carDetails.carBrand}</p>
      <p>Car Year: {carDetails.carYear}</p>
      <p>Car Engine Type: {carDetails.carEngineType}</p>
      <p>Car faultCode: {carDetails.faultCode}</p>
    </div>
  );
}

export default TestPage;