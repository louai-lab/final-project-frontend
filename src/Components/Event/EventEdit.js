import React from "react";
import StyleEditEvent from "./EventEdit.module.css";

function EventEdit({cancelEditEvent , handleEditEvent}) {
  return (
    <div className={StyleEditEvent.popUpContainer}>
      <h1>Hello Edit</h1>
      <div>
        <div className={StyleEditEvent.control}>
          <button
            type="button"
            onClick={handleEditEvent}
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
    </div>
  );
}

export default EventEdit;
