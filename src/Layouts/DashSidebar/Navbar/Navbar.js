import { NavLink, useNavigate } from "react-router-dom";
import Styles from "./Navbar.module.css";
import { useEffect, useState } from "react";
// import logo from "../../../Assets/icons/Lebanese_Football_Association_(LFA)_logo.svg";
import { useUserStore } from "../../../Zustand/Store";
import { useLanguage } from "../../../Utils/LanguageContext";
import { MdLogin } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { useAboutUsStore } from "../../../Zustand/Store";
import { Skeleton } from "@mui/material";

function Navbar() {
  const { language, toggleLanguage } = useLanguage();
  const { user, logOut } = useUserStore();
  const navigate = useNavigate();

  const { loading, aboutUs } = useAboutUsStore();

  // console.log(aboutUs);

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
    // collapesed ? Styles.activeNav : "",
    collapesed ? (user ? Styles.activeNav : Styles.activeNavU) : "",
  ].join(" ");
  const bar1 = [Styles.line1, collapesed ? Styles.a : ""].join(" ");
  const bar2 = [Styles.line2, collapesed ? Styles.a : ""].join(" ");
  const bar3 = [Styles.line3, collapesed ? Styles.a : ""].join(" ");

  const handleLogOut = async (e) => {
    e.preventDefault();

    await logOut();
    // console.log(user)
    navigate("/");
  };

  const handleToLoginPage = async (e) => {
    e.preventDefault();
    // console.log(user)
    navigate("/login");
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    if (selectedLanguage !== language) {
      toggleLanguage();
    }
  };

  return (
    <header className={Styles.header}>
      <nav className={Styles.navBar}>
        <NavLink
          // className={Styles.logoContainer}
          to="/"
          aria-label="Go to homepage"
        >
          {loading ? (
            <Skeleton variant="rectangular" width={100} height={80} />
          ) : (
            <img
              src={`${process.env.REACT_APP_IMAGE_PATH}/${aboutUs?.image}`}
              alt={aboutUs?.name}
              width={100}
              height={80}
            />
          )}
        </NavLink>
        <select
          id="languageSelect"
          value={language}
          onChange={handleLanguageChange}
          className={Styles.select}
        >
          <option value="en" className={Styles.option}>
            English
          </option>
          <option value="ar" className={Styles.option}>
            العربية
          </option>
        </select>
        <ul className={Styles.linksWrapper}>
          <li>
            <NavLink
              to="/"
              exact
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? Styles.active : ""
              }
            >
              {language === "en" ? "Home" : "الصفحة الرئيسية"}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/matches"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? Styles.active : ""
              }
            >
              {language === "en" ? "Matches" : "المباريات"}
            </NavLink>
          </li>

          {user && user?.role === "admin" ? (
            <li className={language === "ar" ? Styles.rtl : ""}>
              <NavLink
                to="/dashboard/overview"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? Styles.active : ""
                }
              >
                {language === "en" ? "Dashboard" : "لوحة القيادة"}
              </NavLink>
            </li>
          ) : (
            ""
          )}

          {user ? (
            <>
              <li>
                <NavLink
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
                    {language === "en" ? "LogOut" : "تسجيل خروج"}
                    {"  "}

                    {/* <img src={Logout} alt="logout" /> */}
                    <MdLogout />
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
                      src={`${process.env.REACT_APP_IMAGE_PATH}/${user?.image}`}
                      alt="Profile"
                    />
                  </div>
                </NavLink>
              </li>
            </>
          ) : (
            <li>
              <NavLink
                onClick={() => setCollapsed(false)}
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? Styles.active : ""
                }
              >
                <button
                  type="button"
                  className={Styles.logIn}
                  onClick={handleToLoginPage}
                >
                  {language === "en" ? "Log In" : "تسجيل دخول"}
                  {"  "}

                  {/* <img src={Login} alt="login" /> */}
                  <MdLogin />
                </button>
              </NavLink>
            </li>
          )}
        </ul>
        <ul
          className={`${toggleClasses} ${language === "ar" ? Styles.rtl : ""}`}
        >
          <li>
            <NavLink
              to="/"
              onClick={() => setCollapsed(false)}
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? Styles.active : ""
              }
            >
              {language === "en" ? "Home" : "الصفحة الرئيسية"}
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
              {language === "en" ? "Matches" : "المباريات"}
            </NavLink>
          </li>

          {user?.role === "admin" ? (
            <li>
              <NavLink
                to="/dashboard/overview"
                onClick={() => setCollapsed(false)}
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? Styles.active : ""
                }
              >
                {language === "en" ? "Dashboard" : "لوحة القيادة"}
              </NavLink>
            </li>
          ) : (
            ""
          )}
          {user ? (
            <>
              <li>
                <NavLink
                  to="/profile"
                  onClick={() => setCollapsed(false)}
                  className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? Styles.active : ""
                  }
                >
                  {language === "en" ? "Profile" : "الصفحة الشخصية"}
                </NavLink>
              </li>

              <button
                type="button"
                className={Styles.logOutResponsive}
                onClick={handleLogOut}
              >
                <p>{language === "en" ? "LogOut" : "تسجيل خروج"}</p>
                {/* <img src={Logout} alt="logout" /> */}
                <MdLogout />
              </button>
            </>
          ) : (
            <button
              type="button"
              className={Styles.logInResponsive}
              onClick={handleToLoginPage}
            >
              <p>{language === "en" ? "Log In" : "تسجيل دخول"}</p>
              {/* <img src={Login} alt="login" /> */}
              <MdLogin />
            </button>
          )}
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
