import React, { useState, useEffect } from "react";
import StyleEditEvent from "./EventEdit.module.css";

function EventEdit({
  cancelEditEvent,
  // handleEditEvent,
  teamATeam,
  teamBTeam,
  playersATeam,
  playersBTeam,
  event,
  handleEditEvent
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

  const handleEditEventSend = ( formData) => {
    handleEditEvent(formData)
  };

  return (
    <div className={StyleEditEvent.popUpContainer}>
      <h1 className={StyleEditEvent.eventH1}>Hello Edit</h1>

      <form action="#">
        <div className={StyleEditEvent.control}>
          <div className={StyleEditEvent.control}>
            <label htmlFor="type">Select Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              className={StyleEditEvent.select}
              onChange={handleInputChange}
            >
              <option value="">Select an option</option>
              <option value="goal">Goal</option>
              <option value="yellow_card">Yellow Cart</option>
              <option value="red_card">Red Cart</option>
              <option value="substitution">Substitution</option>
            </select>
          </div>
          <div className={StyleEditEvent.control}>
            <label htmlFor="team">Select Team</label>
            <select
              id="team"
              name="team"
              className={StyleEditEvent.select}
              value={formData.team}
              onChange={handleInputChange}
            >
              <option value="">Select an option</option>
              <option value={teamATeam._id}>{teamATeam.name}</option>
              <option value={teamBTeam._id}>{teamBTeam.name}</option>
            </select>
          </div>
          <div className={StyleEditEvent.control}>
            {formData.type === "substitution" ? (
              <label htmlFor="playerIn">Player In</label>
            ) : (
              <label htmlFor="playerIn">Player</label>
            )}
            <select
              id="playerIn"
              name="playerIn"
              className={StyleEditEvent.select}
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
            <div className={StyleEditEvent.control}>
              <label htmlFor="playerOut">Player Out</label>
              <select
                id="playerOut"
                name="playerOut"
                className={StyleEditEvent.select}
                value={formData.playerOut}
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
          )}
          <div className={StyleEditEvent.control}>
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
          <div className={StyleEditEvent.control}>
            <button
              type="button"
              onClick={()=>handleEditEventSend(formData)}
              className={StyleEditEvent.addEvent}
            >
              Save
            </button>
            <button
              type="button"
              onClick={cancelEditEvent}
              className={StyleEditEvent.cancelEvent}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EventEdit;
