import "../../stylings/styles.css";
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

function TestPage() {
  const { car } = useParams();
  
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
