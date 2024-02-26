import React from "react";
import StyleDeleteEvent from "./EventDelete.module.css";

function EventDelete({cancelDeleteEvent , handleDeleteEvent}) {
  return (
    <div className={StyleDeleteEvent.popUpContainer}>
      <h1>Are you sure to Delete this event?!</h1>
      <div>
        <div className={StyleDeleteEvent.control}>
          <button
            type="button"
            onClick={handleDeleteEvent}
            className={StyleDeleteEvent.addEvent}
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={cancelDeleteEvent}
            className={StyleDeleteEvent.cancelEvent}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDelete;
