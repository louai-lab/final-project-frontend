import React , {useState} from "react";
import StyleEvent from "./Event.module.css";

function Event({ cancelEvent }) {
    const [formData, setFormData] = useState({
        type: "",
        team:"",
        playerIn:"",
        // playerOut:"",
        minute:"",
      });

  const handleAdd = (e) => {
    e.preventDefault();
    console.log("hi");
  };

  return (
    <div className={StyleEvent.popUpContainer}>
      {/* <div className={StyleEvent.formContainer}> */}
      <h1 className={StyleEvent.eventH1}>Event Form</h1>
      <form action="#">
        <div className={StyleEvent.control}>
          <label htmlFor="dropdown">Select Type</label>
          <select id="dropdown" name="dropdown" className={StyleEvent.select}>
            <option value="">Select an option</option>
            <option value="option1">Option 1</option>
          </select>
        </div>
        <div className={StyleEvent.control}>
          <label htmlFor="dropdown">Select Team</label>
          <select id="dropdown" name="dropdown" className={StyleEvent.select}>
            <option value="">Select an option</option>
            <option value="option1">Option 1</option>
          </select>
        </div>
        <div className={StyleEvent.control}>
          <label htmlFor="dropdown">Player</label>
          <select id="dropdown" name="dropdown" className={StyleEvent.select}>
            <option value="">Select an option</option>
            <option value="option1">Option 1</option>
          </select>
        </div>
        <div className={StyleEvent.control}>
          <label htmlFor="minutes">Minutes</label>
          <input type="number" name="minutes" id="minutes" />
        </div>
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
    // </div>
  );
}

export default Event;
