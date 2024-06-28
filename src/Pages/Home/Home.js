import React, { useEffect } from "react";
import StyleHome from "./Home.module.css";
// import firstTeam from "../../Assets/icons/Ellipse 6.svg";
// import secondTeam from "../../Assets/icons/Ellipse 8.svg";
import LandingPage from "../../Assets/icons/referee-showing-red-yellow-cards-football-soccer-player-while-gaming-white-studio-background.jpg";
import { useMatchesStore } from "../../Zustand/Store";
import { useNavigate } from "react-router-dom";
import FootballLoader from "../FootballLoader/FootballLoader";
import { useLanguage } from "../../Utils/LanguageContext";
import { useUserStore } from "../../Zustand/Store";
import { Helmet } from "react-helmet-async";
import { lazy, Suspense } from "react";

const LazyImage = lazy(() => import("../../Utils/LazyImage"));

function Home() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { user, getUser } = useUserStore();

  const { loading, matches, getAllMatches } = useMatchesStore();

  // console.log(user);

  useEffect(() => {
    getAllMatches();
  }, [getAllMatches]);

  const handleMatchClick = (match) => {
    if (match && match._id) {
      navigate(`/match`, { state: { match } });
    } else {
      console.error("Match object is undefined or missing properties.");
    }
  };

  return (
    <>
      {loading ? (
        <>
          <FootballLoader />
        </>
      ) : (
        <>
          <Helmet>
            <title>Lebanese Association in the North - Home</title>
            <meta
              name="description"
              content="Welcome to the official website of the Lebanese Association in the North. Stay updated with the latest matches, leagues, and events happening in the northern region for the third and fourth levels in the league."
            />
            <meta
              name="keywords"
              content="Lebanese Association in the North, matches, leagues, northern region, third level league, fourth level league, soccer, football, sports , watcher , referee"
            />
          </Helmet>
          <div className={StyleHome.homeContainer}>
            <header
              className={`${StyleHome.HeroSection} ${
                language === "ar" ? StyleHome.scale : ""
              }`}
            >
              <div
                className={
                  language === "en"
                    ? StyleHome.position
                    : StyleHome.positionArabic
                }
              >
                <p className={StyleHome.association}>
                  {language === "en"
                    ? "Lebanese Football Association In The North"
                    : "الاتحاد اللبناني لكرة القدم في الشمال"}
                </p>
                <h1>{language === "en" ? "Fixtures" : "تجهيزات"}</h1>
                <div className={StyleHome.fixtureContainer}>
                  {Array.isArray(matches) && matches.length > 0 ? (
                    <>
                      {matches[0] && (
                        <button
                          type="button"
                          key={matches[0]._id}
                          onClick={() => handleMatchClick(matches[0])}
                          style={{ all: "unset" }}
                        >
                          <div
                            key={matches[0]._id}
                            className={StyleHome.fixture}
                          >
                            <div className={StyleHome.info}>
                              <p className={StyleHome.title}>
                                {matches[0].title.name}
                              </p>
                              <p className={StyleHome.time}>
                                {new Date(
                                  matches[0].match_date
                                ).toLocaleDateString("en-US", {
                                  timeZone: "UTC",
                                  year: "numeric",
                                  month: "numeric",
                                  day: "numeric",
                                })}
                                {" / "}
                                {new Date(
                                  `2000-01-01T${matches[0].match_time}:00Z`
                                ).toLocaleTimeString("en-US", {
                                  timeZone: "UTC",
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true,
                                })}
                              </p>
                              <p className={StyleHome.stadium}>
                                {matches[0]?.pitch?.name}
                              </p>
                            </div>
                            <div className={StyleHome.teams}>
                              <div className={StyleHome.oneTeam}>
                                <img
                                  src={`${process.env.REACT_APP_IMAGE_PATH}/${matches[0].team_a?.team.image}`}
                                  alt={matches[0].team_a?.team.name}
                                  style={{
                                    width: "70px",
                                    height: "70px",
                                    objectFit: "contain",
                                  }}
                                />
                                <p className={StyleHome.teamName}>
                                  {matches[0].team_a?.team.name}
                                </p>
                              </div>
                              <p style={{ fontWeight: "bold" }}>VS</p>
                              <div className={StyleHome.oneTeam}>
                                <img
                                  src={`${process.env.REACT_APP_IMAGE_PATH}/${matches[0].team_b?.team.image}`}
                                  alt={matches[0].team_b?.team.name}
                                  style={{
                                    width: "70px",
                                    height: "70px",
                                    objectFit: "contain",
                                  }}
                                />
                                <p className={StyleHome.teamName}>
                                  {matches[0].team_b?.team.name}
                                </p>
                              </div>
                            </div>
                          </div>
                        </button>
                      )}
                      {matches[1] && (
                        <button
                          type="button"
                          key={matches[1]._id}
                          onClick={() => handleMatchClick(matches[1])}
                          style={{ all: "unset" }}
                        >
                          <div
                            key={matches[1]._id}
                            className={StyleHome.fixture}
                          >
                            <div className={StyleHome.info}>
                              <p className={StyleHome.title}>
                                {matches[1].title.name}
                              </p>
                              <p className={StyleHome.time}>
                                {new Date(
                                  matches[1].match_date
                                ).toLocaleDateString("en-US", {
                                  timeZone: "UTC",
                                  year: "numeric",
                                  month: "numeric",
                                  day: "numeric",
                                })}
                                {" / "}
                                {new Date(
                                  `2000-01-01T${matches[1].match_time}:00Z`
                                ).toLocaleTimeString("en-US", {
                                  timeZone: "UTC",
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true,
                                })}
                              </p>
                              <p className={StyleHome.stadium}>
                                {matches[1]?.pitch?.name}
                              </p>
                            </div>
                            <div className={StyleHome.teams}>
                              <div className={StyleHome.oneTeam}>
                                <img
                                  src={`${process.env.REACT_APP_IMAGE_PATH}/${matches[1].team_a?.team.image}`}
                                  alt={matches[1].team_a?.team.name}
                                  style={{
                                    width: "70px",
                                    height: "70px",
                                    objectFit: "contain",
                                  }}
                                />
                                <p className={StyleHome.teamName}>
                                  {matches[1].team_a?.team.name}
                                </p>
                              </div>
                              <p style={{ fontWeight: "bold" }}>VS</p>
                              <div className={StyleHome.oneTeam}>
                                <img
                                  src={`${process.env.REACT_APP_IMAGE_PATH}/${matches[1].team_b?.team.image}`}
                                  alt={matches[1].team_b?.team.name}
                                  style={{
                                    width: "70px",
                                    height: "70px",
                                    objectFit: "contain",
                                  }}
                                />
                                <p className={StyleHome.teamName}>
                                  {matches[1].team_b?.team.name}
                                </p>
                              </div>
                            </div>
                          </div>
                        </button>
                      )}
                    </>
                  ) : (
                    <p>No matches found</p>
                  )}
                </div>
              </div>
            </header>

            <div className={StyleHome.slidesHome}>
              <div className={StyleHome.leftSlideHome}>
                <h4>
                  {language === "en" ? "Football Program" : "برنامج كرة القدم"}
                </h4>
                <p className={StyleHome.hiddenText}>
                  {language === "en"
                    ? "Custom-made nutrition programs that will enhance your athletic performance, increase focus, and give you maximum endurance according to your role on the team."
                    : "برامج تغذية مصممة خصيصًا من شأنها تحسين أدائك الرياضي وزيادة التركيز وتمنحك أقصى قدر من القدرة على التحمل وفقًا لدورك في الفريق."}
                </p>
              </div>
              <div className={StyleHome.rightSlideHome}>
                <h4>
                  {language === "en" ? "Football Program" : "برنامج كرة القدم"}
                </h4>
                <p className={StyleHome.hiddenText}>
                  {language === "en"
                    ? "Custom-made nutrition programs that will enhance your athletic performance, increase focus, and give you maximum endurance according to your role on the team."
                    : "برامج تغذية مصممة خصيصًا من شأنها تحسين أدائك الرياضي وزيادة التركيز وتمنحك أقصى قدر من القدرة على التحمل وفقًا لدورك في الفريق."}
                </p>
              </div>
            </div>

            <div className={StyleHome.descriptionSection}>
              <div className={StyleHome.imageSection}>
                <Suspense fallback={<div>Loading...</div>}>
                  <LazyImage src={LandingPage} alt="" />
                </Suspense>
              </div>
              <div className={StyleHome.trackHome}>
                {/* <h1> */}
                {language === "en" ? (
                  <h1>Track Live Match Actions</h1>
                ) : (
                  <h1> تتبع إجراءات المباراة الحية</h1>
                )}
                {/* </h1> */}
                <p>
                  {language === "en" ? (
                    <p>
                      {" "}
                      Stay up-to-date with real-time updates and comprehensive
                      statistics during the match. Our cutting-edge platform
                      offers in-depth insights into every player's move, team
                      strategies, and key moments. Immerse yourself in the game
                      with live commentary, dynamic visualizations, and
                      personalized notifications.
                    </p>
                  ) : (
                    <p className={language === "ar" ? StyleHome.rtl : ""}>
                      لبقاء ما يصل إلى موعد مع التحديثات في الوقت الحقيقي وشاملة
                      الإحصائيات خلال المباراة. عروض منصتنا المتطورة رؤى متعمقة
                      حول تحركات كل لاعب، واستراتيجيات الفريق، واللحظات
                      الرئيسية. انغمس في اللعبة مع البث المباشر التعليق،
                      والتصورات الديناميكية، وشخصية إشعارات.
                    </p>
                  )}
                </p>

                <button type="button" className={StyleHome.explore}>
                  Explore More
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Home;
