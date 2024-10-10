import "../../stylings/styles.css";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function TestPage() {
  const [carDetails, setCarDetails] = useState({
    carMake: '',
    carBrand: '',
    carYear: '',
    carEngineType: '',
    faultCode: '',
  });

  useEffect(() => {
    // Read car details from cookies
    const carMake = Cookies.get('carMake') || '';
    const carBrand = Cookies.get('carBrand') || '';
    const carYear = Cookies.get('carYear') || '';
    const carEngineType = Cookies.get('carEngineType') || '';
    const faultCode = Cookies.get('faultCode') || '';

    // Set car details in state
    setCarDetails({
      carMake,
      carBrand,
      carYear,
      carEngineType,
      faultCode,
    });
  }, []);

  return (
    <div className="headTest">
      <div>Hello, this is the test page</div>
      <p>Car Make: {carDetails.carMake}</p>
      <p>Car Brand: {carDetails.carBrand}</p>
      <p>Car Year: {carDetails.carYear}</p>
      <p>Car Engine Type: {carDetails.carEngineType}</p>
      <p>Car Fault Code: {carDetails.faultCode}</p>
    </div>
  );
}

export default TestPage;
