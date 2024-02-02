import React from "react";
import StyleNetworkError from './NetworkError.module.css'

function NetworkError() {
  return (
    <div className={StyleNetworkError.networkErrorContainer}>
      <h1>Network Error</h1>
      <p>Check your internet connection and try again</p>
    </div>
  );
}

export default NetworkError;
