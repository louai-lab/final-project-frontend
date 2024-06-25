import React, { useEffect, useState } from "react";
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
  const { players, getAllPlayers } = usePlayersStore();

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

      // console.log(formData);

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
        console.log("Player created successfully:");
      }
      setIsAddPopUp(false);
    } catch (error) {
      console.log("Error creating player:", error);
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
        console.log("Player deleted successfully:");
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
  };

  const handleCancelEdit = () => {
    setIsEditPopUp(false);
  };

  const handleEditSave = async (id, formData) => {
    console.log(formData);
    try {
      const response = await axiosInstance.patch(
        `/player/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response) {
        console.log("Player updated successfully:");
        usePlayersStore.setState((state) => {
          const updatedPlayers = state.players.map((player) => {
            if (player._id === id) {
              return response.data;
            }
            return player;
          });

          return {
            players: updatedPlayers,
          };
        });

        if (response.data.team) {
          useTeamsStore.setState((state) => {
            const updatedTeams = state.teams.map((team) => {
              if (team._id === response.data.team._id) {
                return response.data.team;
              }
              return team;
            });

            return {
              teams: updatedTeams,
            };
          });
        } else {
          console.log("Player has no team");
        }
      }

      setIsEditPopUp(false);
    } catch (error) {
      console.log("Error updating player:", error);
    }
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
              // backgroundColor: "rgba(0, 0, 0, 0.5)",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
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
            handleSave={(formData) =>
              handleEditSave(selectedRowData._id, formData)
            }
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              // backgroundColor: "rgba(0, 0, 0, 0.5)",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
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
                    opacity: "1",
                    transition: "opacity 0.3s ease",
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: "var(--primary-clr)",
                      opacity: "0.7",
                      cursor: "pointer",
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
                    textTransform: "none",
                    opacity: "1",
                    transition: "opacity 0.3s ease",
                    "&:hover": {
                      borderColor: "var(--third-clr)",
                      opacity: "0.7",
                      cursor: "pointer",
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
          Add Player
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
