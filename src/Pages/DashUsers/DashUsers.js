import React, { useState } from "react";
import Table from "../../Components/Table/Table";
import StyleDashUsers from "./DashUsers.module.css";
import { useUsersStore } from "../../Zustand/Store";
import AddPopUpUser from "./AddPopUpUser/AddPopUpUser.js";
import axiosInstance from "../../Utils/AxiosInstance.js";
import EditPopUpUser from "./EditPopUpUser/EditPopUpUser.js";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import { Button } from "@mui/material";

function DashUsers() {
  const [isAddPopUp, setIsAddPopUp] = useState(false);
  const [isEditPopUp, setIsEditPopUp] = useState(false);
  // const [isDeletePopUp, setIsDeletePopUp] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { users } = useUsersStore();
  const dataWithIds = users.map((row, index) => ({ ...row, id: index + 1 }));

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

  // console.log(users);
  const handleOpenPopUp = () => {
    setIsAddPopUp(true);
  };
  const handleCancelAdd = () => {
    setIsAddPopUp(false);
  };

  const handleCancelEdit = () => {
    setIsEditPopUp(false);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const formDataObject = new FormData();
      // console.log("before" , formData)

      for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
          formDataObject.append(key, formData[key]);
        }
      }

      // console.log("FormData:", formDataObject);

      const response = await axiosInstance.post("/user/add", formDataObject);
      if (response) {
        useUsersStore.setState((state) => ({
          users: [response.data, ...state.users],
        }));
        console.log("User created successfully:");
      }
      setIsAddPopUp(false);
    } catch (error) {
      console.log("Error creating user:", error);
    }
  };

  const handleEditOpen = () => {
    setIsEditPopUp(true);
    // console.log(selectedRowData)
  };

  const handleEditSave = async (id, formData) => {
    try {
      const formDataObject = new FormData();

      for (const key in formData) {
        formDataObject.append(key, formData[key]);
      }

      // console.log(formData);

      formDataObject.append("image", formData.image);

      formData.id = id;

      const response = await axiosInstance.patch(`/user/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response) {
        console.log("User updated successfully:");

        useUsersStore.setState((state) => {
          const updatedUsers = state.users.map((user) => {
            if (user._id === id) {
              return response.data;
            }
            return user;
          });

          return {
            users: updatedUsers,
          };
        });
      }
      setIsEditPopUp(false);
    } catch (error) {
      console.error("Error updating user:", error);
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
      const response = await axiosInstance.delete(`/user/delete/${id}`);
      if (response) {
        console.log("User deleted successfully:");
        useUsersStore.setState((state) => ({
          users: state.users.filter((user) => user._id !== id),
        }));
      }
      setIsOpen(false);
    } catch (error) {
      console.log("Error deleting user:", error);
    }
  };

  return (
    <>
      {isAddPopUp && (
        <>
          <AddPopUpUser
            handleCancelAdd={handleCancelAdd}
            handleFormSubmit={handleFormSubmit}
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
          <EditPopUpUser
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
      <div className={StyleDashUsers.container}>
        <button className={StyleDashUsers.add} onClick={handleOpenPopUp}>
          Add User
        </button>
        <Table
          data={dataWithIds}
          isEdit={true}
          ForWhat="users"
          handleEditOpen={handleEditOpen}
          setSelectedRowData={setSelectedRowData}
          handleOpenDelete={handleOpen}
        />
      </div>
    </>
  );
}

export default DashUsers;
