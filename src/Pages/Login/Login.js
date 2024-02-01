import React, { useState } from "react";
import StyleLogin from "./Login.module.css";
import logo from "../../Assets/icons/Lebanese_Football_Association_(LFA)_logo.svg";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className={StyleLogin.loginPage}>
      <section className={StyleLogin.firstSection}>
        <img src={logo} alt="logo" />
        <div className={StyleLogin.color}></div>
        <div className={StyleLogin.color}></div>
        <div className={StyleLogin.box}>
          <div className={StyleLogin.container}>
            <div className={StyleLogin.form}>
              <h2>Login Form</h2>
              <form>
                <div className={StyleLogin.inputBox}>
                  <input type="text" placeholder="Email" />
                </div>
                <div
                  className={StyleLogin.inputBox}
                  style={{ display: "flex" }}
                >
                  {/* <input type="password" placeholder="Password" /> */}
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div
                    className={StyleLogin.eyeIcon}
                    onClick={handleTogglePassword}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </div>
                </div>
                <div className={StyleLogin.inputBox} style={{display:"flex", justifyContent:"center",alignItems:"center"}}>
                  <input type="submit" value="Login" />
                  <button className={StyleLogin.oauth}>
                    <FaGoogle />
                    Login with Google
                  </button>
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
