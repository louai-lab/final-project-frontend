import React from "react";
import StyleLoading from './Loading.module.css'
import loading from '../../Assets/icons/_ca04bc7f-1d5b-47e3-a770-d0046ea9d0c9.jpeg'

function Loading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <img src={loading} alt="notFound" className={StyleLoading.imageLoading} />
      {/* <h1>Loading...</h1> */}
    </div>
  );
}

export default Loading;
