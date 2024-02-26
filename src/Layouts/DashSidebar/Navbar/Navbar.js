import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Styles from "./Navbar.module.css";
import { useEffect, useState } from "react";
import logo from "../../../Assets/icons/Lebanese_Football_Association_(LFA)_logo.svg";
import { useUserStore } from "../../../Zustand/Store";

function Navbar() {
  const { user, loading, logOut } = useUserStore();
  const navigate = useNavigate();

  const [collapesed, setCollapsed] = useState(false);

  useEffect(() => {
    function updateSize() {
      if (window.innerWidth > 600) {
        setCollapsed(false);
      }
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const toggleClasses = [
    Styles.linksWrapperMobile,
    collapesed ? Styles.activeNav : "",
  ].join(" ");
  const bar1 = [Styles.line1, collapesed ? Styles.a : ""].join(" ");
  const bar2 = [Styles.line2, collapesed ? Styles.a : ""].join(" ");
  const bar3 = [Styles.line3, collapesed ? Styles.a : ""].join(" ");

  const handleLogOut = async (e) => {
    e.preventDefault();

    await logOut();
    // console.log(user)
    navigate("/login");
  };

  return (
    <header className={Styles.header}>
      <nav className={Styles.navBar}>
        <NavLink
          // className={Styles.logoContainer}
          to="/"
          aria-label="Go to homepage"
        >
          <img
            src={logo}
            width={100}
            height={80}
            alt="Lebanese Football Association"
          />
        </NavLink>
        <ul className={Styles.linksWrapper}>
          <li>
            <NavLink
              to="/"
              exact
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? Styles.active : ""
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/matches"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? Styles.active : ""
              }
            >
              Matches
            </NavLink>
          </li>

          {user.role === "admin" ? (
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? Styles.active : ""
                }
              >
                Dashboard
              </NavLink>
            </li>
          ) : (
            ""
          )}
          <li>
            <NavLink
              // to="/login"
              onClick={() => setCollapsed(false)}
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? Styles.active : ""
              }
            >
              <button
                type="button"
                className={Styles.logOut}
                onClick={handleLogOut}
              >
                Log Out
              </button>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? `${Styles.active} ${Styles.circle}`
                  : ""
              }
            >
              <div className={Styles.circle}>
                <img
                  src={`${process.env.REACT_APP_IMAGE_PATH}/${user.image}`}
                  alt="Profile"
                />
              </div>
            </NavLink>
          </li>
        </ul>
        <ul className={toggleClasses}>
          <li>
            <NavLink
              to="/"
              onClick={() => setCollapsed(false)}
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? Styles.active : ""
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/matches"
              onClick={() => setCollapsed(false)}
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? Styles.active : ""
              }
            >
              Matches
            </NavLink>
          </li>
          {user.role === "admin" ? (
            <li>
              <NavLink
                to="/dashboard"
                onClick={() => setCollapsed(false)}
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? Styles.active : ""
                }
              >
                Dashboard
              </NavLink>
            </li>
          ) : (
            ""
          )}
          <li>
            <NavLink
              to="/profile"
              onClick={() => setCollapsed(false)}
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? Styles.active : ""
              }
            >
              Profile
            </NavLink>
          </li>

          <li>
            <NavLink
              // to="/login"
              onClick={() => setCollapsed(false)}
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? Styles.active : ""
              }
            >
              <button
                type="button"
                className={Styles.logOutResponsive}
                onClick={handleLogOut}
              >
                Log Out
              </button>
            </NavLink>
          </li>
        </ul>

        <div
          className={Styles.burgerButton}
          onClick={() => setCollapsed(!collapesed)}
        >
          <div className={bar1}></div>
          <div className={bar2}></div>
          <div className={bar3}></div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
