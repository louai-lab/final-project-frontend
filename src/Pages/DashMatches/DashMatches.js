import { useState } from "react";
import StyleDashMatches from "./DashMatches.module.css";
import Table from "../../Components/Table/Table";
import { useMatchesStore } from "../../Zustand/Store";
import { useTeamsStore } from "../../Zustand/Store.js";
import { useUsersStore } from "../../Zustand/Store";
import AddPopUpMatch from "./AddPopUpMatches/AddPopUpMatch";
import axiosInstance from "../../Utils/AxiosInstance";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import { Button } from "@mui/material";
import EditPopUpMatch from "./EditPopUpMatch/EditPopUpMatch.js";

function DashMatches() {
  const { matches } = useMatchesStore();
  const [isAddPopUp, setIsAddPopUp] = useState(false);
  const [isEditPopUp, setIsEditPopUp] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

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

  const handleFormSubmitMatch = async (formData) => {
    console.log("Form data:", formData);
    try {
      const response = await axiosInstance.post("/match/add", formData);
      if (response) {
        useMatchesStore.setState((state) => ({
          matches: [response.data, ...state.matches],
        }));
        console.log("Match created successfully:");
      }
      setIsAddPopUp(false);
    } catch (error) {
      console.log("Error creating match:", error);
    }
    // console.log(formData)
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`match/delete/${id}`);
      if (response) {
        console.log("Match deleted successfully:");
        useMatchesStore.setState((state) => ({
          matches: state.matches.filter((match) => match._id !== id),
        }));
      }
      setIsOpen(false);
    } catch (error) {
      console.log("Error deleting match:", error);
    }
  };

  const handleEditOpen = () => {
    setIsEditPopUp(true);
  };

  const handleCancelEdit = () => {
    setIsEditPopUp(false);
  };

  const handleEditSave = async (id, formData) => {
    try {
      const response = await axiosInstance.patch(
        `/match/update/${id}`,
        formData
      );
      if (response) {
        console.log("Match updated successfully:");

        useMatchesStore.setState((state) => {
          const updatedMatches = state.matches.map((match) => {
            if (match._id === id) {
              return response.data;
            }
            return match;
          });

          return {
            matches: updatedMatches,
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
        }

        if (response.data.user) {
          useUsersStore.setState((state) => {
            const updatedUsers = state.users.map((user) => {
              if (user._id === response.data.user._id) {
                return response.data.user;
              }
              return user;
            });

            return {
              users: updatedUsers,
            };
          });
        }
      }
      setIsEditPopUp(false);
    } catch (error) {
      console.log("Error updating match:", error);
    }
  };

  return (
    <>
      {isAddPopUp && (
        <>
          <AddPopUpMatch
            handleCancelAdd={handleCancelAdd}
            handleFormSubmitMatch={handleFormSubmitMatch}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              // backgroundColor: "rgba(0, 0, 0, 0.5)",
              // backgroundColor: "rgba(0, 0, 0, 0.8)",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              zIndex: 1002,
            }}
            onClick={() => setIsAddPopUp(false)}
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
                Are you sure to Delete this Match?
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
      {isEditPopUp && (
        <>
          <EditPopUpMatch
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
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              zIndex: 1002,
            }}
            onClick={() => setIsEditPopUp(false)}
          ></div>
        </>
      )}
      <div className={StyleDashMatches.container}>
        <button className={StyleDashMatches.add} onClick={handleOpenPopUp}>
          Add Match +
        </button>
        <Table
          data={matches}
          isEdit={true}
          ForWhat="matches"
          handleEditOpen={handleEditOpen}
          handleOpenDelete={handleOpen}
          setSelectedRowData={setSelectedRowData}
        />
      </div>
    </>
  );
}

export default DashMatches;
