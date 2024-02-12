import React, { useState } from "react";
import AddPopUpPlayer from "./AddPopUpPlayer/AddPopUpPlayer.js";
import StyleDashPlayers from "./DashPlayers.module.css";
import { usePlayersStore } from "../../Zustand/Store.js";
import Table from "../../Components/Table/Table.js";
import axiosInstance from "../../Utils/AxiosInstance.js";
import { useTeamsStore } from "../../Zustand/Store.js";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import { Button } from "@mui/material";
import EditPopUpPlayers from "./EditPopUpPlayers/EditPopUpPlayers.js";

function DashPlayers() {
  const [isAddPopUp, setIsAddPopUp] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditPopUp, setIsEditPopUp] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const { players } = usePlayersStore();
  const { teams } = useTeamsStore();

  // console.log(players)
  // console.log(teams)

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
    p: 4,
  };

  const handleOpenPopUp = () => {
    setIsAddPopUp(true);
  };

  const handleCancelAdd = () => {
    setIsAddPopUp(false);
  };

  const handleFormSubmitPlayer = async (formData) => {
    try {
      const formDataObject = new FormData();

      console.log(formData);

      for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
          formDataObject.append(key, formData[key]);
        }
      }

      const response = await axiosInstance.post("/player/add", formData);
      if (response) {
        usePlayersStore.setState((state) => ({
          players: [response.data, ...state.players],
        }));
        console.log("Player created successfully:", response.data);
      }
      setIsAddPopUp(false);
    } catch (error) {
      console.log("Error creating user:", error);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/player/delete/${id}`);
      if (response) {
        console.log("Player deleted successfully:", response.data);
        usePlayersStore.setState((state) => ({
          players: state.players.filter((player) => player._id !== id),
        }));
      }
      setIsOpen(false);
    } catch (error) {
      console.log("Error deleting user:", error);
    }
  };

  const handleEditOpen = (selectedRowData) => {
    setIsEditPopUp(true);
    console.log(selectedRowData);
  };

  const handleCancelEdit = () => {
    setIsEditPopUp(false);
  };

  return (
    <>
      {isAddPopUp && (
        <>
          <AddPopUpPlayer
            handleCancelAdd={handleCancelAdd}
            handleFormSubmitPlayer={handleFormSubmitPlayer}
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
      {isEditPopUp && (
        <>
          <EditPopUpPlayers
            selectedRowData={selectedRowData}
            handleCancelEdit={handleCancelEdit}
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
            onClick={() => setIsEditPopUp(false)}
          ></div>
        </>
      )}
      {isOpen && (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={isOpen}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={isOpen}>
            <Box sx={style}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Are you sure to Delete this Player?
              </Typography>
              <div
                style={{
                  display: "flex",
                  columnGap: "20px",
                  marginTop: "10px",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "var(--primary-clr)",
                    transition: "background-color 0.3s ease, color 0.3s ease",
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: "var(--third-clr)",
                      color: "white",
                    },
                  }}
                  onClick={() => handleDelete(selectedRowData._id)}
                >
                  Confirm
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    color: "var(--primary-clr)",
                    borderColor: "var(--primary-clr)",
                    transition: "background-color 0.3s ease, color 0.3s ease",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "var(--third-clr)",
                      backgroundColor: "var(--third-clr)",
                      color: "white",
                    },
                  }}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </div>
            </Box>
          </Fade>
        </Modal>
      )}
      <div className={StyleDashPlayers.container}>
        <button className={StyleDashPlayers.add} onClick={handleOpenPopUp}>
          Add A Player
        </button>
        <Table
          data={players}
          isEdit={true}
          ForWhat="players"
          handleEditOpen={handleEditOpen}
          handleOpenDelete={handleOpen}
          setSelectedRowData={setSelectedRowData}
        />
      </div>
    </>
  );
}

export default DashPlayers;
