import "../../stylings/styles.css";
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

function TestPage() {
  const { car } = useParams();
  
  // Split the car string to get individual parameters
  const params = new URLSearchParams(car.replace(/&/g, '&'));
  const carMake = params.get('a') || '';
  const carBrand = params.get('b') || '';
  const carYear = params.get('c') || '';
  const carEngineType = params.get('d') || '';
  const faultCode = params.get('e') || '';

  const [carDetails, setCarDetails] = useState({
    carMake,
    carBrand,
    carYear,
    carEngineType,
    faultCode,
  });

  return (
    <div className="headTest">
      <div>Hello, this is the test page</div>
      <p>Car Make: {carDetails.carMake}</p>
      <p>Car Brand: {carDetails.carBrand}</p>
      <p>Car Year: {carDetails.carYear}</p>
      <p>Car Engine Type: {carDetails.carEngineType}</p>
      <p>Fault Code: {carDetails.faultCode}</p>
    </div>
  );
}

export default TestPage;
