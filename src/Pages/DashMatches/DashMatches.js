import React, { useState } from "react";
import StyleDashMatches from "./DashMatches.module.css";
import Table from "../../Components/Table/Table";
import { useMatchesStore } from "../../Zustand/Store";
import AddPopUpMatch from "./AddPopUpMatches/AddPopUpMatch";

function DashMatches() {
  const { matches } = useMatchesStore();
  const [isAddPopUp, setIsAddPopUp] = useState(false);

  const handleOpenPopUp = () => {
    setIsAddPopUp(true);
  };

  const handleCancelAdd=()=>{
    setIsAddPopUp(false)
  }

  return (
    <>
      {isAddPopUp && (
        <>
          <AddPopUpMatch handleCancelAdd={handleCancelAdd} />
        </>
      )}
      <div className={StyleDashMatches.container}>
        <button className={StyleDashMatches.add} onClick={handleOpenPopUp}>
          Add A Match
        </button>
        <Table
          data={matches}
          isEdit={true}
          ForWhat="matches"
          //   handleEditOpen={handleEditOpen}
          //   handleOpenDelete={handleOpen}
          //   setSelectedRowData={setSelectedRowData}
        />
      </div>
    </>
  );
}

export default DashMatches;
