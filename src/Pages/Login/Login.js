import React, { useState } from "react";
import StyleLogin from "./Login.module.css";
import logo from "../../Assets/icons/Lebanese_Football_Association_(LFA)_logo.svg";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMatchesStore, useUserStore } from "../../Zustand/Store";
import { Reveal } from "../../Frammotion/RevealAnimation";
import { Helmet } from "react-helmet-async";

function Login() {
  const navigate = useNavigate();
  const [passwordValid, setPasswordValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { user, setUser } = useUserStore();
  const [credentials, setCredentials] = useState({
    email: "louaiadmin@gmail.com",
    password: "123",
  });
  const [error, setError] = useState("");
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

    // if (credentials.email === "" || credentials.password === "") {
    //   setPasswordValid(false);
    //   return;
    // }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/user/login`,
        credentials
      );

      if (response.data) {
        setPasswordValid(true);
        setUser(response.data);

        // console.log(response.data);
        return navigate("/", { replace: true });
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        setError("Email and password are required");
      } else if (error.response && error.response.status === 401) {
        setError("Email is incorrect");
      } else if (error.response && error.response.status === 402) {
        setError("Password is incorrect");
      } else {
        setError("Email and password are required");
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Lebanese Association in the North - Login</title>
        <meta
          name="description"
          content="Login to the official website of the Lebanese Association in the North. Access your account to stay updated with the latest matches, leagues, and events happening in the northern region for the third and fourth levels in the league."
        />
        <meta
          name="keywords"
          content="Lebanese Association in the North, login, account, matches, leagues, northern region, third level league, fourth level league, soccer, football, sports"
        />
      </Helmet>
      <div className={StyleLogin.loginPage}>
        <section className={StyleLogin.firstSection}>
          <img src={logo} alt="logo" />
          <Reveal>
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
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={handleInputChange}
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

                {error && (
                  <p
                    style={{
                      fontSize: "clamp(8px , 3rem , 18px)",
                      color: "red",
                      marginTop: "5px",
                      position: "absolute",
                    }}
                  >
                    {error}
                  </p>
                )}
                <div className={StyleLogin.btn}>
                  <button className={StyleLogin.login} onClick={handleLogin}>
                    Login
                  </button>
                </div>
              </form>
            </div>
          </Reveal>
        </section>
      </div>
    </>
  );
}

export default Login;
