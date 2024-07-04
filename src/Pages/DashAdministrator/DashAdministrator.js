import React, { useState } from "react";
import StyleDashAdministrators from "./DashAdministrator.module.css";
import { useAdministratorsStore, useTeamsStore } from "../../Zustand/Store";
import Table from "../../Components/Table/Table";
import AddPopUpAdministrator from "./AddPopUpAdministrator/AddPopUpAdministrator";
import axiosInstance from "../../Utils/AxiosInstance";
import EditPopUpAdministrator from "./EditPopUpAdministrator/EditPopUpAdministrator";
import { Backdrop, Box, Button, Fade, Modal, Typography } from "@mui/material";

function DashAdministrator() {
  const [isAddPopUp, setIsAddPopUp] = useState(false);
  const [isEditPopUp, setIsEditPopUp] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const { administrators } = useAdministratorsStore();

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
      // console.log(formData);

      const response = await axiosInstance.post(
        "/administrator/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response) {
        useAdministratorsStore.setState((state) => ({
          administrators: [response.data, ...state.administrators],
        }));
        console.log("Administrators created successfully:");
      }
      setIsAddPopUp(false);
    } catch (error) {
      console.log("Error creating administrators:", error);
    }
  };

  const handleEditOpen = (selectedRowData) => {
    setIsEditPopUp(true);
  };

  const handleCancelEdit = () => {
    setIsEditPopUp(false);
  };

  const handleEditSave = async (id, formData) => {
    try {
      const response = await axiosInstance.patch(
        `/administrator/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response) {
        console.log("Administrator updated successfully:");
        useAdministratorsStore.setState((state) => {
          const updatedAdministrators = state.administrators.map(
            (administrator) => {
              if (administrator._id === id) {
                return response.data;
              }
              return administrator;
            }
          );

          return {
            administrators: updatedAdministrators,
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
          console.log("Administrator has no team");
        }
      }

      setIsEditPopUp(false);
    } catch (error) {
      console.log("Error updating administrator:", error);
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
      const response = await axiosInstance.delete(`/administrator/delete/${id}`);
      if (response) {
        console.log("Administrator deleted successfully:");
        useAdministratorsStore.setState((state) => ({
            administrators: state.administrators.filter((administrator) => administrator._id !== id),
        }));
      }
      setIsOpen(false);
    } catch (error) {
      console.log("Error deleting administrators:", error);
    }
  };

  return (
    <>
      {isEditPopUp && (
        <>
          <EditPopUpAdministrator
            selectedRowData={selectedRowData}
            handleCancelEdit={handleCancelEdit}
            handleSave={(formData) =>
              handleEditSave(selectedRowData._id, formData)
            }
          />
        </>
      )}
      {isAddPopUp && (
        <>
          <AddPopUpAdministrator
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
                Are you sure to Delete this Administrator?
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
      <div className={StyleDashAdministrators.container}>
        <button
          className={StyleDashAdministrators.add}
          onClick={handleOpenPopUp}
        >
          Add Administrator
        </button>
        <Table
          data={administrators}
          isEdit={true}
          ForWhat="administrators"
          handleEditOpen={handleEditOpen}
          handleOpenDelete={handleOpen}
          setSelectedRowData={setSelectedRowData}
        />
      </div>
    </>
  );
}

export default DashAdministrator;
