import React from "react";
import StyleLogin from "./Login.module.css";
import football from "../../Assets/icons/soccer-ball-variant.png";
import logo from "../../Assets/icons/Lebanese_Football_Association_(LFA)_logo.svg";
import whistle from "../../Assets/icons/whistle (1).png";

function Login() {
  return (
    <div className={StyleLogin.loginPage}>
      <section className={StyleLogin.firstSection}>
        <img src={logo} alt="logo" />
        <div className={StyleLogin.color}></div>
        <div className={StyleLogin.color}></div>
        <div className={StyleLogin.color}></div>
        <div className={StyleLogin.box}>
          <div className={StyleLogin.square} style={{ "--i": 1 }}>
            <img src={football} alt="Football Icon 0" />
          </div>
          <div className={StyleLogin.square} style={{ "--i": 2 }}>
            <img src={whistle} alt="whistle" />
          </div>
          <div className={StyleLogin.square} style={{ "--i": 3 }}></div>
          <div className={StyleLogin.square} style={{ "--i": 4 }}></div>
          <div className={StyleLogin.square} style={{ "--i": 5 }}></div>
          <div className={StyleLogin.container}>
            <div className={StyleLogin.form}>
              <h2>Login Form</h2>
              <form>
                <div className={StyleLogin.inputBox}>
                  <input type="text" placeholder="Username" />
                </div>
                <div className={StyleLogin.inputBox}>
                  <input type="password" placeholder="Password" />
                </div>
                <div className={StyleLogin.inputBox}>
                  <input type="submit" value="Login" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
