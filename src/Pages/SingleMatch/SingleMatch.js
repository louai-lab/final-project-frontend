import React, { useEffect, useTransition, useState } from "react";
import { useLocation } from "react-router-dom";
import StyleSingleMatch from "./SingleMatch.module.css";
import TabButton from "../../Components/TabButton/TabButton";
import Event from "../../Components/Event/EventAdd/Event";
import axiosInstance from "../../Utils/AxiosInstance";
import FootballLoader from "../FootballLoader/FootballLoader";
import { Reveal } from "../../Frammotion/RevealAnimation";
import { useUserStore } from "../../Zustand/Store";
import { useSpring, animated } from "react-spring";
import EventDelete from "../../Assets/icons/material-symbols--delete-outline.svg";
import EventEdit from "../../Assets/icons/material-symbols--edit-outline (1).svg";
import EventDeletePopUp from "../../Components/Event/EventDelete/EventDelete";
import EventEditPopUp from "../../Components/Event/EventEdit/EventEdit";
import { useMatchesStore } from "../../Zustand/Store";
import { useTeamsStore } from "../../Zustand/Store";
import Flag from "../../Assets/icons/flag.png";
import Signal from "../../Assets/icons/signal.png";
import Arrow from "../../Assets/icons/arrow (1).png";
import Trophy from "../../Assets/icons/trophy.png";
import Clock from "../../Assets/icons/clock.png";
import Calendar from "../../Assets/icons/calendar.png";
import Stadium from "../../Assets/icons/stadium.png";
import EndMatch from "../../Components/Event/EndMatch/EndMatch";

