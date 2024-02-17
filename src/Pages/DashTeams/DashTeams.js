import React, { useState } from "react";
import Table from "../../Components/Table/Table";
import { useTeamsStore } from "../../Zustand/Store";
import StyleDashTeams from "./DashTeams.module.css";
import AddPopUpTeam from "./AddPopUpTeam/AddPopUpTeam";
import axiosInstance from "../../Utils/AxiosInstance";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import { Button } from "@mui/material";
import EditPopUpTeams from "./EditPopUpTeams/EditPopUpTeams";

function DashTeams() {
  const [isAddPopUp, setIsAddPopUp] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditPopUp, setIsEditPopUp] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const { teams } = useTeamsStore();
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

  const handleFormSubmitTeam = async (formData) => {
    try {
      const playerIds = formData.playersIds.map((player) => player._id);

      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("image", formData.image);
      formDataToSend.append("playersIds", playerIds);

      console.log(formData);

      const headers = {
        "Content-Type": "multipart/form-data",
      };

      const response = await axiosInstance.post("/team/add", formData, {
        headers,
      });

      if (response) {
        useTeamsStore.setState((state) => ({
          teams: [response.data, ...state.teams],
        }));
        console.log("Team created successfully:", response.data);
      }
      setIsAddPopUp(false);
    } catch (error) {
      console.error("Error creating team:", error);
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
      const response = await axiosInstance.delete(`/team/delete/${id}`);
      if (response) {
        console.log("Team deleted successfully:", response.data);
        useTeamsStore.setState((state) => ({
          teams: state.teams.filter((team) => team._id !== id),
        }));
      }
      setIsOpen(false);
    } catch (error) {
      console.log("Error deleting team:", error);
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
        `/team/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response) {
        console.log("Team updated successfully:", response.data);
        useTeamsStore.setState((state)=>{
          const updatedTeams = state.teams.map((team)=>{
            if(team._id === id){
              return response.data
            }
            return team;
          })
          return{
            teams:updatedTeams
          }
        })
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
          <EditPopUpTeams
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
                Are you sure to Delete this user?
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
      <div className={StyleDashTeams.container}>
        <button className={StyleDashTeams.add} onClick={handleOpenPopUp}>
          Add A Team
        </button>
        <Table
          data={teams}
          isEdit={true}
          ForWhat="teams"
          handleEditOpen={handleEditOpen}
          handleOpenDelete={handleOpen}
          setSelectedRowData={setSelectedRowData}
        />
      </div>
    </>
  );
}

export default DashTeams;
