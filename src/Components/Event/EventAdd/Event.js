import React, { useState } from "react";
import StyleEvent from "./Event.module.css";
import { useLanguage } from "../../../Utils/LanguageContext";

function Event({
  cancelEvent,
  teamATeam,
  teamBTeam,
  playersATeam,
  playersBTeam,
  handleEventSubmit,
}) {
  const [formData, setFormData] = useState({
    type: "",
    team: "",
    playerIn: "",
    playerOut: "",
    minute: "",
  });
  const [allFieldsRequired, setAllFieldsRequired] = useState(false);
  const { language } = useLanguage();
  const [players, setPlayers] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "type" && value === "HT") {
      setFormData({
        type: value,
      });
      setPlayers([]);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const { type, team, playerIn, minute } = formData;
    handleEventSubmit(formData);
  };

  return (
    <div className={StyleEvent.popUpContainer}>
      <h1 className={StyleEvent.eventH1}>
        {language === "en" ? "Event Form" : "نموذج حدث"}
      </h1>
      <form action="#">
        <div className={StyleEvent.control}>
          <label htmlFor="type">
            {language === "en" ? "Select Type" : "اختار نوع الحدث"}
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            className={StyleEvent.select}
            onChange={handleInputChange}
          >
            <option value="">
              {language === "en" ? "Select an option" : "حدّد"}
            </option>
            {/* <option value="goal">{language === "en" ? "Goal" : "هدف"}</option>
            <option value="yellow_card">
              {language === "en" ? "Yellow Cart" : "بطاقة صفراء"}
            </option>
            <option value="red_card">
              {language === "en" ? "Red Cart" : "بطاقة حمراء"}
            </option>
            <option value="substitution">
              {language === "en" ? "Substitution" : "تبديل"}
            </option> */}
            <option value="HT">
              {language === "en" ? "HT" : "نهاية الشوط الأول"}
            </option>
            <option value="firstExtraTime">
              {language === "en"
                ? "First Extra Time"
                : "نهاية الشوط الإضافي الأول"}
            </option>
            <option value="secondExtraTime">
              {language === "en"
                ? "Second Extra Time"
                : "نهاية الشوط الإضافي الثاني"}
            </option>
          </select>
        </div>
        {/* <div className={StyleEvent.control}>
          <label htmlFor="team">
            {language === "en" ? "Select Team" : "اختار الفريق"}
          </label>
          <select
            id="team"
            name="team"
            className={StyleEvent.select}
            value={formData.team}
            onChange={handleInputChange}
            disabled={formData.type === "HT"}
          >
            <option value="">
              {language === "en" ? "Select an option" : "حدّد"}
            </option>
            <option value={teamATeam._id}>{teamATeam.name}</option>
            <option value={teamBTeam._id}>{teamBTeam.name}</option>
          </select>
        </div> */}
        {/* <div className={StyleEvent.control}>
          {formData.type === "substitution" ? (
            <label htmlFor="playerIn">
              {language === "en" ? "Player In" : "البديل"}
            </label>
          ) : (
            <label htmlFor="playerIn">
              {language === "en" ? "Player" : "اختار اللاعب"}
            </label>
          )}
          <select
            id="playerIn"
            name="playerIn"
            className={StyleEvent.select}
            value={formData.playerIn}
            onChange={handleInputChange}
            disabled={formData.type === "HT"}
          >
            <option value="">
              {language === "en" ? "Select an option" : "حدّد"}
            </option>
            {players.map((player) => (
              <option key={player._id} value={player._id}>
                {player.name}
              </option>
            ))}
          </select>
        </div> */}
        {/* {formData.type === "substitution" && (
          <div className={StyleEvent.control}>
            <label htmlFor="playerOut">
              {language === "en" ? "Player Out" : "المستبدل"}
            </label>
            <select
              id="playerOut"
              name="playerOut"
              className={StyleEvent.select}
              value={formData.playerOut}
              onChange={handleInputChange}
              required
              disabled={formData.type === "HT"}
            >
              <option value="">
                {language === "en" ? "Select an option" : "حدّد"}
              </option>
              {players.map((player) => (
                <option key={player._id} value={player._id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>
        )} */}
        {/* <div className={StyleEvent.control}>
          <label htmlFor="minute">
            {language === "en" ? "Minutes" : "الدقيقة"}
          </label>
          <input
            type="number"
            name="minute"
            id="minute"
            value={formData.minute}
            placeholder={language === "en" ? "Minute" : "الدقيقة"}
            onChange={handleInputChange}
            disabled={formData.type === "HT"}
          />
        </div> */}
        {/* {allFieldsRequired && (
          <p style={{ color: "red" }}>All fields are required!</p>
        )} */}
        <div className={StyleEvent.control}>
          <button
            type="button"
            onClick={handleAdd}
            className={StyleEvent.addEvent}
          >
            {language === "en" ? "Add" : "أضف"}
          </button>
        </div>
        <div className={StyleEvent.control}>
          <button
            type="button"
            onClick={cancelEvent}
            className={StyleEvent.cancelEvent}
          >
            {language === "en" ? "Cancel" : "إلغاء"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Event;
