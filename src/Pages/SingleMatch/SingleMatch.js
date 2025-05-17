import { useEffect, useTransition, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import StyleSingleMatch from "./SingleMatch.module.css";
import TabButton from "../../Components/TabButton/TabButton";
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
import EndMatch from "../../Components/Event/EndMatch/EndMatch";
import { useLanguage } from "../../Utils/LanguageContext";
import whistle from "../../Assets/icons/mdi--whistle.svg";
import { MdUpdate } from "react-icons/md";
import { MdOutlineStadium } from "react-icons/md";
import { RiCalendarEventFill } from "react-icons/ri";
import { IoTimeOutline } from "react-icons/io5";
import { LuTrophy } from "react-icons/lu";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import { Fab } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Skeleton } from "@mui/material";

import Select from "react-select";

// import io from "socket.io-client";

// const socket = io(process.env.REACT_APP_BACKEND);

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

  const location = useLocation();
  // const [match, setMatch] = useState(location.state?.match || {});
  const [match, setMatch] = useState(location.state?.match || null);
  const { id } = useParams();

  const [formAction, setFormAction] = useState({
    type: "",
    team: "",
    playerIn: "",
    playerOut: "",
    minute: "",
    penalty: "",
    match: `${match?._id}`,
  });

  const handleEventClickTeamA = (type, penalty = null) => {
    setSelectedEventTypeA(type);
    setSelectedPenaltyTypeA(penalty);
    setFormAction({
      ...formAction,
      type: type,
      penalty: penalty,
      team: match?.team_a?.team._id,
    });
  };

  const handleEventClickTeamB = (type, penalty = null) => {
    setSelectedEventTypeB(type);
    setSelectedPenaltyTypeB(penalty);
    setFormAction({
      ...formAction,
      type: type,
      penalty: penalty,
      team: match?.team_b?.team._id,
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

  // console.log(user.role);

  let detailIdWatcher = match?.detailsWatcher?._id;
  let detailIdReferee = match?.detailsReferee?._id;

  const handleAddAction = async (e) => {
    e.preventDefault();

    const { role } = user;

    let detailId;
    let route;

    if (role === "watcher") {
      detailId = detailIdWatcher;
      route = "addObjectWatcher";
    } else if (role === "referee") {
      detailId = detailIdReferee;
      route = "addObjectReferee";
    } else {
      return;
    }

    try {
      const response = await axiosInstance.patch(
        `/matchdetails/${route}/${detailId}`,
        formAction
      );

      // console.log(formAction);

      if (response) {
        console.log("created successfully");
        handleCancel();
        setSelectedEventType("");

        // console.log(response.data);

        fetchUpdatedMatch(match?._id);
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

  // console.log(match);

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

  // useEffect(() => {
  //   fetchUpdatedMatch(match?._id);
  // }, [match?._id]);

  useEffect(() => {
    if (match) {
      fetchUpdatedMatch(match?._id);
    } else if (id) {
      fetchUpdatedMatch(id);
    } else {
      console.error("No match state or id available.");
    }
  }, [match?._id, id]);

  useEffect(() => {
    if (match && match?.watcher_report) {
      setWatcherReport(match?.watcher_report);
    }
    if (match && match?.referee_report) {
      setRefereeReport(match?.referee_report);
    }
  }, [match]);

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

  const handleEndMatch = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.patch(`/match/update/${match._id}`, {
        ...(user.role === "watcher" && { playedWatcher: true }),
        ...(user.role === "referee" && { playedReferee: true }),
      });

      if (response) {
        console.log("Updated successfully");
        console.log(response.data);
        closePopUpEnd();
      }

      fetchUpdatedMatch(match?._id);
    } catch (error) {
      console.log(error);
    }
  };

  const eventsWatcher = match?.detailsWatcher?.details;
  const eventsReferee = match?.detailsReferee?.details;

  const handleUpdateWatcherReport = async () => {
    try {
      const response = await axiosInstance.patch(`/match/update/${match._id}`, {
        watcher_report: watcherReport,
      });

      if (response) {
        setActionWatcher("");
      }
      fetchUpdatedMatch(match?._id);
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
      const response = await axiosInstance.patch(
        `/match/update/${match?._id}`,
        {
          referee_report: refereeReport,
        }
      );

      if (response) {
        setActionReferee("");
      }
      fetchUpdatedMatch(match?._id);
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

    const { role } = user;

    let detailId;

    if (role === "watcher") {
      detailId = detailIdWatcher;
    } else if (role === "referee") {
      detailId = detailIdReferee;
    } else {
      // console.error("Invalid user role:", role);
      return;
    }

    try {
      const response = await axiosInstance.patch(
        `/matchdetails/deleteObject/${detailId}/${selectedEvent}`
      );

      if (response) {
        console.log("Deleted successfully");
        fetchUpdatedMatch(match?._id);
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
    const { role } = user;

    let detailId;

    if (role === "watcher") {
      detailId = match?.detailsWatcher?._id;
    } else if (role === "referee") {
      detailId = match?.detailsReferee?._id;
    } else {
      return;
    }

    try {
      const response = await axiosInstance.patch(
        `/matchdetails/updateObject/${detailId}/${selectedEvent._id}`,
        formData
      );
      if (response) {
        console.log("Updated Successfully");
        fetchUpdatedMatch(match?._id);
        cancelEditEvent();
      }
    } catch (error) {
      console.error("Error updating object:", error);
    }
  };
  ////////////

  // Team A STARTERS
  const [selectedPlayersTeamA, setSelectedPlayersTeamA] = useState([]);
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const handleIsOptionEqualToValueA = (option, value) =>
    option._id === value._id;
  const handleAddStartersA = async () => {
    if (selectedPlayersTeamA.length === 0) {
      return;
    }
    const addStartersTeamA = selectedPlayersTeamA.map((player) => player._id);
    const data = {
      addStartersTeamA: addStartersTeamA,
    };
    try {
      const response = await axiosInstance.patch(
        `/match/update/${match?._id}`,
        data
      );
      if (response) {
        console.log("Players added to Starters Team A successfully");
        setSelectedPlayersTeamA([]);
        fetchUpdatedMatch(match?._id);
      }
    } catch (error) {
      console.error("Error updating object:", error);
    }
  };
  const [unSelectedPlayersTeamA, setUnSelectedPlayersTeamA] = useState([]);
  const handleCheckboxChangeA = (event, playerId) => {
    if (event.target.checked) {
      setUnSelectedPlayersTeamA((prevSelected) => [...prevSelected, playerId]);
    } else {
      setUnSelectedPlayersTeamA((prevSelected) =>
        prevSelected.filter((id) => id !== playerId)
      );
    }
  };
  const handleRemoveStartersA = async () => {
    if (unSelectedPlayersTeamA.length === 0) {
      return;
    }
    const removeStartersTeamA = unSelectedPlayersTeamA;
    const data = {
      removeStartersTeamA: removeStartersTeamA,
    };
    try {
      const response = await axiosInstance.patch(
        `/match/update/${match?._id}`,
        data
      );
      if (response) {
        console.log("Players removed from Starters Team A successfully");
        setUnSelectedPlayersTeamA([]);
        fetchUpdatedMatch(match?._id);
      }
    } catch (error) {
      console.error("Error updating object:", error);
    }
  };

  // Team A SUBSTITUTES
  const [selectedPlayersSubstitutesTeamA, setSelectedPlayersSubstitutesTeamA] =
    useState([]);

  const handleIsOptionEqualToValueASubstitutes = (option, value) =>
    option._id === value._id;

  const handleAddSubstitutesA = async () => {
    if (selectedPlayersSubstitutesTeamA.length === 0) {
      return;
    }
    const addSubstitutesTeamA = selectedPlayersSubstitutesTeamA.map(
      (player) => player._id
    );

    const data = {
      addSubstitutesTeamA: addSubstitutesTeamA,
    };

    try {
      const response = await axiosInstance.patch(
        `/match/update/${match?._id}`,
        data
      );

      if (response) {
        console.log("Players added to Substitutes Team A successfully");
        setSelectedPlayersSubstitutesTeamA([]);
        fetchUpdatedMatch(match?._id);
      }
    } catch (error) {
      console.error("Error updating object:", error);
    }
  };

  const [
    unSelectedPlayersSubstitutesTeamA,
    setUnSelectedPlayersSubstitutesTeamA,
  ] = useState([]);

  const handleCheckboxChangeASubstitutes = (event, playerId) => {
    if (event.target.checked) {
      setUnSelectedPlayersSubstitutesTeamA((prevSelected) => [
        ...prevSelected,
        playerId,
      ]);
    } else {
      setUnSelectedPlayersSubstitutesTeamA((prevSelected) =>
        prevSelected.filter((id) => id !== playerId)
      );
    }
  };

  const handleRemoveSubstitutesA = async () => {
    if (unSelectedPlayersSubstitutesTeamA.length === 0) {
      return;
    }

    const removeSubstitutesTeamA = unSelectedPlayersSubstitutesTeamA;

    const data = {
      removeSubstitutesTeamA: removeSubstitutesTeamA,
    };

    try {
      const response = await axiosInstance.patch(
        `/match/update/${match?._id}`,
        data
      );

      if (response) {
        console.log("Players removed from Substitutes Team A successfully");
        setUnSelectedPlayersSubstitutesTeamA([]);
        fetchUpdatedMatch(match?._id);
      }
    } catch (error) {
      console.error("Error updating object:", error);
    }
  };

  ////////////

  // Team B STARTERS
  const [selectedPlayersTeamB, setSelectedPlayersTeamB] = useState([]);

  const handleIsOptionEqualToValueB = (option, value) =>
    option._id === value._id;
  const handleAddStartersB = async () => {
    if (selectedPlayersTeamB.length === 0) {
      return;
    }
    const addStartersTeamB = selectedPlayersTeamB.map((player) => player._id);
    const data = {
      addStartersTeamB: addStartersTeamB,
    };
    try {
      const response = await axiosInstance.patch(
        `/match/update/${match?._id}`,
        data
      );
      if (response) {
        console.log("Players added to Starters Team B successfully");
        setSelectedPlayersTeamB([]);
        fetchUpdatedMatch(match?._id);
      }
    } catch (error) {
      console.error("Error updating object:", error);
    }
  };
  const [unSelectedPlayersTeamB, setUnSelectedPlayersTeamB] = useState([]);
  const handleCheckboxChangeB = (event, playerId) => {
    if (event.target.checked) {
      setUnSelectedPlayersTeamB((prevSelected) => [...prevSelected, playerId]);
    } else {
      setUnSelectedPlayersTeamB((prevSelected) =>
        prevSelected.filter((id) => id !== playerId)
      );
    }
  };
  const handleRemoveStartersB = async () => {
    if (unSelectedPlayersTeamB.length === 0) {
      return;
    }
    const removeStartersTeamB = unSelectedPlayersTeamB;
    const data = {
      removeStartersTeamB: removeStartersTeamB,
    };
    try {
      const response = await axiosInstance.patch(
        `/match/update/${match?._id}`,
        data
      );
      if (response) {
        console.log("Players removed from Starters Team B successfully");
        setUnSelectedPlayersTeamB([]);
        fetchUpdatedMatch(match?._id);
      }
    } catch (error) {
      console.error("Error updating object:", error);
    }
  };

  // Team B SUBSTITUTES
  const [selectedPlayersSubstitutesTeamB, setSelectedPlayersSubstitutesTeamB] =
    useState([]);

  const handleIsOptionEqualToValueBSubstitutes = (option, value) =>
    option._id === value._id;

  const handleAddSubstitutesB = async () => {
    if (selectedPlayersSubstitutesTeamB.length === 0) {
      return;
    }
    const addSubstitutesTeamB = selectedPlayersSubstitutesTeamB.map(
      (player) => player._id
    );

    const data = {
      addSubstitutesTeamB: addSubstitutesTeamB,
    };

    try {
      const response = await axiosInstance.patch(
        `/match/update/${match?._id}`,
        data
      );

      if (response) {
        console.log("Players added to Substitutes Team B successfully");
        setSelectedPlayersSubstitutesTeamB([]);
        fetchUpdatedMatch(match?._id);
      }
    } catch (error) {
      console.error("Error updating object:", error);
    }
  };

  const [
    unSelectedPlayersSubstitutesTeamB,
    setUnSelectedPlayersSubstitutesTeamB,
  ] = useState([]);

  const handleCheckboxChangeBSubstitutes = (event, playerId) => {
    if (event.target.checked) {
      setUnSelectedPlayersSubstitutesTeamB((prevSelected) => [
        ...prevSelected,
        playerId,
      ]);
    } else {
      setUnSelectedPlayersSubstitutesTeamB((prevSelected) =>
        prevSelected.filter((id) => id !== playerId)
      );
    }
  };

  const handleRemoveSubstitutesB = async () => {
    if (unSelectedPlayersSubstitutesTeamB.length === 0) {
      return;
    }

    const removeSubstitutesTeamB = unSelectedPlayersSubstitutesTeamB;

    const data = {
      removeSubstitutesTeamB: removeSubstitutesTeamB,
    };

    try {
      const response = await axiosInstance.patch(
        `/match/update/${match?._id}`,
        data
      );

      if (response) {
        console.log("Players removed from Substitutes Team B successfully");
        setUnSelectedPlayersSubstitutesTeamB([]);
        fetchUpdatedMatch(match?._id);
      }
    } catch (error) {
      console.error("Error updating object:", error);
    }
  };

  // Administrators Team A
  const [selectedAdministratorsTeamA, setSelectedAdministratorsTeamA] =
    useState([]);

  const [unSelectedAdministratorsTeamA, setUnSelectedAdministratorsTeamA] =
    useState([]);

  const handleIsOptionEqualToValueAAdministrators = (option, value) =>
    option._id === value._id;

  const handleAddAdministratorsA = async () => {
    // console.log(selectedAdministratorsTeamA);
    if (selectedAdministratorsTeamA.length === 0) {
      return;
    }
    const addAdministratorsTeamA = selectedAdministratorsTeamA.map(
      (administrator) => administrator._id
    );

    const data = {
      addAdministratorsTeamA: addAdministratorsTeamA,
    };

    try {
      const response = await axiosInstance.patch(
        `/match/update/${match?._id}`,
        data
      );

      if (response) {
        console.log("Administrators added to Team A successfully");
        setSelectedAdministratorsTeamA([]);
        fetchUpdatedMatch(match?._id);
      }
    } catch (error) {
      console.error("Error updating object:", error);
    }
  };

  const handleCheckboxChangeAdministratorsA = (event, administratorId) => {
    if (event.target.checked) {
      setUnSelectedAdministratorsTeamA((prevSelected) => [
        ...prevSelected,
        administratorId,
      ]);
    } else {
      setUnSelectedAdministratorsTeamA((prevSelected) =>
        prevSelected.filter((id) => id !== administratorId)
      );
    }
  };

  const handleRemoveAdministratorsA = async () => {
    // console.log(unSelectedAdministratorsTeamA);

    if (unSelectedAdministratorsTeamA.length === 0) {
      return;
    }

    const removeAdministratorsTeamA = unSelectedAdministratorsTeamA;

    const data = {
      removeAdministratorsTeamA: removeAdministratorsTeamA,
    };

    try {
      const response = await axiosInstance.patch(
        `/match/update/${match?._id}`,
        data
      );

      if (response) {
        console.log("Administrators removed from Team A successfully");
        setUnSelectedAdministratorsTeamA([]);
        fetchUpdatedMatch(match?._id);
      }
    } catch (error) {
      console.error("Error updating object:", error);
    }
  };

  // Administrators Team B
  const [selectedAdministratorsTeamB, setSelectedAdministratorsTeamB] =
    useState([]);

  const [unSelectedAdministratorsTeamB, setUnSelectedAdministratorsTeamB] =
    useState([]);

  const handleIsOptionEqualToValueBAdministrators = (option, value) =>
    option._id === value._id;

  const handleAddAdministratorsB = async () => {
    // console.log(selectedAdministratorsTeamA);
    if (selectedAdministratorsTeamB.length === 0) {
      return;
    }
    const addAdministratorsTeamB = selectedAdministratorsTeamB.map(
      (administrator) => administrator._id
    );

    const data = {
      addAdministratorsTeamB: addAdministratorsTeamB,
    };

    try {
      const response = await axiosInstance.patch(
        `/match/update/${match?._id}`,
        data
      );

      if (response) {
        console.log("Administrators added to Team B successfully");
        setSelectedAdministratorsTeamB([]);
        fetchUpdatedMatch(match?._id);
      }
    } catch (error) {
      console.error("Error updating object:", error);
    }
  };

  const handleCheckboxChangeAdministratorsB = (event, administratorId) => {
    if (event.target.checked) {
      setUnSelectedAdministratorsTeamB((prevSelected) => [
        ...prevSelected,
        administratorId,
      ]);
    } else {
      setUnSelectedAdministratorsTeamB((prevSelected) =>
        prevSelected.filter((id) => id !== administratorId)
      );
    }
  };

  const handleRemoveAdministratorsB = async () => {
    // console.log(unSelectedAdministratorsTeamA);

    if (unSelectedAdministratorsTeamB.length === 0) {
      return;
    }

    const removeAdministratorsTeamB = unSelectedAdministratorsTeamB;

    const data = {
      removeAdministratorsTeamB: removeAdministratorsTeamB,
    };

    try {
      const response = await axiosInstance.patch(
        `/match/update/${match?._id}`,
        data
      );

      if (response) {
        console.log("Administrators removed from Team B successfully");
        setUnSelectedAdministratorsTeamB([]);
        fetchUpdatedMatch(match?._id);
      }
    } catch (error) {
      console.error("Error updating object:", error);
    }
  };

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
                user?.userId === match?.watcher?._id ||
                user?.userId === match?.referee?._id ||
                user?._id === match?.watcher?._id ||
                user?._id === match?.referee?._id ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "10px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          columnGap: "10px",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          disabled={match?.reported}
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
                          disabled={match?.reported}
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
                          disabled={match?.reported}
                          onClick={() => handleEventClick("firstExtraTime")}
                          className={`${StyleSingleMatch.singleAction} ${
                            selectedEventType === "firstExtraTime"
                              ? StyleSingleMatch.selectedEvent
                              : ""
                          }`}
                        >
                          <img
                            src={`${process.env.REACT_APP_IMAGE_PATH}/firstExtraTime.png`}
                            alt="firstExtraTime"
                            className={StyleSingleMatch.iconActions}
                          />
                        </button>
                        <button
                          disabled={match?.reported}
                          onClick={() => handleEventClick("secondExtraTime")}
                          className={`${StyleSingleMatch.singleAction} ${
                            selectedEventType === "secondExtraTime"
                              ? StyleSingleMatch.selectedEvent
                              : ""
                          }`}
                        >
                          <img
                            src={`${process.env.REACT_APP_IMAGE_PATH}/secondExtraTime.png`}
                            alt="secondExtraTime"
                            className={StyleSingleMatch.iconActions}
                          />
                        </button>
                        <button
                          disabled={match?.reported}
                          onClick={() => handleEventClick("penalties")}
                          className={`${StyleSingleMatch.singleAction} ${
                            selectedEventType === "penalties"
                              ? StyleSingleMatch.selectedEvent
                              : ""
                          }`}
                        >
                          <img
                            src={`${process.env.REACT_APP_IMAGE_PATH}/penalties.png`}
                            alt="penalties"
                            className={StyleSingleMatch.iconActions}
                          />
                        </button>
                      </div>

                      {selectedEventType && (
                        <>
                          <button
                            disabled={match?.reported}
                            onClick={handleAddAction}
                            className={StyleSingleMatch.whistle}
                          >
                            Whistle
                            <img src={whistle} alt="whistle" />
                          </button>
                          <button
                            onClick={() => handleEventClick("")}
                            className={StyleSingleMatch.cancelWhistle}
                          >
                            Cancel
                          </button>
                        </>
                        // </div>
                      )}
                    </div>
                  </>
                ) : (
                  ""
                )}

                <div className={StyleSingleMatch.containerEvents}>
                  <div className={StyleSingleMatch.bothEvents}>
                    {user?.role === "admin" ||
                    user?.userId === match?.referee?._id ||
                    user?._id === match?.referee?._id ? (
                      <p className={StyleSingleMatch.titleEvent}>
                        {language === "en" ? "Watcher Events" : "أحداث المراقب"}
                      </p>
                    ) : (
                      ""
                    )}
                    {eventsWatcher?.length > 0 ? (
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
                            {language === "en"
                              ? "Match begins!"
                              : "بداية المباراة"}
                          </h1>
                          <div
                            style={{
                              width: "60px",
                              height: "2px",
                              backgroundColor: "green",
                            }}
                          ></div>
                        </div>

                        {eventsWatcher.map((event) => (
                          <>
                            {event.type === "HT" ? (
                              <div>
                                <section className={StyleSingleMatch.resultHT}>
                                  <p style={{ color: "white" }}>
                                    {match?.team_a?.scoreHTWatcher}
                                  </p>

                                  <h1
                                    style={{
                                      color: "red",
                                      textAlign: "center",
                                      fontSize: "clamp(15px , 4vw , 20px)",
                                    }}
                                  >
                                    {language === "en"
                                      ? "HT"
                                      : "نهاية الشوط الأول"}
                                  </h1>
                                  <p style={{ color: "white" }}>
                                    {match?.team_b?.scoreHTWatcher}
                                  </p>
                                </section>

                                {user?.role === "admin" ||
                                user?.userId === match?.watcher?._id ||
                                user?._id === match?.watcher?._id ? (
                                  <div
                                    className={StyleSingleMatch.eventActions}
                                  >
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleOpenDelete(event._id)
                                      }
                                      className={StyleSingleMatch.delete}
                                      disabled={match?.reported}
                                    >
                                      <img src={EventDelete} alt="" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEdit(event)}
                                      // style={{ border: "none" }}
                                      className={StyleSingleMatch.edit}
                                      disabled={match?.reported}
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
                                user?.userId === match?.watcher?._id ||
                                user?._id === match?.watcher?._id ? (
                                  <div
                                    className={StyleSingleMatch.eventActions}
                                  >
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleOpenDelete(event._id)
                                      }
                                      className={StyleSingleMatch.delete}
                                      disabled={match?.reported}
                                    >
                                      <img src={EventDelete} alt="" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEdit(event)}
                                      // style={{ border: "none" }}
                                      className={StyleSingleMatch.edit}
                                      disabled={match?.reported}
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
                                user?.userId === match?.watcher?._id ||
                                user?._id === match?.watcher?._id ? (
                                  <div
                                    className={StyleSingleMatch.eventActions}
                                  >
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleOpenDelete(event._id)
                                      }
                                      className={StyleSingleMatch.delete}
                                      disabled={match?.reported}
                                    >
                                      <img src={EventDelete} alt="" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEdit(event)}
                                      // style={{ border: "none" }}
                                      className={StyleSingleMatch.edit}
                                      disabled={match?.reported}
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
                                user?.userId === match?.watcher?._id ||
                                user?._id === match?.watcher?._id ? (
                                  <div
                                    className={StyleSingleMatch.eventActions}
                                  >
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleOpenDelete(event._id)
                                      }
                                      className={StyleSingleMatch.delete}
                                      disabled={match?.reported}
                                    >
                                      <img src={EventDelete} alt="" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEdit(event)}
                                      className={StyleSingleMatch.edit}
                                      disabled={match?.reported}
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
                                  user?.userId === match?.watcher?._id ||
                                  user?._id === match?.watcher?._id ? (
                                    <div
                                      className={StyleSingleMatch.eventActions}
                                    >
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleOpenDelete(event._id)
                                        }
                                        className={StyleSingleMatch.delete}
                                        disabled={match?.reported}
                                      >
                                        <img src={EventDelete} alt="" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleOpenEdit(event)}
                                        // style={{ border: "none" }}
                                        className={StyleSingleMatch.edit}
                                        disabled={match?.reported}
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
                                  event?.team?._id === match?.team_b?.team?._id
                                    ? StyleSingleMatch.flexStart
                                    : StyleSingleMatch.flexEnd
                                }`}
                              >
                                <div
                                  className={`${StyleSingleMatch.type} ${
                                    event?.team?._id ===
                                    match?.team_b?.team?._id
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
                                      className={
                                        StyleSingleMatch.iconSubstitution
                                      }
                                    />
                                  )}

                                  {event.type === "substitution" ? (
                                    <div
                                      className={StyleSingleMatch.substitution}
                                    >
                                      <div
                                        className={
                                          event?.team?._id ===
                                          match?.team_a?.team?._id
                                            ? StyleSingleMatch.singleEvent
                                            : StyleSingleMatch.singleEventB
                                        }
                                      >
                                        <img
                                          src={`${process.env.REACT_APP_IMAGE_PATH}/${event?.playerIn?.image}`}
                                          alt={event?.playerIn?.name}
                                          className={
                                            StyleSingleMatch.playerIdImage
                                          }
                                        />
                                        <p
                                          className={
                                            StyleSingleMatch.scorePlayer
                                          }
                                        >
                                          {event?.playerIn?.name}
                                        </p>
                                      </div>
                                      <div
                                        className={
                                          event?.team?._id ===
                                          match?.team_a?.team?._id
                                            ? StyleSingleMatch.singleEvent
                                            : StyleSingleMatch.singleEventB
                                        }
                                      >
                                        <img
                                          src={`${process.env.REACT_APP_IMAGE_PATH}/${event?.playerOut?.image}`}
                                          alt={event?.playerOut?.name}
                                          className={
                                            StyleSingleMatch.playerIdImage
                                          }
                                        />
                                        <p className={StyleSingleMatch.out}>
                                          {event?.playerOut?.name}
                                        </p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      className={
                                        event?.team?._id ===
                                        match?.team_a?.team?._id
                                          ? StyleSingleMatch.singleEvent
                                          : StyleSingleMatch.singleEventB
                                      }
                                    >
                                      <img
                                        src={`${process.env.REACT_APP_IMAGE_PATH}/${event?.playerIn?.image}`}
                                        alt={event?.playerIn?.name}
                                        className={
                                          StyleSingleMatch.playerIdImage
                                        }
                                      />
                                      <p
                                        className={StyleSingleMatch.scorePlayer}
                                      >
                                        {event?.playerIn?.name}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {user?.role === "admin" ||
                                user?.userId === match?.watcher?._id ||
                                user?._id === match?.watcher?._id ? (
                                  <div
                                    className={StyleSingleMatch.eventActions}
                                  >
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleOpenDelete(event._id)
                                      }
                                      className={StyleSingleMatch.delete}
                                      disabled={match?.reported}
                                    >
                                      <img src={EventDelete} alt="" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEdit(event)}
                                      // style={{ border: "none" }}
                                      className={StyleSingleMatch.edit}
                                      disabled={match?.reported}
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
                      {match?.playedWatcher === true ? (
                        <div
                          style={{
                            display: "flex",
                            columnGap: "10%",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "20px",
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
                  </div>

                  {user?.role === "admin" ||
                  user?.userId === match?.referee?._id ||
                  user?._id === match?.referee?._id ? (
                    <div className={StyleSingleMatch.bothEvents}>
                      {user?.role === "admin" ||
                      user?.userId === match?.referee?._id ||
                      user?._id === match?.referee?._id ? (
                        <p className={StyleSingleMatch.titleEvent}>
                          {language === "en" ? "Referee Events" : "أحداث الحكم"}
                        </p>
                      ) : (
                        ""
                      )}
                      {eventsReferee?.length > 0 ? (
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
                              {language === "en"
                                ? "Match begins!"
                                : "بداية المباراة"}
                            </h1>
                            <div
                              style={{
                                width: "60px",
                                height: "2px",
                                backgroundColor: "green",
                              }}
                            ></div>
                          </div>

                          {eventsReferee.map((event) => (
                            <>
                              {event.type === "HT" ? (
                                <div>
                                  <section
                                    className={StyleSingleMatch.resultHT}
                                  >
                                    <p style={{ color: "white" }}>
                                      {match?.team_a?.scoreHTWatcher}
                                    </p>

                                    <h1
                                      style={{
                                        color: "red",
                                        textAlign: "center",
                                        fontSize: "clamp(15px , 4vw , 20px)",
                                      }}
                                    >
                                      {language === "en"
                                        ? "HT"
                                        : "نهاية الشوط الأول"}
                                    </h1>
                                    <p style={{ color: "white" }}>
                                      {match?.team_b?.scoreHTWatcher}
                                    </p>
                                  </section>

                                  {user?.role === "admin" ||
                                  user?.userId === match?.referee?._id ||
                                  user?._id === match?.referee?._id ? (
                                    <div
                                      className={StyleSingleMatch.eventActions}
                                    >
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleOpenDelete(event._id)
                                        }
                                        className={StyleSingleMatch.delete}
                                        disabled={match?.reported}
                                      >
                                        <img src={EventDelete} alt="" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleOpenEdit(event)}
                                        // style={{ border: "none" }}
                                        className={StyleSingleMatch.edit}
                                        disabled={match?.reported}
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
                                  user?.userId === match?.referee?._id ||
                                  user?._id === match?.referee?._id ? (
                                    <div
                                      className={StyleSingleMatch.eventActions}
                                    >
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleOpenDelete(event._id)
                                        }
                                        className={StyleSingleMatch.delete}
                                        disabled={match?.reported}
                                      >
                                        <img src={EventDelete} alt="" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleOpenEdit(event)}
                                        // style={{ border: "none" }}
                                        className={StyleSingleMatch.edit}
                                        disabled={match?.reported}
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
                                  user?.userId === match?.referee?._id ||
                                  user?._id === match?.referee?._id ? (
                                    <div
                                      className={StyleSingleMatch.eventActions}
                                    >
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleOpenDelete(event._id)
                                        }
                                        className={StyleSingleMatch.delete}
                                        disabled={match?.reported}
                                      >
                                        <img src={EventDelete} alt="" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleOpenEdit(event)}
                                        // style={{ border: "none" }}
                                        className={StyleSingleMatch.edit}
                                        disabled={match?.reported}
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
                                  user?.userId === match?.referee?._id ||
                                  user?._id === match?.referee?._id ? (
                                    <div
                                      className={StyleSingleMatch.eventActions}
                                    >
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleOpenDelete(event._id)
                                        }
                                        className={StyleSingleMatch.delete}
                                        disabled={match?.reported}
                                      >
                                        <img src={EventDelete} alt="" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleOpenEdit(event)}
                                        className={StyleSingleMatch.edit}
                                        disabled={match?.reported}
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
                                    user?.userId === match?.referee?._id ||
                                    user?._id === match?.referee?._id ? (
                                      <div
                                        className={
                                          StyleSingleMatch.eventActions
                                        }
                                      >
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleOpenDelete(event._id)
                                          }
                                          className={StyleSingleMatch.delete}
                                          disabled={match?.reported}
                                        >
                                          <img src={EventDelete} alt="" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleOpenEdit(event)}
                                          // style={{ border: "none" }}
                                          className={StyleSingleMatch.edit}
                                          disabled={match?.reported}
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
                                    event?.team?._id ===
                                    match?.team_b?.team?._id
                                      ? StyleSingleMatch.flexStart
                                      : StyleSingleMatch.flexEnd
                                  }`}
                                >
                                  <div
                                    className={`${StyleSingleMatch.type} ${
                                      event?.team?._id ===
                                      match?.team_b?.team?._id
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
                                        className={
                                          StyleSingleMatch.iconSubstitution
                                        }
                                      />
                                    )}

                                    {event.type === "substitution" ? (
                                      <div
                                        className={
                                          StyleSingleMatch.substitution
                                        }
                                      >
                                        <div
                                          className={
                                            event?.team?._id ===
                                            match?.team_a?.team?._id
                                              ? StyleSingleMatch.singleEvent
                                              : StyleSingleMatch.singleEventB
                                          }
                                        >
                                          <img
                                            src={`${process.env.REACT_APP_IMAGE_PATH}/${event?.playerIn?.image}`}
                                            alt={event?.playerIn?.name}
                                            className={
                                              StyleSingleMatch.playerIdImage
                                            }
                                          />
                                          <p
                                            className={
                                              StyleSingleMatch.scorePlayer
                                            }
                                          >
                                            {event?.playerIn?.name}
                                          </p>
                                        </div>

                                        <div
                                          className={
                                            event?.team?._id ===
                                            match?.team_a?.team?._id
                                              ? StyleSingleMatch.singleEvent
                                              : StyleSingleMatch.singleEventB
                                          }
                                        >
                                          <img
                                            src={`${process.env.REACT_APP_IMAGE_PATH}/${event?.playerOut?.image}`}
                                            alt={event?.playerOut?.name}
                                            className={
                                              StyleSingleMatch.playerIdImage
                                            }
                                          />
                                          <p className={StyleSingleMatch.out}>
                                            {event?.playerOut?.name}
                                          </p>
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        className={
                                          event?.team?._id ===
                                          match?.team_a?.team?._id
                                            ? StyleSingleMatch.singleEvent
                                            : StyleSingleMatch.singleEventB
                                        }
                                      >
                                        <img
                                          src={`${process.env.REACT_APP_IMAGE_PATH}/${event?.playerIn?.image}`}
                                          alt={event?.playerIn?.name}
                                          className={
                                            StyleSingleMatch.playerIdImage
                                          }
                                        />
                                        <p
                                          className={
                                            StyleSingleMatch.scorePlayer
                                          }
                                        >
                                          {event?.playerIn?.name}
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {user?.role === "admin" ||
                                  user?.userId === match?.referee?._id ||
                                  user?._id === match?.referee?._id ? (
                                    <div
                                      className={StyleSingleMatch.eventActions}
                                    >
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleOpenDelete(event._id)
                                        }
                                        className={StyleSingleMatch.delete}
                                        disabled={match?.reported}
                                      >
                                        <img src={EventDelete} alt="" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleOpenEdit(event)}
                                        // style={{ border: "none" }}
                                        className={StyleSingleMatch.edit}
                                        disabled={match?.reported}
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
                        {match?.playedReferee === true ? (
                          <div
                            style={{
                              display: "flex",
                              columnGap: "10%",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: "20px",
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
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                {/* <div>
                  {match?.played === true ? (
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
                </div> */}

                {user?.role === "admin" ||
                user?.userId === match?.watcher?._id ||
                user?.userId === match?.referee?._id ||
                user?._id === match?.watcher?._id ||
                user?._id === match?.referee?._id ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      // columnGap: "20px",
                      rowGap: "20px",
                      // marginTop: "20px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleOpenEndMatch}
                      className={StyleSingleMatch.endMatch}
                      disabled={match?.reported}
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
          {/* Team A */}
          {/* <h1>messi</h1> */}
          <div className={StyleSingleMatch.containerTeamA}>
            <div className={StyleSingleMatch.starterTeamA}>
              <div className={StyleSingleMatch.imageDiv}>
                <img
                  src={`${process.env.REACT_APP_IMAGE_PATH}/${match?.team_a?.team?.image}`}
                  alt={match?.team_a?.team?.name}
                  className={StyleSingleMatch.starterImage}
                />
              </div>
              <p className={StyleSingleMatch.starters}>
                {language === "en" ? "STARTERS" : "التشكيلة الأساسية"}
              </p>
              <div className={StyleSingleMatch.playersContainer}>
                {match?.startersTeamA?.map((player) => (
                  <div className={StyleSingleMatch.singlePlayer}>
                    <div
                      key={player?._id}
                      className={StyleSingleMatch.imageDivPlayer}
                    >
                      {user?.role === "admin" ||
                      user?.userId === match.watcher._id ||
                      user?._id === match.watcher._id ? (
                        <Checkbox
                          checked={unSelectedPlayersTeamA.includes(player._id)}
                          onChange={(event) =>
                            handleCheckboxChangeA(event, player._id)
                          }
                          inputProps={{ "aria-label": player.name }}
                        />
                      ) : (
                        ""
                      )}

                      {!player.image ? (
                        <img
                          src={`${process.env.REACT_APP_IMAGE_PATH}/default.jpeg`}
                          alt={player?.name}
                          className={StyleSingleMatch.customImagePlayer}
                        />
                      ) : (
                        <img
                          src={`${process.env.REACT_APP_IMAGE_PATH}/${player?.image}`}
                          alt={player?.name}
                          className={StyleSingleMatch.customImagePlayer}
                        />
                      )}
                    </div>

                    <div className={StyleSingleMatch.nameNumber}>
                      <p>{player?.tShirtNumber}</p>
                      <p>{player?.name}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                {user?.role === "admin" ||
                user?.userId === match?.watcher?._id ||
                user?._id === match?.watcher?._id ? (
                  <div style={{ margin: "10px 3px" }}>
                    {unSelectedPlayersTeamA.length > 0 ? (
                      <button
                        disabled={match?.reported}
                        onClick={handleRemoveStartersA}
                        type="button"
                        className={StyleSingleMatch.addEvent}
                      >
                        {language === "en" ? "Remove" : "حذف"}
                      </button>
                    ) : (
                      <>
                        <Autocomplete
                          multiple
                          id="checkboxes-tags-demo"
                          options={match?.team_a?.team?.players || []}
                          disableCloseOnSelect
                          getOptionLabel={(option) => option.name}
                          isOptionEqualToValue={handleIsOptionEqualToValueA}
                          value={selectedPlayersTeamA}
                          renderOption={(props, option, { selected }) => {
                            return (
                              <li {...props}>
                                <Checkbox
                                  icon={icon}
                                  checkedIcon={checkedIcon}
                                  style={{ marginRight: 1 }}
                                  checked={selected}
                                />
                                {!option?.image ? (
                                  <img
                                    src={`${process.env.REACT_APP_IMAGE_PATH}/default.jpeg`}
                                    alt={option?.name}
                                    className={
                                      StyleSingleMatch.customImagePlayer
                                    }
                                  />
                                ) : (
                                  <img
                                    src={`${process.env.REACT_APP_IMAGE_PATH}/${option?.image}`}
                                    alt={option?.name}
                                    className={
                                      StyleSingleMatch.customImagePlayer
                                    }
                                  />
                                )}
                                {option?.name} {option?.tShirtNumber}
                              </li>
                            );
                          }}
                          // style={{ width: 400 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Starters Players"
                              placeholder="Starters"
                            />
                          )}
                          onChange={(event, value) =>
                            setSelectedPlayersTeamA(value)
                          }
                        />
                        <button
                          disabled={match?.reported}
                          onClick={handleAddStartersA}
                          type="button"
                          className={StyleSingleMatch.addEvent}
                        >
                          {language === "en" ? "Add" : "اضافة"}
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            {/* Team A substitutes */}
            <div className={StyleSingleMatch.starterTeamA}>
              <div className={StyleSingleMatch.imageDiv}>
                <img
                  src={`${process.env.REACT_APP_IMAGE_PATH}/${match?.team_a?.team?.image}`}
                  alt={match?.team_a?.team?.name}
                  className={StyleSingleMatch.starterImage}
                />
              </div>
              <p className={StyleSingleMatch.starters}>
                {language === "en" ? "SUBSTITUTES" : "دكة البدلاء"}
              </p>
              <div className={StyleSingleMatch.playersContainer}>
                {match?.substitutesTeamA?.map((player) => (
                  <div className={StyleSingleMatch.singlePlayer}>
                    <div
                      key={player?._id}
                      className={StyleSingleMatch.imageDivPlayer}
                    >
                      {user?.role === "admin" ||
                      user?.userId === match.watcher._id ||
                      user?._id === match.watcher._id ? (
                        <Checkbox
                          checked={unSelectedPlayersSubstitutesTeamA.includes(
                            player._id
                          )}
                          onChange={(event) =>
                            handleCheckboxChangeASubstitutes(event, player._id)
                          }
                          inputProps={{ "aria-label": player.name }}
                        />
                      ) : (
                        ""
                      )}

                      {!player.image ? (
                        <img
                          src={`${process.env.REACT_APP_IMAGE_PATH}/default.jpeg`}
                          alt={player?.name}
                          className={StyleSingleMatch.customImagePlayer}
                        />
                      ) : (
                        <img
                          src={`${process.env.REACT_APP_IMAGE_PATH}/${player?.image}`}
                          alt={player?.name}
                          className={StyleSingleMatch.customImagePlayer}
                        />
                      )}
                    </div>

                    <div className={StyleSingleMatch.nameNumber}>
                      <p>{player?.tShirtNumber}</p>
                      <p>{player?.name}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                {user?.role === "admin" ||
                user?.userId === match?.watcher?._id ||
                user?._id === match?.watcher?._id ? (
                  <div style={{ margin: "10px 3px" }}>
                    {unSelectedPlayersSubstitutesTeamA.length > 0 ? (
                      <button
                        disabled={match?.reported}
                        onClick={handleRemoveSubstitutesA}
                        type="button"
                        className={StyleSingleMatch.addEvent}
                      >
                        {language === "en" ? "Remove" : "حذف"}
                      </button>
                    ) : (
                      <>
                        <Autocomplete
                          multiple
                          id="checkboxes-tags-demo"
                          options={match?.team_a?.team?.players || []}
                          disableCloseOnSelect
                          getOptionLabel={(option) => option.name}
                          isOptionEqualToValue={
                            handleIsOptionEqualToValueASubstitutes
                          }
                          value={selectedPlayersSubstitutesTeamA}
                          renderOption={(props, option, { selected }) => {
                            return (
                              <li {...props}>
                                <Checkbox
                                  icon={icon}
                                  checkedIcon={checkedIcon}
                                  style={{ marginRight: 1 }}
                                  checked={selected}
                                />
                                {!option?.image ? (
                                  <img
                                    src={`${process.env.REACT_APP_IMAGE_PATH}/default.jpeg`}
                                    alt={option?.name}
                                    className={
                                      StyleSingleMatch.customImagePlayer
                                    }
                                  />
                                ) : (
                                  <img
                                    src={`${process.env.REACT_APP_IMAGE_PATH}/${option?.image}`}
                                    alt={option?.name}
                                    className={
                                      StyleSingleMatch.customImagePlayer
                                    }
                                  />
                                )}
                                {option?.name} {option?.tShirtNumber}
                              </li>
                            );
                          }}
                          // style={{ width: 400 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Substitutes Players"
                              placeholder="Substitutes"
                            />
                          )}
                          onChange={(event, value) =>
                            setSelectedPlayersSubstitutesTeamA(value)
                          }
                        />
                        <button
                          disabled={match?.reported}
                          onClick={handleAddSubstitutesA}
                          type="button"
                          className={StyleSingleMatch.addEvent}
                        >
                          {language === "en" ? "Add" : "اضافة"}
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          {/* Team B */}
          {/* <h1>ramos</h1> */}
          <div className={StyleSingleMatch.containerTeamA}>
            <div className={StyleSingleMatch.starterTeamA}>
              <div className={StyleSingleMatch.imageDiv}>
                <img
                  src={`${process.env.REACT_APP_IMAGE_PATH}/${match?.team_b?.team?.image}`}
                  alt={match?.team_b?.team?.name}
                  className={StyleSingleMatch.starterImage}
                />
              </div>
              <p className={StyleSingleMatch.starters}>
                {language === "en" ? "STARTERS" : "التشكيلة الأساسية"}
              </p>
              <div className={StyleSingleMatch.playersContainer}>
                {match?.startersTeamB?.map((player) => (
                  <div className={StyleSingleMatch.singlePlayer}>
                    <div
                      key={player?._id}
                      className={StyleSingleMatch.imageDivPlayer}
                    >
                      {user?.role === "admin" ||
                      user?.userId === match.watcher._id ||
                      user?._id === match.watcher._id ? (
                        <Checkbox
                          checked={unSelectedPlayersTeamB.includes(player._id)}
                          onChange={(event) =>
                            handleCheckboxChangeB(event, player._id)
                          }
                          inputProps={{ "aria-label": player.name }}
                        />
                      ) : (
                        ""
                      )}

                      {!player.image ? (
                        <img
                          src={`${process.env.REACT_APP_IMAGE_PATH}/default.jpeg`}
                          alt={player?.name}
                          className={StyleSingleMatch.customImagePlayer}
                        />
                      ) : (
                        <img
                          src={`${process.env.REACT_APP_IMAGE_PATH}/${player?.image}`}
                          alt={player?.name}
                          className={StyleSingleMatch.customImagePlayer}
                        />
                      )}
                    </div>

                    <div className={StyleSingleMatch.nameNumber}>
                      <p>{player?.tShirtNumber}</p>
                      <p>{player?.name}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                {user?.role === "admin" ||
                user?.userId === match?.watcher?._id ||
                user?._id === match?.watcher?._id ? (
                  <div style={{ margin: "10px 3px" }}>
                    {/* <h1>ronaldo</h1> */}

                    {unSelectedPlayersTeamB.length > 0 ? (
                      <button
                        disabled={match?.reported}
                        onClick={handleRemoveStartersB}
                        type="button"
                        className={StyleSingleMatch.addEvent}
                      >
                        {language === "en" ? "Remove" : "حذف"}
                      </button>
                    ) : (
                      <>
                        <Autocomplete
                          multiple
                          id="checkboxes-tags-demo"
                          options={match?.team_b?.team?.players || []}
                          disableCloseOnSelect
                          getOptionLabel={(option) => option.name}
                          isOptionEqualToValue={handleIsOptionEqualToValueB}
                          value={selectedPlayersTeamB}
                          renderOption={(props, option, { selected }) => {
                            return (
                              <li {...props}>
                                <Checkbox
                                  icon={icon}
                                  checkedIcon={checkedIcon}
                                  style={{ marginRight: 1 }}
                                  checked={selected}
                                />
                                {!option?.image ? (
                                  <img
                                    src={`${process.env.REACT_APP_IMAGE_PATH}/default.jpeg`}
                                    alt={option?.name}
                                    className={
                                      StyleSingleMatch.customImagePlayer
                                    }
                                  />
                                ) : (
                                  <img
                                    src={`${process.env.REACT_APP_IMAGE_PATH}/${option?.image}`}
                                    alt={option?.name}
                                    className={
                                      StyleSingleMatch.customImagePlayer
                                    }
                                  />
                                )}
                                {option?.name} {option?.tShirtNumber}
                              </li>
                            );
                          }}
                          // style={{ width: 400 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Starters Players"
                              placeholder="Starters"
                            />
                          )}
                          onChange={(event, value) =>
                            setSelectedPlayersTeamB(value)
                          }
                        />
                        <button
                          disabled={match?.reported}
                          onClick={handleAddStartersB}
                          type="button"
                          className={StyleSingleMatch.addEvent}
                        >
                          {language === "en" ? "Add" : "اضافة"}
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            {/* Team B substitutes */}
            <div className={StyleSingleMatch.starterTeamA}>
              <div className={StyleSingleMatch.imageDiv}>
                <img
                  src={`${process.env.REACT_APP_IMAGE_PATH}/${match?.team_b?.team?.image}`}
                  alt={match?.team_b?.team?.name}
                  className={StyleSingleMatch.starterImage}
                />
              </div>
              <p className={StyleSingleMatch.starters}>
                {language === "en" ? "SUBSTITUTES" : "دكة البدلاء"}
              </p>
              <div className={StyleSingleMatch.playersContainer}>
                {match?.substitutesTeamB?.map((player) => (
                  <div className={StyleSingleMatch.singlePlayer}>
                    <div
                      key={player?._id}
                      className={StyleSingleMatch.imageDivPlayer}
                    >
                      {user?.role === "admin" ||
                      user?.userId === match.watcher._id ||
                      user?._id === match.watcher._id ? (
                        <Checkbox
                          checked={unSelectedPlayersSubstitutesTeamB.includes(
                            player._id
                          )}
                          onChange={(event) =>
                            handleCheckboxChangeBSubstitutes(event, player._id)
                          }
                          inputProps={{ "aria-label": player.name }}
                        />
                      ) : (
                        ""
                      )}

                      {!player.image ? (
                        <img
                          src={`${process.env.REACT_APP_IMAGE_PATH}/default.jpeg`}
                          alt={player?.name}
                          className={StyleSingleMatch.customImagePlayer}
                        />
                      ) : (
                        <img
                          src={`${process.env.REACT_APP_IMAGE_PATH}/${player?.image}`}
                          alt={player?.name}
                          className={StyleSingleMatch.customImagePlayer}
                        />
                      )}
                    </div>

                    <div className={StyleSingleMatch.nameNumber}>
                      <p>{player?.tShirtNumber}</p>
                      <p>{player?.name}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                {user?.role === "admin" ||
                user?.userId === match?.watcher?._id ||
                user?._id === match?.watcher?._id ? (
                  <div style={{ margin: "10px 3px" }}>
                    {/* <h1>ronaldo</h1> */}

                    {unSelectedPlayersSubstitutesTeamB.length > 0 ? (
                      <button
                        disabled={match?.reported}
                        onClick={handleRemoveSubstitutesB}
                        type="button"
                        className={StyleSingleMatch.addEvent}
                      >
                        {language === "en" ? "Remove" : "حذف"}
                      </button>
                    ) : (
                      <>
                        <Autocomplete
                          multiple
                          id="checkboxes-tags-demo"
                          options={match?.team_b?.team?.players || []}
                          disableCloseOnSelect
                          getOptionLabel={(option) => option.name}
                          isOptionEqualToValue={
                            handleIsOptionEqualToValueBSubstitutes
                          }
                          value={selectedPlayersSubstitutesTeamB}
                          renderOption={(props, option, { selected }) => {
                            return (
                              <li {...props}>
                                <Checkbox
                                  icon={icon}
                                  checkedIcon={checkedIcon}
                                  style={{ marginRight: 1 }}
                                  checked={selected}
                                />
                                {!option?.image ? (
                                  <img
                                    src={`${process.env.REACT_APP_IMAGE_PATH}/default.jpeg`}
                                    alt={option?.name}
                                    className={
                                      StyleSingleMatch.customImagePlayer
                                    }
                                  />
                                ) : (
                                  <img
                                    src={`${process.env.REACT_APP_IMAGE_PATH}/${option?.image}`}
                                    alt={option?.name}
                                    className={
                                      StyleSingleMatch.customImagePlayer
                                    }
                                  />
                                )}
                                {option?.name} {option?.tShirtNumber}
                              </li>
                            );
                          }}
                          // style={{ width: 400 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Substitutes Players"
                              placeholder="Substitutes"
                            />
                          )}
                          onChange={(event, value) =>
                            setSelectedPlayersSubstitutesTeamB(value)
                          }
                        />
                        <button
                          disabled={match?.reported}
                          onClick={handleAddSubstitutesB}
                          type="button"
                          className={StyleSingleMatch.addEvent}
                        >
                          {language === "en" ? "Add" : "اضافة"}
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
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
            user?.userId === match?.watcher?._id ||
            user?._id === match?.watcher?._id ? (
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
                    {match?.reported === true ? (
                      <p className={StyleSingleMatch.reported}>
                        {language === "en"
                          ? "Not Allowed To Update this Report anymore!"
                          : "لم يعد بإمكانك تعديل هذا التقرير بعد الآن"}
                      </p>
                    ) : (
                      ""
                    )}
                    {match?.reported !== true ? (
                      actionWatcher === "Edit" ? (
                        ""
                      ) : (
                        <Fab
                          onClick={() =>
                            handleActionChange({ target: { value: "Edit" } })
                          }
                          aria-label="edit"
                          className={StyleSingleMatch.fabGradient}
                          style={{
                            color: "white",
                            width: "40px",
                            height: "40px",
                          }}
                        >
                          <EditIcon />
                        </Fab>
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
                          <Button
                            disabled={match?.reported}
                            type="button"
                            onClick={handleBackWatcher}
                            className={StyleSingleMatch.back}
                            variant="outlined"
                            style={{
                              color: "var(--primary-clr)",
                              border: "1px solid var(--primary-clr)",
                            }}
                          >
                            {language === "en" ? "Back" : "العودة"}
                          </Button>
                          <Button
                            disabled={match?.reported}
                            type="button"
                            onClick={handleUpdateWatcherReport}
                            className={StyleSingleMatch.post}
                            variant="contained"
                            endIcon={<SendIcon />}
                          >
                            {language === "en" ? "Send" : "أرسل"}
                          </Button>
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
            user?.userId === match?.referee?._id ||
            user?._id === match?.referee?._id ? (
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
                    {match?.reported === true ? (
                      <p className={StyleSingleMatch.reported}>
                        {language === "en"
                          ? "Not Allowed To Update this Report anymore!"
                          : "لم يعد بإمكانك تعديل هذا التقرير بعد الآن"}
                      </p>
                    ) : (
                      ""
                    )}
                    {match?.reported !== true ? (
                      actionReferee === "Edit" ? (
                        ""
                      ) : (
                        <Fab
                          onClick={() =>
                            handleActionChangeReferee({
                              target: { value: "Edit" },
                            })
                          }
                          aria-label="edit"
                          className={StyleSingleMatch.fabGradient}
                          style={{
                            color: "white",
                            width: "40px",
                            height: "40px",
                          }}
                        >
                          <EditIcon />
                        </Fab>
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
                        <Button
                          disabled={match?.reported}
                          type="button"
                          onClick={handleBackReferee}
                          className={StyleSingleMatch.back}
                          variant="outlined"
                          style={{
                            color: "var(--primary-clr)",
                            border: "1px solid var(--primary-clr)",
                          }}
                        >
                          {language === "en" ? "Back" : "العودة"}
                        </Button>
                        <Button
                          disabled={match?.reported}
                          type="button"
                          onClick={handleUpdateRefereeReport}
                          className={StyleSingleMatch.post}
                          variant="contained"
                          endIcon={<SendIcon />}
                        >
                          {language === "en" ? "Send" : "أرسل"}
                        </Button>
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
      title: "administrator",
      id: "administrator",
      content: (
        <div className={StyleSingleMatch.administratorContainer}>
          {/* Administrators Team A */}
          <div className={StyleSingleMatch.containerTeamA}>
            <div className={StyleSingleMatch.starterTeamA}>
              <div className={StyleSingleMatch.imageDiv}>
                <img
                  src={`${process.env.REACT_APP_IMAGE_PATH}/${match?.team_a?.team?.image}`}
                  alt={match?.team_a?.team?.name}
                  className={StyleSingleMatch.starterImage}
                />
              </div>
              <p className={StyleSingleMatch.starters}>
                {language === "en" ? "ADMINISTRATORS" : "الإداريين"}
              </p>
              <div className={StyleSingleMatch.playersContainer}>
                {match?.administratorsTeamA?.map((administrator) => (
                  <div className={StyleSingleMatch.singlePlayer}>
                    <div
                      key={administrator?._id}
                      className={StyleSingleMatch.imageDivPlayer}
                    >
                      {user?.role === "admin" ||
                      user?.userId === match.watcher._id ||
                      user?._id === match.watcher._id ? (
                        <Checkbox
                          checked={unSelectedAdministratorsTeamA.includes(
                            administrator._id
                          )}
                          onChange={(event) =>
                            handleCheckboxChangeAdministratorsA(
                              event,
                              administrator._id
                            )
                          }
                          inputProps={{ "aria-label": administrator.name }}
                        />
                      ) : (
                        ""
                      )}

                      {!administrator.image ? (
                        <img
                          src={`${process.env.REACT_APP_IMAGE_PATH}/default.jpeg`}
                          alt={administrator?.name}
                          className={StyleSingleMatch.customImagePlayer}
                        />
                      ) : (
                        <img
                          src={`${process.env.REACT_APP_IMAGE_PATH}/${administrator?.image}`}
                          alt={administrator?.name}
                          className={StyleSingleMatch.customImagePlayer}
                        />
                      )}
                    </div>

                    <div className={StyleSingleMatch.characteristic}>
                      <p>
                        {administrator?.name} ({administrator?.characteristic})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                {/* <h1>Griz</h1> */}
                {user?.role === "admin" ||
                user?.userId === match?.watcher?._id ||
                user?._id === match?.watcher?._id ? (
                  <div style={{ margin: "10px 3px" }}>
                    {unSelectedAdministratorsTeamA.length > 0 ? (
                      <button
                        disabled={match?.reported}
                        onClick={handleRemoveAdministratorsA}
                        type="button"
                        className={StyleSingleMatch.addEvent}
                      >
                        {language === "en" ? "Remove" : "حذف"}
                      </button>
                    ) : (
                      <>
                        <Autocomplete
                          multiple
                          id="checkboxes-tags-demo"
                          options={match?.team_a?.team?.administrators || []}
                          disableCloseOnSelect
                          getOptionLabel={(option) => option.name}
                          isOptionEqualToValue={
                            handleIsOptionEqualToValueAAdministrators
                          }
                          value={selectedAdministratorsTeamA}
                          renderOption={(props, option, { selected }) => {
                            return (
                              <li {...props}>
                                <Checkbox
                                  icon={icon}
                                  checkedIcon={checkedIcon}
                                  style={{ marginRight: 1 }}
                                  checked={selected}
                                />
                                {!option?.image ? (
                                  <img
                                    src={`${process.env.REACT_APP_IMAGE_PATH}/default.jpeg`}
                                    alt={option?.name}
                                    className={
                                      StyleSingleMatch.customImagePlayer
                                    }
                                  />
                                ) : (
                                  <img
                                    src={`${process.env.REACT_APP_IMAGE_PATH}/${option?.image}`}
                                    alt={option?.name}
                                    className={
                                      StyleSingleMatch.customImagePlayer
                                    }
                                  />
                                )}
                                {option?.name} {option?.tShirtNumber}
                              </li>
                            );
                          }}
                          // style={{ width: 400 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Administrators"
                              placeholder="Administrators"
                            />
                          )}
                          onChange={(event, value) =>
                            setSelectedAdministratorsTeamA(value)
                          }
                        />
                        <button
                          disabled={match?.reported}
                          onClick={handleAddAdministratorsA}
                          type="button"
                          className={StyleSingleMatch.addEvent}
                        >
                          {language === "en" ? "Add" : "اضافة"}
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>

          {/* Administrators Team B */}

          <div className={StyleSingleMatch.containerTeamA}>
            <div className={StyleSingleMatch.starterTeamA}>
              <div className={StyleSingleMatch.imageDiv}>
                <img
                  src={`${process.env.REACT_APP_IMAGE_PATH}/${match?.team_b?.team?.image}`}
                  alt={match?.team_b?.team?.name}
                  className={StyleSingleMatch.starterImage}
                />
              </div>
              <p className={StyleSingleMatch.starters}>
                {language === "en" ? "ADMINISTRATORS" : "الإداريين"}
              </p>
              <div className={StyleSingleMatch.playersContainer}>
                {match?.administratorsTeamB?.map((administrator) => (
                  <div className={StyleSingleMatch.singlePlayer}>
                    <div
                      key={administrator?._id}
                      className={StyleSingleMatch.imageDivPlayer}
                    >
                      {user?.role === "admin" ||
                      user?.userId === match.watcher._id ||
                      user?._id === match.watcher._id ? (
                        <Checkbox
                          checked={unSelectedAdministratorsTeamB.includes(
                            administrator._id
                          )}
                          onChange={(event) =>
                            handleCheckboxChangeAdministratorsB(
                              event,
                              administrator._id
                            )
                          }
                          inputProps={{ "aria-label": administrator.name }}
                        />
                      ) : (
                        ""
                      )}

                      {!administrator.image ? (
                        <img
                          src={`${process.env.REACT_APP_IMAGE_PATH}/default.jpeg`}
                          alt={administrator?.name}
                          className={StyleSingleMatch.customImagePlayer}
                        />
                      ) : (
                        <img
                          src={`${process.env.REACT_APP_IMAGE_PATH}/${administrator?.image}`}
                          alt={administrator?.name}
                          className={StyleSingleMatch.customImagePlayer}
                        />
                      )}
                    </div>

                    <div className={StyleSingleMatch.characteristic}>
                      <p>
                        {administrator?.name} ({administrator?.characteristic})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                {/* <h1>Griz</h1> */}
                {user?.role === "admin" ||
                user?.userId === match?.watcher?._id ||
                user?._id === match?.watcher?._id ? (
                  <div style={{ margin: "10px 3px" }}>
                    {unSelectedAdministratorsTeamB.length > 0 ? (
                      <button
                        disabled={match?.reported}
                        onClick={handleRemoveAdministratorsB}
                        type="button"
                        className={StyleSingleMatch.addEvent}
                      >
                        {language === "en" ? "Remove" : "حذف"}
                      </button>
                    ) : (
                      <>
                        <Autocomplete
                          multiple
                          id="checkboxes-tags-demo"
                          options={match?.team_b?.team?.administrators || []}
                          disableCloseOnSelect
                          getOptionLabel={(option) => option.name}
                          isOptionEqualToValue={
                            handleIsOptionEqualToValueBAdministrators
                          }
                          value={selectedAdministratorsTeamB}
                          renderOption={(props, option, { selected }) => {
                            return (
                              <li {...props}>
                                <Checkbox
                                  icon={icon}
                                  checkedIcon={checkedIcon}
                                  style={{ marginRight: 1 }}
                                  checked={selected}
                                />
                                {!option?.image ? (
                                  <img
                                    src={`${process.env.REACT_APP_IMAGE_PATH}/default.jpeg`}
                                    alt={option?.name}
                                    className={
                                      StyleSingleMatch.customImagePlayer
                                    }
                                  />
                                ) : (
                                  <img
                                    src={`${process.env.REACT_APP_IMAGE_PATH}/${option?.image}`}
                                    alt={option?.name}
                                    className={
                                      StyleSingleMatch.customImagePlayer
                                    }
                                  />
                                )}
                                {option?.name} {option?.tShirtNumber}
                              </li>
                            );
                          }}
                          // style={{ width: 400 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Administrators"
                              placeholder="Administrators"
                            />
                          )}
                          onChange={(event, value) =>
                            setSelectedAdministratorsTeamB(value)
                          }
                        />
                        <button
                          disabled={match?.reported}
                          onClick={handleAddAdministratorsB}
                          type="button"
                          className={StyleSingleMatch.addEvent}
                        >
                          {language === "en" ? "Add" : "اضافة"}
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
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
              <LuTrophy className={StyleSingleMatch.iconInfo} />
              <p>{match?.title?.name}</p>
            </div>
            <div className={StyleSingleMatch.thing}>
              <MdUpdate className={StyleSingleMatch.iconInfo} />
              <p>
                {" "}
                {new Date(match?.match_date).toLocaleDateString("en-US", {
                  timeZone: "UTC",
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className={StyleSingleMatch.thing}>
              <IoTimeOutline className={StyleSingleMatch.iconInfo} />
              <p>
                {new Date(
                  `2000-01-01T${match?.match_time}:00Z`
                ).toLocaleTimeString("en-US", {
                  timeZone: "UTC",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </p>
            </div>
            <div className={StyleSingleMatch.thing}>
              <MdOutlineStadium className={StyleSingleMatch.iconInfo} />
              <p>
                <a
                  href={`${match?.pitch?.location}`}
                  className={StyleSingleMatch.location}
                >
                  {match?.pitch?.name}
                </a>
              </p>
            </div>
            <div className={StyleSingleMatch.thing}>
              <RiCalendarEventFill className={StyleSingleMatch.iconInfo} />
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
                src={`${process.env.REACT_APP_IMAGE_PATH}/${match?.team_a?.team?.image}`}
                alt={match?.team_a?.team?.name}
                className={StyleSingleMatch.cardImage}
              />
              <h1>
                <span style={{ color: "grey", fontSize: "10px" }}>
                  {language === "en" ? "(Home)" : "(المستضيف)"}
                </span>{" "}
                {match?.team_a?.team?.name}
              </h1>

              {user?.role === "admin" ||
              user?.userId === match?.watcher?._id ||
              user?.userId === match?.referee?._id ||
              user?._id === match?.watcher?._id ||
              user?._id === match?.referee?._id ? (
                <>
                  <div className={StyleSingleMatch.containerActions}>
                    <button
                      disabled={match?.reported}
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
                      disabled={match?.reported}
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
                      disabled={match?.reported}
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
                      disabled={match?.reported}
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
                          disabled={match?.reported}
                          type="submit"
                          className={StyleSingleMatch.addEvent}
                        >
                          {language === "en" ? "Add" : "اضافة"}
                        </button>
                        <button
                          disabled={match?.reported}
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
            <section className={StyleSingleMatch.containerScores}>
              {/* Result Watcher */}

              {loading || !match ? (
                <Skeleton variant="circular" width={80} height={80} />
              ) : (
                <section className={StyleSingleMatch.results}>
                  <div className={StyleSingleMatch.result}>
                    <p>{match?.team_a?.scoreWatcher}</p>
                    <span>-</span>
                    <p>{match?.team_b?.scoreWatcher}</p>
                  </div>
                  <div className={StyleSingleMatch.resultPenalties}>
                    <p>{match?.team_a?.scorePenaltiesWatcher}</p>
                    <span>-</span>
                    <p>{match?.team_b?.scorePenaltiesWatcher}</p>
                  </div>
                </section>
              )}

              {/* Result Referee */}
              {user?.role === "admin" ||
              user?.userId === match?.referee?._id ||
              user?._id === match?.referee?._id ? (
                <section className={StyleSingleMatch.results}>
                  <div className={StyleSingleMatch.result}>
                    <p>{match?.team_a?.scoreReferee}</p>
                    <span>-</span>
                    <p>{match?.team_b?.scoreReferee}</p>
                  </div>
                  <div className={StyleSingleMatch.resultPenalties}>
                    <p>{match?.team_a?.scorePenaltiesReferee}</p>
                    <span>-</span>
                    <p>{match?.team_b?.scorePenaltiesReferee}</p>
                  </div>
                </section>
              ) : (
                ""
              )}
            </section>
            <section className={StyleSingleMatch.teamA}>
              <img
                src={`${process.env.REACT_APP_IMAGE_PATH}/${match?.team_b?.team?.image}`}
                alt={match?.team_b?.team?.name}
                className={StyleSingleMatch.cardImage}
              />
              <h1>
                <span style={{ color: "grey", fontSize: "10px" }}>
                  {language === "en" ? "(Away)" : "(الضيف)"}
                </span>{" "}
                {match?.team_b?.team?.name}
              </h1>
              {/* Team B Actions  */}

              {user?.role === "admin" ||
              user?.userId === match?.watcher?._id ||
              user?.userId === match?.referee?._id ||
              user?._id === match?.watcher?._id ||
              user?._id === match?.referee?._id ? (
                <>
                  <div className={StyleSingleMatch.containerActions}>
                    <button
                      disabled={match?.reported}
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
                      disabled={match?.reported}
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
                      disabled={match?.reported}
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
                      disabled={match?.reported}
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
                          disabled={match?.reported}
                          type="submit"
                          className={StyleSingleMatch.addEvent}
                        >
                          {language === "en" ? "Add" : "اضافة"}
                        </button>
                        <button
                          disabled={match?.reported}
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
                {user && (
                  <TabButton
                    selectTab={() => handleTabChange("administrator")}
                    active={tab === "administrator"}
                  >
                    {language === "en" ? "ADMINISTRATOR" : "الإداريين"}
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