function SingleMatch() {
  const { user } = useUserStore();
  const { matches } = useMatchesStore();
  const [tab, setTab] = useState("live");
  const [isPending, startTransition] = useTransition();
  const [isOpenPopUpEvent, setIsOpenPopUpEvent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [watcherReport, setWatcherReport] = useState("");
  const [refereeReport, setRefereeReport] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [isOpenPopUpDelete, setIsOpenPopUpDelete] = useState(false);
  const [isOpenPopUpEdit, setIsOpenPopUpEdit] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openEndMatch, setOpenEndMatch] = useState(false);

  const { getAllTeams } = useTeamsStore();
  const { getAllMatches } = useMatchesStore();
  const { getLastMatch } = useMatchesStore();

  useEffect(() => {
    getAllTeams();
    getAllMatches();
    getLastMatch();
  }, []);

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
    closePopUp();
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
        `/matchdetails/addObject/${detailId}`,
        formData
      );

      if (response) {
        console.log("created successfully");

        if (formData.type === "goal") {
          setShowAnimation(true);
          setTimeout(() => {
            setShowAnimation(false);
          }, 5000);
        }

        fetchUpdatedMatch(match._id);
        closePopUp();
      }
    } catch (error) {
      console.error("Error updating match details:", error);
    }
  };

  // End PopUp Match
  const openPopUpEnd = () => {
    setOpenEndMatch(true);
    document.body.style.overflow = " hidden";
  };

  const closePopUpEnd = () => {
    setOpenEndMatch(false);
    document.body.style.overflow = "auto";
  };

  const handleOpenEndMatch = (e) => {
    openPopUpEnd();
  };

  const closePopUpEndMatch = () => {
    closePopUpEnd();
  };

  // console.log(match);

  const handleEndMatch = async () => {
    // console.log(id);
    try {
      const response = await axiosInstance.patch(`/match/update/${match._id}`, {
        played: true,
      });
      if (response) {
        console.log("Updated successfully");
        console.log(response.data);
        closePopUpEnd()
      }
      fetchUpdatedMatch(match._id);
    } catch (error) {
      console.log(error);
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
        console.log(response.data);
        setTimeout(() => {
          setShowAnimation(false);
        }, 5000);
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
        setTimeout(() => {
          setShowAnimation(false);
        }, 5000);
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

  // Delete PopUp Event
  const openPopUpDelete = () => {
    setIsOpenPopUpDelete(true);
    document.body.style.overflow = " hidden";
  };

  const closePopUpDelete = () => {
    setIsOpenPopUpDelete(false);
    document.body.style.overflow = "auto";
  };

  const cancelDeleteEvent = () => {
    closePopUpDelete();
  };

  const handleOpenDelete = (id) => {
    openPopUpDelete();
    setSelectedEvent(id);
  };

  const handleDeleteEvent = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.patch(
        `/matchdetails/deleteObject/${match.details._id}/${selectedEvent}`
      );

      if (response) {
        console.log("Deleted successfully");
        fetchUpdatedMatch(match._id);
        cancelDeleteEvent();
      }
    } catch (error) {
      console.log(error);
    }
  };
  /////////////////////

  // Edit PopUp Event
  const openPopUpEdit = () => {
    setIsOpenPopUpEdit(true);
    document.body.style.overflow = " hidden";
  };

  const closePopUpEdit = () => {
    setIsOpenPopUpEdit(false);
    document.body.style.overflow = "auto";
  };

  const handleOpenEdit = (event) => {
    openPopUpEdit();
    setSelectedEvent(event);
    // console.log(event)
  };

  const cancelEditEvent = () => {
    closePopUpEdit();
  };

  const handleEditEvent = async (formData) => {
    try {
      const response = await axiosInstance.patch(
        `/matchdetails/updateObject/${match.details._id}/${selectedEvent._id}`,
        formData
      );
      if (response) {
        console.log("Updated Successfully");
        fetchUpdatedMatch(match._id);
        cancelEditEvent();
      }
    } catch (error) {
      console.error("Error updating object:", error);
    }
  };
  ////////////

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
                <button className={StyleSingleMatch.open} onClick={openPopUp}>
                  +
                </button>
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
                    <div className={StyleSingleMatch.eventActions}>
                      <button
                        type="button"
                        onClick={() => handleOpenDelete(event._id)}
                        style={{ border: "none" }}
                      >
                        <img src={EventDelete} alt="" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(event)}
                        style={{ border: "none" }}
                      >
                        <img src={EventEdit} alt="" />
                      </button>
                    </div>
                    <p>{event.minute}'</p>
                  </div>
                ))}
                {user.role === "admin" ||
                user.userId === match.watcher._id ||
                user._id === match.watcher._id ? (
                  <div
                    style={{
                      display: "flex",
                      columnGap: "20px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleOpenEndMatch}
                      className={StyleSingleMatch.endMatch}
                    >
                      End Match
                    </button>
                  </div>
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
            {user.role === "admin" ||
            user.userId === match.watcher._id ||
            user._id === match.watcher._id ? (
              <>
                <div className={StyleSingleMatch.singleReport}>
                  <img
                    src={`${process.env.REACT_APP_IMAGE_PATH}/${match.watcher.image}`}
                    alt={match.watcher.name}
                    className={StyleSingleMatch.imagesReports}
                  />
                  <div className={StyleSingleMatch.partReport}>
                    <p>Watcher {match.watcher.firstName}'s Report :</p>
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

          <>
            {user.role === "admin" ||
            user.userId === match.referee._id ||
            user._id === match.referee._id ? (
              <>
                <div className={StyleSingleMatch.singleReport}>
                  <img
                    src={`${process.env.REACT_APP_IMAGE_PATH}/${match.watcher.image}`}
                    alt={match.watcher.name}
                    className={StyleSingleMatch.imagesReports}
                  />
                  <div className={StyleSingleMatch.partReport}>
                    <p>Referee {match.referee.firstName}'s Report :</p>
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
    {
      title: "info",
      id: "info",
      content: (
        <div className={StyleSingleMatch.infoContainer}>
          <div className={StyleSingleMatch.persons}>
            <div className={StyleSingleMatch.linesmanContainer}>
              {/* <p>Referee</p> */}
              <img src={Signal} alt="" className={StyleSingleMatch.iconInfo} />
              <div className={StyleSingleMatch.linesman}>
                <img
                  src={`${process.env.REACT_APP_IMAGE_PATH}/${match.referee.image}`}
                  alt={match.referee.name}
                  className={StyleSingleMatch.linesmanImage}
                />
                <p>
                  {match.referee.firstName} {match.referee.lastName}
                </p>
              </div>
            </div>
            <div className={StyleSingleMatch.linesmanContainer}>
              {/* <p>Watcher</p> */}
              <img src={Arrow} alt="" className={StyleSingleMatch.iconInfo} />
              <div className={StyleSingleMatch.linesman}>
                <img
                  src={`${process.env.REACT_APP_IMAGE_PATH}/${match.watcher.image}`}
                  alt={match.watcher.name}
                  className={StyleSingleMatch.linesmanImage}
                />
                <p>
                  {match.watcher.firstName} {match.watcher.lastName}
                </p>
              </div>
            </div>
            <div className={StyleSingleMatch.linesmanContainer}>
              {/* <p>LinesMan One :</p> */}
              <img src={Flag} alt="" className={StyleSingleMatch.iconInfo} />
              <div className={StyleSingleMatch.linesman}>
                <img
                  src={`${process.env.REACT_APP_IMAGE_PATH}/${match.linesman_one.image}`}
                  alt={match.linesman_one.firstName}
                  className={StyleSingleMatch.linesmanImage}
                />
                <p>
                  {match.linesman_one.firstName} {match.linesman_one.lastName}
                </p>
              </div>
            </div>
            <div className={StyleSingleMatch.linesmanContainer}>
              {/* <p>LinesMan two</p> */}
              <img src={Flag} alt="" className={StyleSingleMatch.iconInfo} />
              <div className={StyleSingleMatch.linesman}>
                <img
                  src={`${process.env.REACT_APP_IMAGE_PATH}/${match.linesman_two.image}`}
                  alt={match.linesman_two.firstName}
                  className={StyleSingleMatch.linesmanImage}
                />
                <p>
                  {match.linesman_two.firstName} {match.linesman_two.lastName}
                </p>
              </div>
            </div>
          </div>
          <div className={StyleSingleMatch.things}>
            <div className={StyleSingleMatch.thing}>
              <img src={Trophy} alt="" className={StyleSingleMatch.iconInfo} />
              <p>{match.title}</p>
            </div>
            <div className={StyleSingleMatch.thing}>
              <img
                src={Calendar}
                alt=""
                className={StyleSingleMatch.iconInfo}
              />
              <p>
                {" "}
                {new Date(match.match_date).toLocaleDateString("en-US", {
                  timeZone: "UTC",
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className={StyleSingleMatch.thing}>
              <img src={Clock} alt="" className={StyleSingleMatch.iconInfo} />
              <p>
                {" "}
                {new Date(match.match_date).toLocaleTimeString("en-US", {
                  timeZone: "UTC",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
            </div>
            <div className={StyleSingleMatch.thing}>
              <img src={Stadium} alt="" className={StyleSingleMatch.iconInfo} />
              <p>{match.pitch}</p>
            </div>
            <div className={StyleSingleMatch.thing}>
              <img src={Stadium} alt="" className={StyleSingleMatch.iconInfo} />
              <p>{match.season}</p>
            </div>{" "}
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {openEndMatch && (
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
            onClick={closePopUpEndMatch}
          ></div>
          <EndMatch
            closePopUpEndMatch={closePopUpEndMatch}
            handleEndMatch={handleEndMatch}
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
      {isOpenPopUpDelete && (
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
            onClick={closePopUpDelete}
          ></div>
          <EventDeletePopUp
            cancelDeleteEvent={cancelDeleteEvent}
            handleDeleteEvent={handleDeleteEvent}
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
      {isOpenPopUpEdit && (
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
            onClick={closePopUpEdit}
          ></div>
          <EventEditPopUp
            cancelEditEvent={cancelEditEvent}
            handleEditEvent={handleEditEvent}
            teamATeam={match.team_a.team}
            teamBTeam={match.team_b.team}
            playersATeam={match.team_a.team.players}
            playersBTeam={match.team_b.team.players}
            event={selectedEvent}
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
              <p>{match.team_a.score}</p>
              <span>-</span>
              <p>{match.team_b.score}</p>
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
                <TabButton
                  selectTab={() => handleTabChange("info")}
                  active={tab === "info"}
                >
                  MATCH INFO
                </TabButton>
              </section>

              {TAB_DATA.find((t) => t.id === tab).content}
            </section>
          </article>
        </main>
      </>
    </>
  );
}

export default SingleMatch;
