import React, { useEffect, useTransition, useState } from "react";
import { useLocation } from "react-router-dom";
import StyleSingleMatch from "./SingleMatch.module.css";
import TabButton from "../../Components/TabButton/TabButton";
import Event from "../../Components/Event/EventAdd/Event";
import axiosInstance from "../../Utils/AxiosInstance";
import FootballLoader from "../FootballLoader/FootballLoader";
import { Reveal } from "../../Frammotion/RevealAnimation";
import { useUserStore } from "../../Zustand/Store";
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
import { useLanguage } from "../../Utils/LanguageContext";
import Season from "../../Assets/icons/ic--baseline-update.svg";
import whistle from "../../Assets/icons/mdi--whistle.svg";

function SingleMatch() {
  const { user } = useUserStore();
  // const { matches } = useMatchesStore();
  const [tab, setTab] = useState("live");
  const [isPending, startTransition] = useTransition();
  const [isOpenPopUpEvent, setIsOpenPopUpEvent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [watcherReport, setWatcherReport] = useState("");
  const [refereeReport, setRefereeReport] = useState("");
  const [isOpenPopUpDelete, setIsOpenPopUpDelete] = useState(false);
  const [isOpenPopUpEdit, setIsOpenPopUpEdit] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openEndMatch, setOpenEndMatch] = useState(false);
  const { language } = useLanguage();
  const [actionWatcher, setActionWatcher] = useState("");
  const [actionReferee, setActionReferee] = useState("");
  const { getAllTeams } = useTeamsStore();
  const { getAllMatches } = useMatchesStore();
  const [selectedEventTypeA, setSelectedEventTypeA] = useState("");
  const [selectedEventTypeB, setSelectedEventTypeB] = useState("");
  const [selectedEventType, setSelectedEventType] = useState("");
  const [selectedPenaltyTypeA, setSelectedPenaltyTypeA] = useState("");
  const [selectedPenaltyTypeB, setSelectedPenaltyTypeB] = useState("");

  const [formAction, setFormAction] = useState({
    type: "",
    team: "",
    playerIn: "",
    playerOut: "",
    minute: "",
    penalty: "",
  });

  const handleEventClickTeamA = (type, penalty = null) => {
    setSelectedEventTypeA(type);
    setSelectedPenaltyTypeA(penalty);
    setFormAction({
      ...formAction,
      type: type,
      penalty: penalty,
      team: match.team_a?.team._id,
    });
  };

  const handleEventClickTeamB = (type, penalty = null) => {
    setSelectedEventTypeB(type);
    setSelectedPenaltyTypeB(penalty);
    setFormAction({
      ...formAction,
      type: type,
      penalty: penalty,
      team: match.team_b?.team._id,
    });
  };

  const handleEventClick = (type) => {
    setSelectedEventType(type);
    setFormAction({ ...formAction, type: type });
  };
  const handleCancel = () => {
    setSelectedEventTypeA("");
    setSelectedEventTypeB("");
    setFormAction({
      type: "",
      team: "",
      playerIn: "",
      playerOut: "",
      minute: "",
      penalty: "",
    });
  };

  const handleAddAction = async (e) => {
    e.preventDefault();
    console.log(formAction);
    try {
      const response = await axiosInstance.patch(
        `/matchdetails/addObject/${detailIdWatcher}`,
        formAction
      );

      if (response) {
        console.log("created successfully");
        handleCancel();
        console.log(response.data);

        fetchUpdatedMatch(match._id);
      }
    } catch (error) {
      console.error("Error updating match details:", error);
    }
  };

  useEffect(() => {
    getAllTeams();
    getAllMatches();
  }, [getAllTeams, getAllMatches]);

  const handleTabChange = (id) => {
    startTransition(() => {
      setTab(id);
    });
  };

  const location = useLocation();
  const [match, setMatch] = useState(location.state?.match || {});

  // console.log(match);

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

  let detailIdWatcher = match?.detailsWatcher?._id;

  const handleEventSubmit = async (formData) => {
    try {
      const response = await axiosInstance.patch(
        `/matchdetails/addObject/${detailIdWatcher}`,
        formData
      );

      if (response) {
        console.log("created successfully");

        fetchUpdatedMatch(match._id);
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

  const handleEndMatch = async () => {
    try {
      const response = await axiosInstance.patch(`/match/update/${match._id}`, {
        played: true,
      });
      if (response) {
        console.log("Updated successfully");
        console.log(response.data);
        closePopUpEnd();
      }
      fetchUpdatedMatch(match._id);
    } catch (error) {
      console.log(error);
    }
  };

  const events = match?.detailsWatcher?.details;

  const handleUpdateWatcherReport = async () => {
    try {
      const response = await axiosInstance.patch(`/match/update/${match._id}`, {
        watcher_report: watcherReport,
      });

      if (response) {
        setActionWatcher("");
      }
      fetchUpdatedMatch(match._id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBackWatcher = () => {
    setActionWatcher("");
  };

  const handleBackReferee = () => {
    setActionReferee("");
  };

  const handleUpdateRefereeReport = async () => {
    try {
      const response = await axiosInstance.patch(`/match/update/${match._id}`, {
        referee_report: refereeReport,
      });

      if (response) {
        setActionReferee("");
      }
      fetchUpdatedMatch(match._id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTextareaChangeWatcher = (event) => {
    setWatcherReport(event.target.value);
  };

  const handleActionChange = (e) => {
    setActionWatcher(e.target.value);
    if (e.target.value === "Edit") {
      document.getElementById("watcher-report-textarea").disabled = false;
      document.getElementById("watcher-report-textarea").focus();
    }
  };

  const handleActionChangeReferee = (e) => {
    setActionReferee(e.target.value);
    if (e.target.value === "Edit") {
      document.getElementById("referee-report-textarea").disabled = false;
      document.getElementById("referee-report-textarea").focus();
    }
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
        `/matchdetails/deleteObject/${match.detailsWatcher._id}/${selectedEvent}`
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
  };

  const cancelEditEvent = () => {
    closePopUpEdit();
  };

  const handleEditEvent = async (formData) => {
    try {
      const response = await axiosInstance.patch(
        `/matchdetails/updateObject/${match.detailsWatcher._id}/${selectedEvent._id}`,
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
                {user?.role === "admin" ||
                user?.userId === match.watcher._id ||
                user?._id === match.watcher._id ? (
                  <>
                    {/* <button
                      className={StyleSingleMatch.open}
                      onClick={openPopUp}
                      // disabled={match.played}
                      disabled={match.reported}
                    >
                      +
                    </button> */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "10px",
                      }}
                    >
                      <h1>Try smth</h1>
                      <div
                        style={{
                          display: "flex",
                          columnGap: "10px",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          onClick={() => handleEventClick("HT")}
                          className={`${StyleSingleMatch.singleAction} ${
                            selectedEventType === "HT"
                              ? StyleSingleMatch.selectedEvent
                              : ""
                          }`}
                        >
                          <img
                            src={`${process.env.REACT_APP_IMAGE_PATH}/half-time.png`}
                            alt="half time"
                            className={StyleSingleMatch.iconActions}
                          />
                        </button>
                        <button
                          onClick={() => handleEventClick("full_time")}
                          className={`${StyleSingleMatch.singleAction} ${
                            selectedEventType === "full_time"
                              ? StyleSingleMatch.selectedEvent
                              : ""
                          }`}
                        >
                          <img
                            src={`${process.env.REACT_APP_IMAGE_PATH}/full-time.png`}
                            alt="full time"
                            className={StyleSingleMatch.iconActions}
                          />
                        </button>
                        <button
                          onClick={() => handleEventClick("firstExtraTime")}
                          className={`${StyleSingleMatch.singleAction} ${
                            selectedEventType === "firstExtraTime"
                              ? StyleSingleMatch.selectedEvent
                              : ""
                          }`}
                          // className={StyleSingleMatch.singleAction}
                        >
                          <img
                            src={`${process.env.REACT_APP_IMAGE_PATH}/firstExtraTime.png`}
                            alt="firstExtraTime"
                            className={StyleSingleMatch.iconActions}
                          />
                        </button>
                        <button
                          onClick={() => handleEventClick("secondExtraTime")}
                          className={`${StyleSingleMatch.singleAction} ${
                            selectedEventType === "secondExtraTime"
                              ? StyleSingleMatch.selectedEvent
                              : ""
                          }`}
                          // className={StyleSingleMatch.singleAction}
                        >
                          <img
                            src={`${process.env.REACT_APP_IMAGE_PATH}/secondExtraTime.png`}
                            alt="secondExtraTime"
                            className={StyleSingleMatch.iconActions}
                          />
                        </button>
                        <button
                          onClick={() => handleEventClick("penalties")}
                          className={`${StyleSingleMatch.singleAction} ${
                            selectedEventType === "penalties"
                              ? StyleSingleMatch.selectedEvent
                              : ""
                          }`}
                          // className={StyleSingleMatch.singleAction}
                        >
                          <img
                            src={`${process.env.REACT_APP_IMAGE_PATH}/penalties.png`}
                            alt="penalties"
                            className={StyleSingleMatch.iconActions}
                          />
                        </button>
                      </div>

                      {selectedEventType && (
                        <button
                          onClick={handleAddAction}
                          className={StyleSingleMatch.whistle}
                        >
                          <img src={whistle} alt="whistle" />
                          Whistle
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  ""
                )}

                {events?.length > 0 ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        columnGap: "10%",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "20px",
                        marginBottom: "20px",
                      }}
                    >
                      <div
                        style={{
                          width: "60px",
                          height: "2px",
                          backgroundColor: "green",
                        }}
                      ></div>
                      <h1
                        style={{
                          color: "green",
                          textAlign: "center",
                          fontSize: "clamp(15px , 4vw , 25px)",
                        }}
                      >
                        {language === "en" ? "Match begins!" : "بداية المباراة"}
                      </h1>
                      <div
                        style={{
                          width: "60px",
                          height: "2px",
                          backgroundColor: "green",
                        }}
                      ></div>
                    </div>

                    {events.map((event) => (
                      <>
                        {event.type === "HT" ? (
                          <div>
                            <section className={StyleSingleMatch.resultHT}>
                              <p style={{ color: "white" }}>
                                {match?.team_a?.scoreHT}
                              </p>

                              <h1
                                style={{
                                  color: "red",
                                  textAlign: "center",
                                  fontSize: "clamp(15px , 4vw , 20px)",
                                }}
                              >
                                {language === "en" ? "HT" : "نهاية الشوط الأول"}
                              </h1>
                              <p style={{ color: "white" }}>
                                {match?.team_b?.scoreHT}
                              </p>
                            </section>

                            {user?.role === "admin" ||
                            user?.userId === match.watcher._id ||
                            user?._id === match.watcher._id ? (
                              <div className={StyleSingleMatch.eventActions}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenDelete(event._id)}
                                  className={StyleSingleMatch.delete}
                                  // disabled={match.played}
                                  disabled={match.reported}
                                >
                                  <img src={EventDelete} alt="" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(event)}
                                  // style={{ border: "none" }}
                                  className={StyleSingleMatch.edit}
                                  // disabled={match.played}
                                  disabled={match.reported}
                                >
                                  <img src={EventEdit} alt="" />
                                </button>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        ) : event.type === "full_time" ? (
                          <div>
                            <div
                              style={{
                                display: "flex",
                                columnGap: "10%",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  width: "60px",
                                  height: "2px",
                                  backgroundColor: "red",
                                }}
                              ></div>
                              <h1
                                style={{
                                  color: "red",
                                  textAlign: "center",
                                  fontSize: "clamp(15px , 4vw , 20px)",
                                }}
                              >
                                {language === "en"
                                  ? "FT"
                                  : "نهاية الوقت الأصلي"}
                              </h1>
                              <div
                                style={{
                                  width: "60px",
                                  height: "2px",
                                  backgroundColor: "red",
                                }}
                              ></div>
                            </div>
                            {user?.role === "admin" ||
                            user?.userId === match.watcher._id ||
                            user?._id === match.watcher._id ? (
                              <div className={StyleSingleMatch.eventActions}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenDelete(event._id)}
                                  className={StyleSingleMatch.delete}
                                  // disabled={match.played}
                                  disabled={match.reported}
                                >
                                  <img src={EventDelete} alt="" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(event)}
                                  // style={{ border: "none" }}
                                  className={StyleSingleMatch.edit}
                                  // disabled={match.played}
                                  disabled={match.reported}
                                >
                                  <img src={EventEdit} alt="" />
                                </button>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        ) : event.type === "firstExtraTime" ? (
                          <div>
                            <div
                              style={{
                                display: "flex",
                                columnGap: "10%",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  width: "60px",
                                  height: "2px",
                                  backgroundColor: "red",
                                }}
                              ></div>
                              <h1
                                style={{
                                  color: "red",
                                  textAlign: "center",
                                  fontSize: "clamp(15px , 4vw , 20px)",
                                }}
                              >
                                {language === "en"
                                  ? "First Extra Time"
                                  : "نهاية الشوط الإضافي الأول"}
                              </h1>
                              <div
                                style={{
                                  width: "60px",
                                  height: "2px",
                                  backgroundColor: "red",
                                }}
                              ></div>
                            </div>
                            {user?.role === "admin" ||
                            user?.userId === match.watcher._id ||
                            user?._id === match.watcher._id ? (
                              <div className={StyleSingleMatch.eventActions}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenDelete(event._id)}
                                  className={StyleSingleMatch.delete}
                                  // disabled={match.played}
                                  disabled={match.reported}
                                >
                                  <img src={EventDelete} alt="" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(event)}
                                  // style={{ border: "none" }}
                                  className={StyleSingleMatch.edit}
                                  // disabled={match.played}
                                  disabled={match.reported}
                                >
                                  <img src={EventEdit} alt="" />
                                </button>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        ) : event.type === "secondExtraTime" ? (
                          <div>
                            <div
                              style={{
                                display: "flex",
                                columnGap: "10%",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  width: "60px",
                                  height: "2px",
                                  backgroundColor: "red",
                                }}
                              ></div>
                              <h1
                                style={{
                                  color: "red",
                                  textAlign: "center",
                                  fontSize: "clamp(15px , 4vw , 20px)",
                                }}
                              >
                                {language === "en"
                                  ? "Second Extra Time"
                                  : "نهاية الشوط الإضافي الثاني"}
                              </h1>
                              <div
                                style={{
                                  width: "60px",
                                  height: "2px",
                                  backgroundColor: "red",
                                }}
                              ></div>
                            </div>
                            {user?.role === "admin" ||
                            user?.userId === match.watcher._id ||
                            user?._id === match.watcher._id ? (
                              <div className={StyleSingleMatch.eventActions}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenDelete(event._id)}
                                  className={StyleSingleMatch.delete}
                                  disabled={match.reported}
                                >
                                  <img src={EventDelete} alt="" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(event)}
                                  className={StyleSingleMatch.edit}
                                  disabled={match.reported}
                                >
                                  <img src={EventEdit} alt="" />
                                </button>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        ) : event.type === "penalties" ? (
                          <div>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  columnGap: "10%",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: "60px",
                                    height: "2px",
                                    backgroundColor: "red",
                                  }}
                                ></div>
                                <h1
                                  style={{
                                    color: "red",
                                    textAlign: "center",
                                    fontSize: "clamp(15px , 4vw , 20px)",
                                  }}
                                >
                                  {language === "en"
                                    ? "Penalties"
                                    : "ضربات جزاء"}
                                </h1>
                                <div
                                  style={{
                                    width: "60px",
                                    height: "2px",
                                    backgroundColor: "red",
                                  }}
                                ></div>
                              </div>
                              {user?.role === "admin" ||
                              user?.userId === match.watcher._id ||
                              user?._id === match.watcher._id ? (
                                <div className={StyleSingleMatch.eventActions}>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenDelete(event._id)}
                                    className={StyleSingleMatch.delete}
                                    // disabled={match.played}
                                    disabled={match.reported}
                                  >
                                    <img src={EventDelete} alt="" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEdit(event)}
                                    // style={{ border: "none" }}
                                    className={StyleSingleMatch.edit}
                                    // disabled={match.played}
                                    disabled={match.reported}
                                  >
                                    <img src={EventEdit} alt="" />
                                  </button>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        ) : (
                          <div
                            key={event._id}
                            className={`${StyleSingleMatch.event} ${
                              event?.team?._id === match?.team_b?.team._id
                                ? StyleSingleMatch.flexStart
                                : StyleSingleMatch.flexEnd
                            }`}
                          >
                            <div
                              className={`${StyleSingleMatch.type} ${
                                event?.team?._id === match?.team_b.team._id
                                  ? StyleSingleMatch.rowDirection
                                  : ""
                              }`}
                            >
                              {event.penalty === "scored" ? (
                                <img
                                  src={`${process.env.REACT_APP_IMAGE_PATH}/scored.png`}
                                  alt="scored"
                                  className={StyleSingleMatch.iconType}
                                />
                              ) : event.penalty === "missed" ? (
                                <img
                                  src={`${process.env.REACT_APP_IMAGE_PATH}/missed.png`}
                                  alt="missed"
                                  className={StyleSingleMatch.iconType}
                                />
                              ) : event.type === "goal" ? (
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

                              {event.type === "substitution" ? (
                                <div className={StyleSingleMatch.substitution}>
                                  <div
                                    className={
                                      event?.team?._id ===
                                      match?.team_a?.team._id
                                        ? StyleSingleMatch.singleEvent
                                        : StyleSingleMatch.singleEventB
                                    }
                                  >
                                    <img
                                      src={`${process.env.REACT_APP_IMAGE_PATH}/${event?.playerIn?.image}`}
                                      alt={event?.playerIn?.name}
                                      className={StyleSingleMatch.playerIdImage}
                                    />
                                    <p>{event.playerIn.name}</p>
                                  </div>
                                  {/* <p className={StyleSingleMatch.out}>
                                    {event.playerOut.name}
                                  </p> */}
                                  <div
                                    className={
                                      event?.team?._id ===
                                      match?.team_a?.team._id
                                        ? StyleSingleMatch.singleEvent
                                        : StyleSingleMatch.singleEventB
                                    }
                                  >
                                    <img
                                      src={`${process.env.REACT_APP_IMAGE_PATH}/${event?.playerOut?.image}`}
                                      alt={event?.playerOut?.name}
                                      className={StyleSingleMatch.playerIdImage}
                                    />
                                    <p className={StyleSingleMatch.out}>
                                      {event?.playerOut?.name}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className={
                                    event?.team?._id === match?.team_a?.team._id
                                      ? StyleSingleMatch.singleEvent
                                      : StyleSingleMatch.singleEventB
                                  }
                                >
                                  <img
                                    src={`${process.env.REACT_APP_IMAGE_PATH}/${event?.playerIn?.image}`}
                                    alt={event?.playerIn?.name}
                                    className={StyleSingleMatch.playerIdImage}
                                  />
                                  <p>{event?.playerIn?.name}</p>
                                </div>
                              )}
                            </div>

                            {user?.role === "admin" ||
                            user?.userId === match.watcher._id ||
                            user?._id === match.watcher._id ? (
                              <div className={StyleSingleMatch.eventActions}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenDelete(event._id)}
                                  className={StyleSingleMatch.delete}
                                  // disabled={match.played}
                                  disabled={match.reported}
                                >
                                  <img src={EventDelete} alt="" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(event)}
                                  // style={{ border: "none" }}
                                  className={StyleSingleMatch.edit}
                                  // disabled={match.played}
                                  disabled={match.reported}
                                >
                                  <img src={EventEdit} alt="" />
                                </button>
                              </div>
                            ) : (
                              ""
                            )}

                            {/* <p>{event.minute}'</p> */}
                            {event.penalty === "scored" ||
                            event.penalty === "missed" ? (
                              ""
                            ) : (
                              <p>{event.minute}'</p>
                            )}
                          </div>
                        )}
                      </>
                    ))}
                  </>
                ) : (
                  "No Event Yet!"
                )}

                <div>
                  {match.played === true ? (
                    <div
                      style={{
                        display: "flex",
                        columnGap: "10%",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "20px",
                        marginBottom: "20px",
                      }}
                    >
                      <div
                        style={{
                          width: "60px",
                          height: "2px",
                          backgroundColor: "red",
                        }}
                      ></div>
                      <h1
                        style={{
                          color: "red",
                          textAlign: "center",
                          fontSize: "clamp(15px , 4vw , 20px)",
                        }}
                      >
                        {language === "en"
                          ? "Match is over!"
                          : "نهاية المباراة"}
                      </h1>
                      <div
                        style={{
                          width: "60px",
                          height: "2px",
                          backgroundColor: "red",
                        }}
                      ></div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                {user?.role === "admin" ||
                user?.userId === match.watcher._id ||
                user?._id === match.watcher._id ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      // columnGap: "20px",
                      rowGap: "20px",
                      marginTop: "20px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleOpenEndMatch}
                      className={StyleSingleMatch.endMatch}
                      // disabled={match.played}
                      disabled={match.reported}
                    >
                      End Match
                    </button>
                  </div>
                ) : (
                  ""
                )}
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
          <h1>In Progress ...</h1>
        </div>
      ),
    },
    {
      title: "reports",
      id: "reports",
      content: (
        <div className={StyleSingleMatch.reportsContainer}>
          <>
            {user?.role === "admin" ||
            user?.userId === match.watcher._id ||
            user?._id === match.watcher._id ? (
              <>
                <div
                  className={`${StyleSingleMatch.singleReport} ${
                    user?.role !== "admin"
                      ? StyleSingleMatch.singleReportFull
                      : ""
                  }`}
                >
                  <div
                    className={
                      language === "en"
                        ? StyleSingleMatch.reportOption
                        : StyleSingleMatch.reportOptionAr
                    }
                  >
                    <div
                      className={
                        language === "en"
                          ? StyleSingleMatch.partReport
                          : StyleSingleMatch.partReportAr
                      }
                    >
                      <img
                        src={`${process.env.REACT_APP_IMAGE_PATH}/${match?.watcher?.image}`}
                        alt={match?.watcher?.name}
                        className={StyleSingleMatch.imagesReports}
                      />
                      <p>
                        {language === "en"
                          ? `Watcher ${match?.watcher?.firstName}'s Report :`
                          : `تقرير المراقب ${match?.watcher?.firstName}`}
                      </p>
                    </div>
                    {match.reported === true ? (
                      <p className={StyleSingleMatch.reported}>
                        {language === "en"
                          ? "Not Allowed To Update this Report anymore!"
                          : "لم يعد بإمكانك تعديل هذا التقرير بعد الآن"}
                      </p>
                    ) : (
                      ""
                    )}
                    {match.reported !== true ? (
                      actionWatcher === "Edit" ? (
                        ""
                      ) : (
                        <div className={StyleSingleMatch.containerOption}>
                          <div className={StyleSingleMatch.customSelect}>
                            <select value="" onChange={handleActionChange}>
                              <option value="" disabled hidden></option>
                              <option
                                value="Edit"
                                className={StyleSingleMatch.customOption}
                              >
                                {language === "en"
                                  ? "Edit Report"
                                  : "تعديل التقرير"}
                              </option>
                            </select>
                          </div>
                        </div>
                      )
                    ) : (
                      ""
                    )}
                  </div>

                  <>
                    <textarea
                      id="watcher-report-textarea"
                      className={StyleSingleMatch.textArea}
                      rows="15"
                      placeholder="Enter your report as watcher here..."
                      value={watcherReport}
                      onChange={handleTextareaChangeWatcher}
                      disabled={actionWatcher !== "Edit"}
                    ></textarea>
                    <div
                      className={
                        language === "en"
                          ? StyleSingleMatch.ButtonsReport
                          : StyleSingleMatch.ButtonsReportAr
                      }
                    >
                      {actionWatcher === "Edit" ? (
                        <>
                          <button
                            type="button"
                            className={StyleSingleMatch.back}
                            onClick={handleBackWatcher}
                          >
                            {language === "en" ? "Back" : "العودة"}
                          </button>
                          <button
                            type="button"
                            className={StyleSingleMatch.post}
                            onClick={handleUpdateWatcherReport}
                          >
                            {language === "en" ? "Save" : "حفظ"}
                          </button>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </>
                </div>
              </>
            ) : null}
          </>

          <>
            {user?.role === "admin" ||
            user?.userId === match.referee._id ||
            user?._id === match.referee._id ? (
              <>
                <div
                  className={`${StyleSingleMatch.singleReport} ${
                    user?.role !== "admin"
                      ? StyleSingleMatch.singleReportFull
                      : ""
                  }`}
                >
                  <div
                    className={
                      language === "en"
                        ? StyleSingleMatch.reportOption
                        : StyleSingleMatch.reportOptionAr
                    }
                  >
                    <div
                      className={
                        language === "en"
                          ? StyleSingleMatch.partReport
                          : StyleSingleMatch.partReportAr
                      }
                    >
                      <img
                        src={`${process.env.REACT_APP_IMAGE_PATH}/${match?.referee?.image}`}
                        alt={match?.referee?.name}
                        className={StyleSingleMatch.imagesReports}
                      />
                      <p>
                        {language === "en"
                          ? `Referee ${match?.referee?.firstName}'s Report :`
                          : `تقرير الحكم ${match?.referee?.firstName}`}
                      </p>
                    </div>
                    {match.reported === true ? (
                      <p className={StyleSingleMatch.reported}>
                        {language === "en"
                          ? "Not Allowed To Update this Report anymore!"
                          : "لم يعد بإمكانك تعديل هذا التقرير بعد الآن"}
                      </p>
                    ) : (
                      ""
                    )}
                    {match.reported !== true ? (
                      actionReferee === "Edit" ? (
                        ""
                      ) : (
                        <div className={StyleSingleMatch.containerOption}>
                          <div className={StyleSingleMatch.customSelect}>
                            <select
                              value=""
                              onChange={handleActionChangeReferee}
                            >
                              <option value="" disabled hidden></option>
                              <option
                                value="Edit"
                                className={StyleSingleMatch.customOption}
                              >
                                {language === "en"
                                  ? "Edit Report"
                                  : "تعديل التقرير"}
                              </option>
                            </select>
                          </div>
                        </div>
                      )
                    ) : (
                      ""
                    )}
                  </div>
                  <textarea
                    id="referee-report-textarea"
                    className={StyleSingleMatch.textArea}
                    rows="15"
                    placeholder="Enter your report as referee here..."
                    value={refereeReport}
                    onChange={handleTextareaChangeReferee}
                    disabled={actionReferee !== "Edit"}
                  ></textarea>
                  <div
                    className={
                      language === "en"
                        ? StyleSingleMatch.ButtonsReport
                        : StyleSingleMatch.ButtonsReportAr
                    }
                  >
                    {actionReferee === "Edit" ? (
                      <>
                        <button
                          type="button"
                          className={StyleSingleMatch.back}
                          onClick={handleBackReferee}
                        >
                          {language === "en" ? "Back" : "العودة"}
                        </button>
                        <button
                          type="button"
                          onClick={handleUpdateRefereeReport}
                          className={StyleSingleMatch.post}
                        >
                          {language === "en" ? "Save" : "حفظ"}
                        </button>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
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
              <img src={Signal} alt="" className={StyleSingleMatch.iconInfo} />
              <div className={StyleSingleMatch.linesman}>
                <img
                  src={`${process.env.REACT_APP_IMAGE_PATH}/${match?.referee?.image}`}
                  alt={match?.referee?.name}
                  className={StyleSingleMatch.linesmanImage}
                />
                <p>
                  {match?.referee?.firstName} {match?.referee?.lastName}
                </p>
              </div>
            </div>
            <div className={StyleSingleMatch.linesmanContainer}>
              <img src={Arrow} alt="" className={StyleSingleMatch.iconInfo} />
              <div className={StyleSingleMatch.linesman}>
                <img
                  src={`${process.env.REACT_APP_IMAGE_PATH}/${match?.watcher?.image}`}
                  alt={match?.watcher?.name}
                  className={StyleSingleMatch.linesmanImage}
                />
                <p>
                  {match?.watcher?.firstName} {match?.watcher?.lastName}
                </p>
              </div>
            </div>
            <div className={StyleSingleMatch.linesmanContainer}>
              {/* <p>LinesMan One :</p> */}
              <img src={Flag} alt="" className={StyleSingleMatch.iconInfo} />
              <div className={StyleSingleMatch.linesman}>
                <img
                  src={`${process.env.REACT_APP_IMAGE_PATH}/${match?.linesman_one?.image}`}
                  alt={match?.linesman_one?.firstName}
                  className={StyleSingleMatch.linesmanImage}
                />
                <p>
                  {match?.linesman_one?.firstName}{" "}
                  {match?.linesman_one?.lastName}
                </p>
              </div>
            </div>
            <div className={StyleSingleMatch.linesmanContainer}>
              <img src={Flag} alt="" className={StyleSingleMatch.iconInfo} />
              <div className={StyleSingleMatch.linesman}>
                <img
                  src={`${process.env.REACT_APP_IMAGE_PATH}/${match?.linesman_two?.image}`}
                  alt={match?.linesman_two?.firstName}
                  className={StyleSingleMatch.linesmanImage}
                />
                <p>
                  {match?.linesman_two?.firstName}{" "}
                  {match?.linesman_two?.lastName}
                </p>
              </div>
            </div>
          </div>
          <div className={StyleSingleMatch.things}>
            <div className={StyleSingleMatch.thing}>
              <img src={Trophy} alt="" className={StyleSingleMatch.iconInfo} />
              {/* <p>{match.title}</p> */}
              <p>{match.title.name}</p>
            </div>
            <div className={StyleSingleMatch.thing}>
              <img src={Season} alt="" className={StyleSingleMatch.iconInfo} />
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
                {new Date(
                  `2000-01-01T${match.match_time}:00Z`
                ).toLocaleTimeString("en-US", {
                  timeZone: "UTC",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </p>
            </div>
            <div className={StyleSingleMatch.thing}>
              <img src={Stadium} alt="" className={StyleSingleMatch.iconInfo} />
              <p>{match?.pitch?.name}</p>
            </div>
            <div className={StyleSingleMatch.thing}>
              <img
                src={Calendar}
                alt=""
                className={StyleSingleMatch.iconInfo}
              />{" "}
              <p>{match?.season?.seasonName}</p>
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
              <h1>
                <span style={{ color: "grey", fontSize: "10px" }}>
                  {language === "en" ? "(Home)" : "(المستضيف)"}
                </span>{" "}
                {match.team_a?.team.name}
              </h1>

              {user?.role === "admin" ||
              user?.userId === match.watcher._id ||
              user?._id === match.watcher._id ? (
                <>
                  <div className={StyleSingleMatch.containerActions}>
                    <button
                      onClick={() => handleEventClickTeamA("goal")}
                      className={`${StyleSingleMatch.singleAction} ${
                        selectedEventTypeA === "goal"
                          ? StyleSingleMatch.selected
                          : ""
                      }`}
                    >
                      <img
                        src={`${process.env.REACT_APP_IMAGE_PATH}/football.png`}
                        alt="football"
                        className={StyleSingleMatch.iconActions}
                      />
                    </button>
                    <button
                      onClick={() => handleEventClickTeamA("red_card")}
                      className={`${StyleSingleMatch.singleAction} ${
                        selectedEventTypeA === "red_card"
                          ? StyleSingleMatch.selected
                          : ""
                      }`}
                    >
                      <img
                        src={`${process.env.REACT_APP_IMAGE_PATH}/red-card.png`}
                        alt="red card"
                        className={StyleSingleMatch.iconActions}
                      />
                    </button>
                    <button
                      onClick={() => handleEventClickTeamA("yellow_card")}
                      className={`${StyleSingleMatch.singleAction} ${
                        selectedEventTypeA === "yellow_card"
                          ? StyleSingleMatch.selected
                          : ""
                      }`}
                    >
                      <img
                        src={`${process.env.REACT_APP_IMAGE_PATH}/yellow-card.png`}
                        alt="yellow card"
                        className={StyleSingleMatch.iconActions}
                      />
                    </button>
                    <button
                      onClick={() => handleEventClickTeamA("substitution")}
                      className={`${StyleSingleMatch.singleAction} ${
                        selectedEventTypeA === "substitution"
                          ? StyleSingleMatch.selected
                          : ""
                      }`}
                    >
                      <img
                        src={`${process.env.REACT_APP_IMAGE_PATH}/substitution.png`}
                        alt="substitution"
                        className={StyleSingleMatch.iconActions}
                      />
                    </button>
                  </div>
                  {selectedEventTypeA && (
                    <form
                      onSubmit={handleAddAction}
                      className={StyleSingleMatch.eventForm}
                    >
                      <div className={StyleSingleMatch.control}>
                        <select
                          id="playerIn"
                          value={formAction.playerIn}
                          className={StyleSingleMatch.select}
                          onChange={(e) =>
                            setFormAction({
                              ...formAction,
                              playerIn: e.target.value,
                            })
                          }
                        >
                          <option value="">
                            {selectedEventTypeA === "substitution"
                              ? language === "en"
                                ? "Select Player In"
                                : "اختر لاعب دخول"
                              : language === "en"
                              ? "Select Player"
                              : "اختر لاعب"}
                          </option>
                          {match.team_a.team.players.map((player) => (
                            <option key={player._id} value={player._id}>
                              {player.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {formAction.type === "substitution" && (
                        <div className={StyleSingleMatch.control}>
                          <select
                            id="playerOut"
                            name="playerOut"
                            value={formAction.playerOut}
                            className={StyleSingleMatch.select}
                            onChange={(e) =>
                              setFormAction({
                                ...formAction,
                                playerOut: e.target.value,
                              })
                            }
                            required
                            disabled={formAction.type === "HT"}
                          >
                            <option value="">
                              {language === "en" ? "Select Player Out" : "حدّد"}
                            </option>
                            {match.team_a.team.players.map((player) => (
                              <option key={player._id} value={player._id}>
                                {player.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div className={StyleSingleMatch.control}>
                        {match.isPenalties === true ? (
                          <div className={StyleSingleMatch.penaltiesConatiner}>
                            {/* <h1>Penaltiiies</h1> */}

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "5px",
                                borderRadius: "10px",
                              }}
                              className={`${
                                selectedPenaltyTypeA === "scored"
                                  ? StyleSingleMatch.selectedPenalty
                                  : ""
                              }`}
                            >
                              <img
                                src={`${process.env.REACT_APP_IMAGE_PATH}/scored.png`}
                                alt="scored"
                                className={StyleSingleMatch.iconActions}
                                onClick={() =>
                                  handleEventClickTeamA("goal", "scored")
                                }
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "5px",
                                borderRadius: "10px",
                              }}
                              className={`${
                                selectedPenaltyTypeA === "missed"
                                  ? StyleSingleMatch.selectedPenalty
                                  : ""
                              }`}
                            >
                              <img
                                src={`${process.env.REACT_APP_IMAGE_PATH}/missed.png`}
                                alt="missed"
                                className={StyleSingleMatch.iconActions}
                                onClick={() =>
                                  handleEventClickTeamA("goal", "missed")
                                }
                              />
                            </div>
                          </div>
                        ) : (
                          <input
                            id="minute"
                            type="number"
                            className={StyleSingleMatch.minute}
                            value={formAction.minute}
                            placeholder={
                              language === "en" ? "Minute" : "الدقيقة"
                            }
                            onChange={(e) =>
                              setFormAction({
                                ...formAction,
                                minute: e.target.value,
                              })
                            }
                          />
                        )}
                      </div>
                      <div className={StyleSingleMatch.addCancel}>
                        <button
                          type="submit"
                          className={StyleSingleMatch.addEvent}
                        >
                          {language === "en" ? "Add" : "اضافة"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className={StyleSingleMatch.cancelEvent}
                        >
                          {language === "en" ? "Cancel" : "إلغاء"}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              ) : (
                ""
              )}
            </section>
            <section className={StyleSingleMatch.results}>
              <div className={StyleSingleMatch.result}>
                <p>{match?.team_a?.score}</p>
                <span>-</span>
                <p>{match?.team_b?.score}</p>
              </div>
              <div className={StyleSingleMatch.resultPenalties}>
                <p>{match?.team_a?.scorePenalties}</p>
                <span>-</span>
                <p>{match?.team_b?.scorePenalties}</p>
              </div>
            </section>
            <section className={StyleSingleMatch.teamA}>
              <img
                src={`${process.env.REACT_APP_IMAGE_PATH}/${match.team_b?.team.image}`}
                alt={match?.team_b?.team.name}
                className={StyleSingleMatch.cardImage}
              />
              <h1>
                <span style={{ color: "grey", fontSize: "10px" }}>
                  {language === "en" ? "(Guest)" : "(الضيف)"}
                </span>{" "}
                {match?.team_b?.team?.name}
              </h1>
              {/* Team B Actions  */}

              {user?.role === "admin" ||
              user?.userId === match.watcher._id ||
              user?._id === match.watcher._id ? (
                <>
                  <div className={StyleSingleMatch.containerActions}>
                    <button
                      onClick={() => handleEventClickTeamB("goal")}
                      className={`${StyleSingleMatch.singleAction} ${
                        selectedEventTypeB === "goal"
                          ? StyleSingleMatch.selected
                          : ""
                      }`}
                    >
                      <img
                        src={`${process.env.REACT_APP_IMAGE_PATH}/football.png`}
                        alt="football"
                        className={StyleSingleMatch.iconActions}
                      />
                    </button>
                    <button
                      onClick={() => handleEventClickTeamB("red_card")}
                      className={`${StyleSingleMatch.singleAction} ${
                        selectedEventTypeB === "red_card"
                          ? StyleSingleMatch.selected
                          : ""
                      }`}
                    >
                      <img
                        src={`${process.env.REACT_APP_IMAGE_PATH}/red-card.png`}
                        alt="red card"
                        className={StyleSingleMatch.iconActions}
                      />
                    </button>
                    <button
                      onClick={() => handleEventClickTeamB("yellow_card")}
                      className={`${StyleSingleMatch.singleAction} ${
                        selectedEventTypeB === "yellow_card"
                          ? StyleSingleMatch.selected
                          : ""
                      }`}
                    >
                      <img
                        src={`${process.env.REACT_APP_IMAGE_PATH}/yellow-card.png`}
                        alt="yellow card"
                        className={StyleSingleMatch.iconActions}
                      />
                    </button>
                    <button
                      onClick={() => handleEventClickTeamB("substitution")}
                      className={`${StyleSingleMatch.singleAction} ${
                        selectedEventTypeB === "substitution"
                          ? StyleSingleMatch.selected
                          : ""
                      }`}
                    >
                      <img
                        src={`${process.env.REACT_APP_IMAGE_PATH}/substitution.png`}
                        alt="substitution"
                        className={StyleSingleMatch.iconActions}
                      />
                    </button>
                  </div>
                  {selectedEventTypeB && (
                    <form
                      onSubmit={handleAddAction}
                      className={StyleSingleMatch.eventForm}
                    >
                      <div className={StyleSingleMatch.control}>
                        <select
                          id="playerIn"
                          value={formAction.playerIn}
                          className={StyleSingleMatch.select}
                          onChange={(e) =>
                            setFormAction({
                              ...formAction,
                              playerIn: e.target.value,
                            })
                          }
                        >
                          <option value="">
                            {selectedEventTypeB === "substitution"
                              ? language === "en"
                                ? "Select Player In"
                                : "اختر لاعب دخول"
                              : language === "en"
                              ? "Select Player"
                              : "اختر لاعب"}
                          </option>
                          {match.team_b.team.players.map((player) => (
                            <option key={player._id} value={player._id}>
                              {player.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {formAction.type === "substitution" && (
                        <div className={StyleSingleMatch.control}>
                          <select
                            id="playerOut"
                            name="playerOut"
                            value={formAction.playerOut}
                            className={StyleSingleMatch.select}
                            onChange={(e) =>
                              setFormAction({
                                ...formAction,
                                playerOut: e.target.value,
                              })
                            }
                            required
                            disabled={formAction.type === "HT"}
                          >
                            <option value="">
                              {language === "en" ? "Select Player Out" : "حدّد"}
                            </option>
                            {match.team_b.team.players.map((player) => (
                              <option key={player._id} value={player._id}>
                                {player.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className={StyleSingleMatch.control}>
                        {match.isPenalties === true ? (
                          <div className={StyleSingleMatch.penaltiesConatiner}>
                            {/* <h1>Penaltiiies</h1> */}

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "5px",
                                borderRadius: "10px",
                              }}
                              className={`${
                                selectedPenaltyTypeB === "scored"
                                  ? StyleSingleMatch.selectedPenalty
                                  : ""
                              }`}
                            >
                              <img
                                src={`${process.env.REACT_APP_IMAGE_PATH}/scored.png`}
                                alt="scored"
                                className={StyleSingleMatch.iconActions}
                                onClick={() =>
                                  handleEventClickTeamB("goal", "scored")
                                }
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "5px",
                                borderRadius: "10px",
                              }}
                              className={`${
                                selectedPenaltyTypeB === "missed"
                                  ? StyleSingleMatch.selectedPenalty
                                  : ""
                              }`}
                            >
                              <img
                                src={`${process.env.REACT_APP_IMAGE_PATH}/missed.png`}
                                alt="missed"
                                className={StyleSingleMatch.iconActions}
                                onClick={() =>
                                  handleEventClickTeamB("goal", "missed")
                                }
                              />
                            </div>
                          </div>
                        ) : (
                          <input
                            id="minute"
                            type="number"
                            className={StyleSingleMatch.minute}
                            value={formAction.minute}
                            placeholder={
                              language === "en" ? "Minute" : "الدقيقة"
                            }
                            onChange={(e) =>
                              setFormAction({
                                ...formAction,
                                minute: e.target.value,
                              })
                            }
                          />
                        )}
                      </div>
                      <div className={StyleSingleMatch.addCancel}>
                        <button
                          type="submit"
                          className={StyleSingleMatch.addEvent}
                        >
                          {language === "en" ? "Add" : "اضافة"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className={StyleSingleMatch.cancelEvent}
                        >
                          {language === "en" ? "Cancel" : "إلغاء"}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              ) : (
                ""
              )}
            </section>
          </article>
          <article className={StyleSingleMatch.live}>
            <section className={StyleSingleMatch.position}>
              <section className={StyleSingleMatch.tabContainer}>
                <TabButton
                  selectTab={() => handleTabChange("live")}
                  active={tab === "live"}
                >
                  {language === "en" ? "LIVE" : "مباشر"}
                </TabButton>
                <TabButton
                  selectTab={() => handleTabChange("line-ups")}
                  active={tab === "line-ups"}
                >
                  {language === "en" ? "LINE-UPS" : "التشكيلة"}
                </TabButton>
                {user && (
                  <TabButton
                    selectTab={() => handleTabChange("reports")}
                    active={tab === "reports"}
                  >
                    {language === "en" ? "REPORTS" : "التقارير"}
                  </TabButton>
                )}
                <TabButton
                  selectTab={() => handleTabChange("info")}
                  active={tab === "info"}
                >
                  {language === "en" ? "MATCH INFO" : "التفاصيل"}
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
