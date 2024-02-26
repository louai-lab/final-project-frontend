import React, { useEffect, useTransition, useState } from "react";
import { useLocation } from "react-router-dom";
import StyleSingleMatch from "./SingleMatch.module.css";
import TabButton from "../../Components/TabButton/TabButton";
import Event from "../../Components/Event/Event";
import axiosInstance from "../../Utils/AxiosInstance";
import FootballLoader from "../FootballLoader/FootballLoader";
import { Reveal } from "../../Frammotion/RevealAnimation";
import { useUserStore } from "../../Zustand/Store";
import { useSpring, animated } from "react-spring";

function SingleMatch() {
  const { user } = useUserStore();
  const [tab, setTab] = useState("live");
  const [isPending, startTransition] = useTransition();
  const [isOpenPopUpEvent, setIsOpenPopUpEvent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [watcherReport, setWatcherReport] = useState("");
  const [refereeReport, setRefereeReport] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);

  const animationProps = useSpring({
    opacity: showAnimation ? 1 : 0,
    from: { opacity: 0 },
  });

  const handleTabChange = (id) => {
    startTransition(() => {
      setTab(id);
    });
  };

  const location = useLocation();
  const [match, setMatch] = useState(location.state?.match || {});

  const cancelEvent = () => {
    closePopUp()
  };

  const openPopUp = () => {
    setIsOpenPopUpEvent(true);
    document.body.style.overflow = "hidden";
  };

  const closePopUp = () => {
    setIsOpenPopUpEvent(false);
    document.body.style.overflow = "auto";
  };

  const fetchUpdatedMatch = async (matchId) => {
    try {
      setLoading(true);
      const updatedMatchResponse = await axiosInstance.get(
        `/match/match/${matchId}`
      );
      const updatedMatch = updatedMatchResponse.data;

      setMatch((prevMatch) => ({ ...prevMatch, ...updatedMatch }));
    } catch (error) {
      console.error("Error fetching updated match:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdatedMatch(match._id);
  }, [match._id]);

  useEffect(() => {
    if (match && match.watcher_report) {
      setWatcherReport(match.watcher_report);
    }
    if (match && match.referee_report) {
      setRefereeReport(match.referee_report);
    }
  }, [match]);

  let detailId = match.details?._id;

  const handleEventSubmit = async (formData) => {
    try {
      const response = await axiosInstance.patch(
        `/matchdetails/update/${detailId}`,
        formData
      );

      if (response) {
        console.log("created successfully");
        fetchUpdatedMatch(match._id);
        closePopUp();
      }
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
      }, 5000);
    } catch (error) {
      console.error("Error updating match details:", error);
    }
  };

  const events = match?.details?.details;

  const handleUpdateWatcherReport = async () => {
    try {
      const response = await axiosInstance.patch(`/match/update/${match._id}`, {
        watcher_report: watcherReport,
      });

      if (response) {
        setShowAnimation(true);
        // console.log(response.data);
        setTimeout(() => {
          setShowAnimation(false);
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateRefereeReport = async () => {
    try {
      const response = await axiosInstance.patch(`/match/update/${match._id}`, {
        referee_report: refereeReport,
      });

      if (response) {
        setShowAnimation(true);
        console.log(response.data);
        setTimeout(() => {
          setShowAnimation(false);
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTextareaChangeWatcher = (event) => {
    setWatcherReport(event.target.value);
  };
  const handleTextareaChangeReferee = (event) => {
    setRefereeReport(event.target.value);
  };

  // console.log(match.played)

  const TAB_DATA = [
    {
      title: "Live",
      id: "live",
      content: (
        <>
          {loading ? (
            <FootballLoader />
          ) : (
            <Reveal>
              <div className={StyleSingleMatch.liveContainer}>
                {match.played === false ? (
                  <>
                    <h1>No Such Events Yet!</h1>
                  </>
                ) : (
                  <>
                    {events.map((event) => (
                      <div
                        key={event._id}
                        className={`${StyleSingleMatch.event} ${
                          event.team._id === match.team_b.team._id
                            ? StyleSingleMatch.flexStart
                            : StyleSingleMatch.flexEnd
                        }`}
                      >
                        <div
                          className={`${StyleSingleMatch.type} ${
                            event.team._id === match.team_b.team._id
                              ? StyleSingleMatch.rowDirection
                              : ""
                          }`}
                        >
                          {event.type === "goal" ? (
                            <img
                              src={`${process.env.REACT_APP_IMAGE_PATH}/football.png`}
                              alt="goal"
                              className={StyleSingleMatch.iconType}
                            />
                          ) : event.type === "yellow_card" ? (
                            <img
                              src={`${process.env.REACT_APP_IMAGE_PATH}/yellow-card.png`}
                              alt="yellow-card"
                              className={StyleSingleMatch.iconType}
                            />
                          ) : event.type === "red_card" ? (
                            <img
                              src={`${process.env.REACT_APP_IMAGE_PATH}/red-card.png`}
                              alt="red-card"
                              className={StyleSingleMatch.iconType}
                            />
                          ) : (
                            <img
                              src={`${process.env.REACT_APP_IMAGE_PATH}/substitution.png`}
                              alt="substitution"
                              className={StyleSingleMatch.iconSubstitution}
                            />
                          )}
                          <div>
                            {event.type === "substitution" ? (
                              <div className={StyleSingleMatch.substitution}>
                                <p>{event.playerIn.name}</p>
                                <p className={StyleSingleMatch.out}>
                                  {event.playerOut.name}
                                </p>
                              </div>
                            ) : (
                              <p>{event.playerIn.name}</p>
                            )}
                          </div>
                        </div>
                        <div className={StyleSingleMatch.between}></div>
                        <p>{event.minute}'</p>
                      </div>
                    ))}
                  </>
                )}
                {user.role === "admin" || user.userId === match.watcher._id ? (
                  <button className={StyleSingleMatch.open} onClick={openPopUp}>
                    +
                  </button>
                ) : (
                  ""
                )}
                <animated.div
                  style={{
                    ...animationProps,
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    padding: "10px",
                  }}
                >
                  <p>Golazzzzo</p>
                </animated.div>
              </div>
            </Reveal>
          )}
        </>
      ),
    },
    {
      title: "Line-ups",
      id: "line-ups",
      content: (
        <div className={StyleSingleMatch.lineContainer}>
          <h1>Hi line ups</h1>
        </div>
      ),
    },
    {
      title: "reports",
      id: "reports",
      content: (
        <div className={StyleSingleMatch.reportsContainer}>
          <>
            {user.role === "admin" || user.userId === match.watcher._id ? (
              <div className={StyleSingleMatch.singleReport}>
                <img
                  src={`${process.env.REACT_APP_IMAGE_PATH}/${match.watcher.image}`}
                  alt={match.watcher.name}
                  className={StyleSingleMatch.imagesReports}
                />
                <div className={StyleSingleMatch.partReport}>
                  <p>{match.watcher.firstName}'s Report :</p>
                  <textarea
                    className={StyleSingleMatch.textArea}
                    rows="5"
                    placeholder="Enter your report as watcher here..."
                    value={watcherReport}
                    onChange={handleTextareaChangeWatcher}
                  ></textarea>
                  <div className={StyleSingleMatch.ButtonsReport}>
                    <button
                      type="button"
                      className={StyleSingleMatch.post}
                      onClick={handleUpdateWatcherReport}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </>

          <>
            {user.role === "admin" || user.userId === match.referee._id ? (
              <>
                <div className={StyleSingleMatch.singleReport}>
                  <img
                    src={`${process.env.REACT_APP_IMAGE_PATH}/${match.watcher.image}`}
                    alt={match.watcher.name}
                    className={StyleSingleMatch.imagesReports}
                  />
                  <div className={StyleSingleMatch.partReport}>
                    <p>{match.referee.firstName}'s Report :</p>
                    <textarea
                      className={StyleSingleMatch.textArea}
                      rows="5"
                      placeholder="Enter your report as referee here..."
                      value={refereeReport}
                      onChange={handleTextareaChangeReferee}
                    ></textarea>
                    <div className={StyleSingleMatch.ButtonsReport}>
                      <button
                        type="button"
                        onClick={handleUpdateRefereeReport}
                        className={StyleSingleMatch.post}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
                <animated.div
                  style={{
                    ...animationProps,
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    padding: "10px",
                  }}
                >
                  <>
                    <p>Posted Successfully</p>
                    <img
                      src={`${process.env.REACT_APP_IMAGE_PATH}/football.png`}
                      alt="goal"
                      // className={StyleSingleMatch.iconType}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </>
                </animated.div>
              </>
            ) : null}
          </>
        </div>
      ),
    },
  ];

  return (
    <>
      {isOpenPopUpEvent && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1002,
            }}
            onClick={closePopUp}
          ></div>

          <Event
            cancelEvent={cancelEvent}
            teamATeam={match.team_a.team}
            teamBTeam={match.team_b.team}
            playersATeam={match.team_a.team.players}
            playersBTeam={match.team_b.team.players}
            handleEventSubmit={handleEventSubmit}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1003,
            }}
          ></div>
        </>
      )}
      <>
        {/* {loading ? (
          <>
            <FootballLoader />
          </>
        ) : ( */}
        <main className={StyleSingleMatch.matchContainer}>
          <article className={StyleSingleMatch.matchHeroSection}>
            <section className={StyleSingleMatch.teamA}>
              <img
                src={`${process.env.REACT_APP_IMAGE_PATH}/${match.team_a?.team.image}`}
                alt={match.team_a?.team.name}
                className={StyleSingleMatch.cardImage}
              />
              <h1>{match.team_a?.team.name}</h1>
            </section>
            <section className={StyleSingleMatch.result}>
              <p>{match.team_a?.score}</p>
              <span>-</span>
              <p>{match.team_b?.score}</p>
            </section>
            <section className={StyleSingleMatch.teamA}>
              <img
                src={`${process.env.REACT_APP_IMAGE_PATH}/${match.team_b?.team.image}`}
                alt={match.team_b?.team.name}
                className={StyleSingleMatch.cardImage}
              />
              <h1>{match.team_b?.team.name}</h1>
            </section>
          </article>
          <article className={StyleSingleMatch.live}>
            <section className={StyleSingleMatch.position}>
              <section className={StyleSingleMatch.tabContainer}>
                <TabButton
                  selectTab={() => handleTabChange("live")}
                  active={tab === "live"}
                >
                  LIVE
                </TabButton>
                <TabButton
                  selectTab={() => handleTabChange("line-ups")}
                  active={tab === "line-ups"}
                >
                  LINE-UPS
                </TabButton>
                <TabButton
                  selectTab={() => handleTabChange("reports")}
                  active={tab === "reports"}
                >
                  REPORTS
                </TabButton>
              </section>

              {TAB_DATA.find((t) => t.id === tab).content}
            </section>
          </article>
        </main>
        {/* )} */}
      </>
    </>
  );
}

export default SingleMatch;
