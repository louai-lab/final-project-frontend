import React, { memo } from "react";

const PlayerSearchInput = memo(({ playerName, handlePlayerNameChange }) => {
//   console.log("PlayerSearchInput rendered");

  return (
    <input
      type="text"
      style={{
        marginRight: "10px",
        width: "auto",
        position: "sticky",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        outline: "none",
      }}
      placeholder="Enter player name"
      value={playerName}
      onChange={handlePlayerNameChange}
    />
  );
});

export default PlayerSearchInput;
