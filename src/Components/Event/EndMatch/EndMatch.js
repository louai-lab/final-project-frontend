import React from "react";
import StyleEndMatch from "./EndMatch.module.css";

function EndMatch({ closePopUpEndMatch , handleEndMatch }) {
  return (
    <div className={StyleEndMatch.popUpContainer}>
      <h1 className={StyleEndMatch.confirmTitle}>
        Are you sure to end this match?!
      </h1>
      <div className={StyleEndMatch.confirButtons}>
        <button
          type="button"
          onClick={handleEndMatch}
          className={StyleEndMatch.confirm}
        >
          Confirm
        </button>
        <button
          type="button"
          onClick={closePopUpEndMatch}
          className={StyleEndMatch.cancelEnd}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EndMatch;
