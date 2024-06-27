import React, { useState } from "react";
import Table from "../../Components/Table/Table";
import { usePitchesStore } from "../../Zustand/Store";
import StyleDashPitches from "./DashPitches.module.css";
import AddPopUpPitch from "./AddPopUpPitch/AddPopUpPitch";
import axiosInstance from "../../Utils/AxiosInstance";
import EditPopUpPitch from "./EditPopUpPitch/EditPopUpPitch";
import { Backdrop, Box, Button, Fade, Modal, Typography } from "@mui/material";

function DashPitches() {
  const { pitches } = usePitchesStore();

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

  const handleFormSubmitPitch = async (formData) => {
    // console.log(formData);

    try {
      const response = await axiosInstance.post("/pitch/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response) {
        usePitchesStore.setState((state) => ({
          pitches: [response.data, ...state.pitches],
        }));
        console.log("Pitch created successfully:");
      }
      setIsAddPopUp(false);
    } catch (error) {
      console.error("Error creating team:", error);
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
        `/pitch/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response) {
        console.log("Pitch updated successfully:");
        usePitchesStore.setState((state) => {
          const updatedPitch = state.pitches.map((pitch) => {
            if (pitch._id === id) {
              return response.data;
            }
            return pitch;
          });
          return {
            pitches: updatedPitch,
          };
        });
      }
      setIsEditPopUp(false);
    } catch (error) {}
  };

  const handleDelete = async (id) => {
    // console.log(id);
    try {
      const response = await axiosInstance.delete(`/pitch/delete/${id}`);

      if (response) {
        console.log("Pitch deleted successfully:");
        usePitchesStore.setState((state) => ({
          pitches: state.pitches.filter((pitch) => pitch._id !== id),
        }));
      }
      setIsOpen(false);
    } catch (error) {
      console.log("Error deleting pitch:", error);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isAddPopUp && (
        <>
          <AddPopUpPitch
            handleCancelAdd={handleCancelAdd}
            handleFormSubmitPitch={handleFormSubmitPitch}
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
          <EditPopUpPitch
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
                Are you sure to Delete this Pitch?
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

      <div className={StyleDashPitches.container}>
        <button
          className={StyleDashPitches.add}
          onClick={() => setIsAddPopUp(true)}
        >
          Add Pitch
        </button>
        <Table
          data={pitches}
          isEdit={true}
          ForWhat="pitches"
          handleEditOpen={handleEditOpen}
          handleOpenDelete={handleOpen}
          setSelectedRowData={setSelectedRowData}
        />
      </div>
    </>
  );
}

export default DashPitches;
