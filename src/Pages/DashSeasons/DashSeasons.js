import React, { useState } from "react";
import StyleDashSeasons from "./DashSeasons.module.css";
import { useSeasonsStore } from "../../Zustand/Store";
import Table from "../../Components/Table/Table";
import AddPopUpSeason from "./AddPopUpSeason/AddPopUpSeason";
import axiosInstance from "../../Utils/AxiosInstance";
import EditPopUpSeason from "./EditPopUpSeason/EditPopUpSeason";
import { Backdrop, Box, Button, Fade, Modal, Typography } from "@mui/material";

function DashSeasons() {
  const { seasons } = useSeasonsStore();
  const [formError, setFormError] = useState(false);
  const [formErrorUpdate, setFormErrorUpdate] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const [isAddPopUp, setIsAddPopUp] = useState(false);
  const [isEditPopUp, setIsEditPopUp] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  const handleCancelAdd = () => {
    setIsAddPopUp(false);
  };

  const handleFormSubmitSeason = async (formData) => {
    // console.log(formData);

    try {
      const response = await axiosInstance.post("/season/add", formData);

      if (response) {
        useSeasonsStore.setState((state) => ({
          seasons: [response.data, ...state.seasons],
        }));
        console.log("Seasons created successfully:");
      }
      setIsAddPopUp(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setFormError(error.response.data.error);
      } else {
        console.error("Error creating season:", error);
        setFormError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleEditOpen = (selectedRowData) => {
    setIsEditPopUp(true);
    // console.log(selectedRowData);
  };

  const handleCancelEdit = () => {
    setIsEditPopUp(false);
  };

  const handleEditSave = async (id, formData) => {
    // console.log(formData);
    // console.log(id);

    try {
      const response = await axiosInstance.patch(
        `/season/update/${id}`,
        formData
      );

      if (response) {
        console.log("Season updated successfully:");
        useSeasonsStore.setState((state) => {
          const updatedSeason = state.seasons.map((season) => {
            if (season._id === id) {
              return response.data;
            }
            return season;
          });
          return {
            seasons: updatedSeason,
          };
        });
      }
      setIsEditPopUp(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setFormErrorUpdate(error.response.data.error);
      } else {
        console.error("Error creating season:", error);
        setFormErrorUpdate("An unexpected error occurred. Please try again.");
      }
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
      const response = await axiosInstance.delete(`/season/delete/${id}`);

      if (response) {
        console.log("Season deleted successfully:");
        useSeasonsStore.setState((state) => ({
          seasons: state.seasons.filter((season) => season._id !== id),
        }));
      }
      setIsOpen(false);
    } catch (error) {
      console.log("Error deleting title:", error);
    }
  };

  return (
    <>
      {isAddPopUp && (
        <>
          <AddPopUpSeason
            handleCancelAdd={handleCancelAdd}
            handleFormSubmitSeason={handleFormSubmitSeason}
            formError={formError}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              // backgroundColor: "rgba(0, 0, 0, 0.5)",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              zIndex: 1002,
            }}
            onClick={() => setIsAddPopUp(false)}
          ></div>
        </>
      )}
      {isEditPopUp && (
        <>
          <EditPopUpSeason
            selectedRowData={selectedRowData}
            handleCancelEdit={handleCancelEdit}
            handleSave={(formData) =>
              handleEditSave(selectedRowData._id, formData)
            }
            formErrorUpdate={formErrorUpdate}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              // backgroundColor: "rgba(0, 0, 0, 0.5)",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
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
                Are you sure to Delete this Title?
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
      <div className={StyleDashSeasons.container}>
        <button
          className={StyleDashSeasons.add}
          onClick={() => setIsAddPopUp(true)}
        >
          Add Season +
        </button>
        <Table
          data={seasons}
          isEdit={true}
          ForWhat="seasons"
          handleEditOpen={handleEditOpen}
          handleOpenDelete={handleOpen}
          setSelectedRowData={setSelectedRowData}
        />
      </div>
    </>
  );
}

export default DashSeasons;
