import React, { useState } from "react";
import StyleEvent from "./Event.module.css";

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

  const [players, setPlayers] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "team") {
      if (value === teamATeam._id) {
        setPlayers(playersATeam);
      } else if (value === teamBTeam._id) {
        setPlayers(playersBTeam);
      } else {
        setPlayers([]);
      }
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const { type, team, playerIn, minute } = formData;
    if (!type || !team || !playerIn || !minute) {
      setAllFieldsRequired(true);
      return;
    }
    handleEventSubmit(formData);
  };

  return (
    <div className={StyleEvent.popUpContainer}>
      <h1 className={StyleEvent.eventH1}>Event Form</h1>
      <form action="#">
        <div className={StyleEvent.control}>
          <label htmlFor="type">Select Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            className={StyleEvent.select}
            onChange={handleInputChange}
          >
            <option value="">Select an option</option>
            <option value="goal">Goal</option>
            <option value="yellow_card">Yellow Cart</option>
            <option value="red_card">Red Cart</option>
            <option value="substitution">Substitution</option>
          </select>
        </div>
        <div className={StyleEvent.control}>
          <label htmlFor="team">Select Team</label>
          <select
            id="team"
            name="team"
            className={StyleEvent.select}
            value={formData.team}
            onChange={handleInputChange}
          >
            <option value="">Select an option</option>
            <option value={teamATeam._id}>{teamATeam.name}</option>
            <option value={teamBTeam._id}>{teamBTeam.name}</option>
          </select>
        </div>
        <div className={StyleEvent.control}>
          {formData.type === "substitution" ? (
            <label htmlFor="playerIn">Player In</label>
          ) : (
            <label htmlFor="playerIn">Player</label>
          )}
          <select
            id="playerIn"
            name="playerIn"
            className={StyleEvent.select}
            value={formData.playerIn}
            onChange={handleInputChange}
          >
            <option value="">Select an option</option>
            {players.map((player) => (
              <option key={player._id} value={player._id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>
        {formData.type === "substitution" && (
          <div className={StyleEvent.control}>
            <label htmlFor="playerOut">Player Out</label>
            <select
              id="playerOut"
              name="playerOut"
              className={StyleEvent.select}
              value={formData.playerOut}
              onChange={handleInputChange}
              required
            >
              <option value="">Select an option</option>
              {players.map((player) => (
                <option key={player._id} value={player._id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className={StyleEvent.control}>
          <label htmlFor="minute">Minutes</label>
          <input
            type="number"
            name="minute"
            id="minute"
            value={formData.minute}
            placeholder="Minute"
            onChange={handleInputChange}
          />
        </div>
        {allFieldsRequired && (
          <p style={{ color: "red" }}>All fields are required!</p>
        )}
        <div className={StyleEvent.control}>
          <button
            type="button"
            onClick={handleAdd}
            className={StyleEvent.addEvent}
          >
            Create
          </button>
        </div>
        <div className={StyleEvent.control}>
          <button
            type="button"
            onClick={cancelEvent}
            className={StyleEvent.cancelEvent}
          >
            Exit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Event;
