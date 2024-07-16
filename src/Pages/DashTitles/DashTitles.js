import { useTitlesStore } from "../../Zustand/Store";
import Table from "../../Components/Table/Table";
import StyleDashTitles from "./DashTitles.module.css";
import { useState } from "react";
import AddPopUpTitle from "./AddPopUpTitle/AddPopUpTitle";
import axiosInstance from "../../Utils/AxiosInstance";
import EditPopUpTitle from "./EditPopUpTitle/EditPopUpTitle";
import { Backdrop, Box, Button, Fade, Modal, Typography } from "@mui/material";

function DashTitles() {
  const [isAddPopUp, setIsAddPopUp] = useState(false);
  const [isEditPopUp, setIsEditPopUp] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const { titles } = useTitlesStore();

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

  const handleFormSubmitTitle = async (formData) => {
    // console.log(formData);

    try {
      const response = await axiosInstance.post("/title/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response) {
        useTitlesStore.setState((state) => ({
          titles: [response.data, ...state.titles],
        }));
        console.log("Title created successfully:");
      }
      setIsAddPopUp(false);
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleEditOpen = (selectedRowData) => {
    setIsEditPopUp(true);
    // console.log(selectedRowData);
  };

  const handleCancelEdit = () => {
    setIsEditPopUp(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleEditSave = async (id, formData) => {
    try {
      const response = await axiosInstance.patch(
        `/title/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response) {
        console.log("Title updated successfully:");
        useTitlesStore.setState((state) => {
          const updatedTitle = state.titles.map((title) => {
            if (title._id === id) {
              return response.data;
            }
            return title;
          });
          return {
            titles: updatedTitle,
          };
        });
      }
      setIsEditPopUp(false);
    } catch (error) {
      console.log("Error updating title:", error);
    }
  };

  const handleDelete = async (id) => {
    // console.log(id);
    try {
      const response = await axiosInstance.delete(`/title/delete/${id}`);

      if (response) {
        console.log("Title deleted successfully:");
        useTitlesStore.setState((state) => ({
          titles: state.titles.filter((title) => title._id !== id),
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
          <AddPopUpTitle
            handleCancelAdd={handleCancelAdd}
            handleFormSubmitTitle={handleFormSubmitTitle}
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
          <EditPopUpTitle
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
      <div className={StyleDashTitles.container}>
        <button
          className={StyleDashTitles.add}
          onClick={() => setIsAddPopUp(true)}
        >
          Add Title +
        </button>
        <Table
          data={titles}
          isEdit={true}
          ForWhat="titles"
          handleEditOpen={handleEditOpen}
          handleOpenDelete={handleOpen}
          setSelectedRowData={setSelectedRowData}
        />
      </div>
    </>
  );
}

export default DashTitles;
