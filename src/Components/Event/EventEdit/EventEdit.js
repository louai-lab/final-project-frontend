import React, { useState, useEffect } from "react";
import StyleEditEvent from "./EventEdit.module.css";
import { useLanguage } from "../../../Utils/LanguageContext";

function EventEdit({
  cancelEditEvent,
  // handleEditEvent,
  teamATeam,
  teamBTeam,
  playersATeam,
  playersBTeam,
  event,
  handleEditEvent,
}) {
  const [formData, setFormData] = useState({
    type: event.type || "",
    team: event.team ? event.team._id : "",
    playerIn: event.playerIn ? event.playerIn._id : "",
    playerOut: event.playerOut ? event.playerOut._id : "",
    minute: event.minute || "",
  });

  // console.log(formData.playerIn)
  // console.log(formData.team)

  const { language } = useLanguage();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const defaultPlayers =
      formData.team === teamATeam._id
        ? playersATeam
        : formData.team === teamBTeam._id
        ? playersBTeam
        : [];

    setPlayers(defaultPlayers);
  }, [formData.team, playersATeam, playersBTeam]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "team") {
      const selectedPlayers =
        value === teamATeam._id
          ? playersATeam
          : value === teamBTeam._id
          ? playersBTeam
          : [];
      setPlayers(selectedPlayers);
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditEventSend = (formData) => {
    handleEditEvent(formData);
  };

  return (
    <div className={StyleEditEvent.popUpContainer}>
      <h1 className={StyleEditEvent.eventH1}>
        {" "}
        {language === "en" ? "Edit Event" : "تعديل الحدث"}
      </h1>

      <form action="#">
        <div className={StyleEditEvent.control}>
          <div className={StyleEditEvent.control}>
            <label htmlFor="type">
              {language === "en" ? "Select Type" : "إختار نوع الحدث"}
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              className={StyleEditEvent.select}
              onChange={handleInputChange}
            >
              <option value="">
                {" "}
                {language === "en" ? "Select an option" : "حدّد"}
              </option>
              <option value="goal">{language === "en" ? "Goal" : "هدف"}</option>
              <option value="yellow_card">
                {" "}
                {language === "en" ? "Yellow Cart" : "بطاقة صفراء"}
              </option>
              <option value="red_card">
                {" "}
                {language === "en" ? "Red Cart" : "بطاقة حمراء"}
              </option>
              <option value="substitution">
                {" "}
                {language === "en" ? "Substitution" : "تبديل"}
              </option>
            </select>
          </div>
          <div className={StyleEditEvent.control}>
            <label htmlFor="team">
              {" "}
              {language === "en" ? "Select Team" : "اختار الفريق"}
            </label>
            <select
              id="team"
              name="team"
              className={StyleEditEvent.select}
              value={formData.team}
              onChange={handleInputChange}
            >
              <option value="">
                {" "}
                {language === "en" ? "Select an option" : "حدّد"}
              </option>
              <option value={teamATeam._id}>{teamATeam.name}</option>
              <option value={teamBTeam._id}>{teamBTeam.name}</option>
            </select>
          </div>
          <div className={StyleEditEvent.control}>
            {formData.type === "substitution" ? (
              <label htmlFor="playerIn">
                {" "}
                {language === "en" ? "Player In" : "البديل"}
              </label>
            ) : (
              <label htmlFor="playerIn">
                {" "}
                {language === "en" ? "Player" : "اختار اللاعب"}
              </label>
            )}
            <select
              id="playerIn"
              name="playerIn"
              className={StyleEditEvent.select}
              value={formData.playerIn}
              onChange={handleInputChange}
            >
              <option value="">
                {" "}
                {language === "en" ? "Select an option" : "حدّد"}
              </option>
              {players.map((player) => (
                <option key={player._id} value={player._id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>
          {formData.type === "substitution" && (
            <div className={StyleEditEvent.control}>
              <label htmlFor="playerOut">
                {" "}
                {language === "en" ? "Player Out" : "المستبدل"}
              </label>
              <select
                id="playerOut"
                name="playerOut"
                className={StyleEditEvent.select}
                value={formData.playerOut}
                onChange={handleInputChange}
              >
                <option value="">
                  {" "}
                  {language === "en" ? "Select an option" : "حدّد"}
                </option>
                {players.map((player) => (
                  <option key={player._id} value={player._id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className={StyleEditEvent.control}>
            <label htmlFor="minute">
              {" "}
              {language === "en" ? "Minutes" : "الدقيقة"}
            </label>
            <input
              type="number"
              name="minute"
              id="minute"
              value={formData.minute}
              placeholder={language === "en" ? "Minute" : "الدقيقة"}
              onChange={handleInputChange}
            />
          </div>
          <div className={StyleEditEvent.control}>
            <button
              type="button"
              onClick={() => handleEditEventSend(formData)}
              className={StyleEditEvent.addEvent}
            >
              {language === "en" ? "Save" : "حفظ"}
            </button>
            <button
              type="button"
              onClick={cancelEditEvent}
              className={StyleEditEvent.cancelEvent}
            >
              {language === "en" ? "Cancel" : "إلغاء"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EventEdit;
