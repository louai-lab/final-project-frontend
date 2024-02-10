import React, { useState } from "react";
import Table from "../../Components/Table/Table";
import StyleDashUsers from "./DashUsers.module.css";
import { useUsersStore } from "../../Zustand/Store";
import AddPopUpUser from "./AddPopUpUser/AddPopUpUser.js";
import axios from "axios";
import axiosInstance from "../../Utils/AxiosInstance.js";
import EditPopUpUser from "./EditPopUpUser/EditPopUpUser.js";

function DashUsers() {
  const [isAddPopUp, setIsAddPopUp] = useState(false);
  const [isEditPopUp, setIsEditPopUp] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const { users } = useUsersStore();
  const dataWithIds = users.map((row, index) => ({ ...row, id: index + 1 }));

  // console.log(users);
  const handleOpenPopUp = () => {
    setIsAddPopUp(true);
  };
  const handleCancel = () => {
    setIsAddPopUp(false);
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
        console.log("User created successfully:", response.data);
      }
      setIsAddPopUp(false);
    } catch (error) {
      console.log("Error creating user:", error);
    }
  };

  const handleEditOpen = (selectedRowData) => {
    setIsEditPopUp(true);
    // console.log(selectedRowData)
  };

  const handleEditSave = async (id, formData) => {
    try {
      const response = await axiosInstance.patch(
        `/user/update/${id}`,
        formData
      );
      if (response) {
        console.log("User updated successfully:", response.data);
      }
      setIsEditPopUp(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <>
      {isAddPopUp && (
        <>
          <AddPopUpUser
            handleCancel={handleCancel}
            handleFormSubmit={handleFormSubmit}
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
          <EditPopUpUser
            selectedRowData={selectedRowData}
            handleCancel={handleCancel}
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
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1002,
            }}
            onClick={() => setIsEditPopUp(false)}
          ></div>
        </>
      )}
      <div className={StyleDashUsers.container}>
        <button className={StyleDashUsers.add} onClick={handleOpenPopUp}>
          Add An User
        </button>
        <Table
          data={dataWithIds}
          isEdit={true}
          ForWhat="users"
          handleEditOpen={handleEditOpen}
          setSelectedRowData={setSelectedRowData}
        />
      </div>
    </>
  );
}

export default DashUsers;
