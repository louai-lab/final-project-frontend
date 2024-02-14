import React, { useState } from "react";
import Table from "../../Components/Table/Table";
import { useTeamsStore } from "../../Zustand/Store";
import StyleDashTeams from "./DashTeams.module.css";
import AddPopUpTeam from "./AddPopUpTeam/AddPopUpTeam";
import axiosInstance from "../../Utils/AxiosInstance";

function DashTeams() {
  const [isAddPopUp, setIsAddPopUp] = useState(false);
  const { teams } = useTeamsStore();

  const handleOpenPopUp = () => {
    setIsAddPopUp(true);
  };

  const handleCancelAdd = () => {
    setIsAddPopUp(false);
  };

  const handleFormSubmitTeam = async (formData) => {
    try {
      console.log(formData);
      const response = await axiosInstance.post(
        "/team/add",
        {
          ...formData,
          // playersIds:formData.players,
          image: formData.image,
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Team created successfully:", response.data);
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  return (
    <>
      {isAddPopUp && (
        <>
          <AddPopUpTeam
            handleCancelAdd={handleCancelAdd}
            handleFormSubmitTeam={handleFormSubmitTeam}
          />
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
      <div className={StyleDashTeams.container}>
        <button className={StyleDashTeams.add} onClick={handleOpenPopUp}>
          Add A Team
        </button>
        <Table
          data={teams}
          isEdit={true}
          ForWhat="teams"
          // handleEditOpen={handleEditOpen}
          // handleOpenDelete={handleOpen}
          // setSelectedRowData={setSelectedRowData}
        />
      </div>
    </>
  );
}

export default DashTeams;
