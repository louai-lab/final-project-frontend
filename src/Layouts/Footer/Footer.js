import React, { lazy, Suspense } from "react";
import StyleFooter from "./Footer.module.css";
import logo from "../../Assets/icons/Lebanese_Football_Association_(LFA)_logo.svg";
import { NavLink } from "react-router-dom";
import Facebook from "../../Assets/icons/devicon--facebook.svg";
import Instagram from "../../Assets/icons/skill-icons--instagram.svg";
import { useLanguage } from "../../Utils/LanguageContext";
import { useAboutUsStore } from "../../Zustand/Store";
import { Skeleton } from "@mui/material";

const LazyImage = lazy(() => import("../../Utils/LazyImage"));

function Footer() {
  const { language } = useLanguage();

  const { loading, aboutUs } = useAboutUsStore();

  return (
    <div className={StyleFooter.footer}>
      <div className={StyleFooter.footerContainer}>
        <div className={StyleFooter.descriptionFooter}>
          {/* <img src={logo} alt="" className={StyleFooter.logoFooter} /> */}
          {/* <Suspense fallback={<div>Loading...</div>}>
            <LazyImage src={logo} alt="" className={StyleFooter.logoFooter} />
          </Suspense> */}
          {loading ? (
            <Skeleton variant="rectangular" width={100} height={80} />
          ) : (
            <img
              src={`${process.env.REACT_APP_IMAGE_PATH}/${aboutUs?.image}`}
              alt={aboutUs?.name}
              className={StyleFooter.logoFooter}
            />
          )}
          <p className={language === "ar" ? StyleFooter.rtl : ""}>
            {language === "en"
              ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi utaliquip ex ea commodo consequat."
              : "أبجد هوز دولور الجلوس امات  ولكن قد يحدث وقت طويل من العمل والألم الكبير. إننا لا نسمح إلا بالحد الأدنى من النشاط الذي نمارسه من خلال العمل، ولا نتركه بعيدًا عن أي شيء يترتب على ذلك."}
          </p>
        </div>

        <div className={StyleFooter.relatedFooter}>
          <p
            className={`${StyleFooter.titleFooter} ${
              language === "ar" ? StyleFooter.rtl : ""
            }`}
          >
            {language === "en"
              ? "Lebanese Football Association In The North"
              : "الاتحاد اللبناني لكرة القدم في الشمال"}
          </p>
          <p className={language === "ar" ? StyleFooter.rtl : ""}>
            {language === "en"
              ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi utaliquip ex ea commodo consequat."
              : "أبجد هوز دولور الجلوس امات  ولكن قد يحدث وقت طويل من العمل والألم الكبير. إننا لا نسمح إلا بالحد الأدنى من النشاط الذي نمارسه من خلال العمل، ولا نتركه بعيدًا عن أي شيء يترتب على ذلك."}
          </p>
          <p className={language === "ar" ? StyleFooter.rtl : ""}>
            {language === "en" ? "North , Lebanon" : "الشمال , لبنان"}
          </p>

          <p
            className={`${StyleFooter.red} ${
              language === "ar" ? StyleFooter.rtl : ""
            }`}
          >
            {aboutUs?.email}
          </p>
          <p
            className={`${StyleFooter.red} ${
              language === "ar" ? StyleFooter.rtl : ""
            }`}
          >
            {aboutUs?.phone}
          </p>
        </div>

        <div className={StyleFooter.linksFooter}>
          <p
            className={`${StyleFooter.titleFooter} ${
              language === "ar" ? StyleFooter.rtl : ""
            }`}
          >
            {language === "en" ? "Links" : "الروابط"}
          </p>
          <ul className={StyleFooter.ulFooter}>
            <li className={language === "ar" ? StyleFooter.rtl : ""}>
              <NavLink
                to="/"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? StyleFooter.active : ""
                }
              >
                {language === "en" ? "Home" : "الصفحة الرئيسية"}
              </NavLink>
            </li>
            <li className={language === "ar" ? StyleFooter.rtl : ""}>
              <NavLink
                to="/matches"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? StyleFooter.active : ""
                }
              >
                {language === "en" ? "Matches" : "المباريات"}
              </NavLink>
            </li>
          </ul>
        </div>

        <div className={StyleFooter.connectFooter}>
          <p className={StyleFooter.titleFooter}>
            {language === "en" ? "Connect with us" : "تواصل معنا"}
          </p>
          <div
            className={`${StyleFooter.socialFooter} ${
              language === "ar" ? StyleFooter.rtl : ""
            }`}
          >
            <Suspense fallback={<div>Loading...</div>}>
              <a href={aboutUs?.facebook}>
                <LazyImage
                  src={Facebook}
                  alt="facebook icon"
                  className={StyleFooter.iconFacebook}
                />
              </a>
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
              <LazyImage
                src={Instagram}
                alt="instagram icon"
                className={StyleFooter.iconInsta}
              />
            </Suspense>
          </div>
        </div>
      </div>

      <p>
        {language === "en"
          ? `Lebanese Football Association in The North © 2024 All rights reserved.`
          : "جميع الحقوق محفوظة © الاتحاد اللبناني لكرة القدم في الشمال"}
      </p>
    </div>
  );
}

export default Footer;
