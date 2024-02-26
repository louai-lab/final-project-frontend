import React, { useState } from "react";
import StyleLogin from "./Login.module.css";
import logo from "../../Assets/icons/Lebanese_Football_Association_(LFA)_logo.svg";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMatchesStore, useUserStore } from "../../Zustand/Store";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { user, setUser } = useUserStore();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  axios.defaults.withCredentials = true;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (credentials.email === "" || credentials.password === "") {
      return console.log("All Fields are required");
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/user/login`,
        credentials
      );

      if (response.data) {
        setUser(response.data);

        console.log(response.data);
        return navigate("/", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
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
                  <input
                    type="text"
                    name="email"
                    value={credentials.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    required
                  />
                </div>
                <div
                  className={StyleLogin.inputBox}
                  style={{ display: "flex" }}
                >
                  {/* <input type="password" placeholder="Password" /> */}
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={handleInputChange}
                    // onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    value={credentials.password}
                    required
                  />
                  <div
                    className={StyleLogin.eyeIcon}
                    onClick={handleTogglePassword}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </div>
                </div>
                <div className={StyleLogin.btn}>
                  <button className={StyleLogin.login} onClick={handleLogin}>
                    Login
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
