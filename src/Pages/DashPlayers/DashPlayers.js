import React , {useState} from "react";
import AddPopUpPlayer from "./AddPopUpPlayer/AddPopUpPlayer.js";
import StyleDashPlayers from './DashPlayers.module.css'

function DashPlayers() {
  const [isAddPopUp, setIsAddPopUp] = useState(false);

  const handleOpenPopUp = () => {
    setIsAddPopUp(true);
  };
  return (
    <>
      {isAddPopUp && (
        <>
          <AddPopUpPlayer />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1002,
            }}
            onClick={() => setIsAddPopUp(false)}
          ></div>
        </>
      )}
      <div className={StyleDashPlayers.container}>
        <button className={StyleDashPlayers.add} onClick={handleOpenPopUp}>
          Add A Player
        </button>
        {/* <Table data={dataWithIds} isEdit={true} ForWhat="users" /> */}
      </div>
    </>
  );
}

export default DashPlayers;
