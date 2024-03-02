import React from "react";
import StyleFooter from "./Footer.module.css";
import logo from "../../Assets/icons/Lebanese_Football_Association_(LFA)_logo.svg";
import { NavLink } from "react-router-dom";
import Facebook from "../../Assets/icons/devicon--facebook.svg";
import Instagram from "../../Assets/icons/skill-icons--instagram.svg";

function Footer() {
  return (
    <div className={StyleFooter.footer}>
      <div className={StyleFooter.footerContainer}>
        <div className={StyleFooter.descriptionFooter}>
          <img src={logo} alt="" className={StyleFooter.logoFooter} />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>

        <div className={StyleFooter.relatedFooter}>
          <p className={StyleFooter.titleFooter}>
            Lebanese Football Association
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p>North , Lebanon</p>

          <p className={StyleFooter.red}>louaibaghdadi27@gmail.com</p>
          <p className={StyleFooter.red}>+961 70 178056</p>
        </div>

        <div className={StyleFooter.linksFooter}>
          <p className={StyleFooter.titleFooter}>Links</p>
          <ul className={StyleFooter.ulFooter}>
            <li>
              <NavLink
                to="/"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? StyleFooter.active : ""
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/matches"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? StyleFooter.active : ""
                }
              >
                Matches
              </NavLink>
            </li>
          </ul>
        </div>

        <div className={StyleFooter.connectFooter}>
          <p className={StyleFooter.titleFooter}>Connect with us</p>
          <div className={StyleFooter.socialFooter}>
            <img src={Facebook} alt="" className={StyleFooter.iconFacebook} />
            <img src={Instagram} alt="" className={StyleFooter.iconInsta} />
          </div>
        </div>
      </div>

      <p>
        Lebanese Football Association in The North &copy; 2024 All rights
        reserved.
      </p>
    </div>
  );
}

export default Footer;
