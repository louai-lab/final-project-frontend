import { useEffect, useState } from "react";
import StyleDashAdministrators from "./DashAdministrator.module.css";
import { useAdministratorsStore, useTeamsStore } from "../../Zustand/Store";
import Table from "../../Components/Table/Table";
import axiosInstance from "../../Utils/AxiosInstance";
import AddModal from "../../Components/AddModal/AddModal";
import DeleteModal from "../../Components/DeleteModal/DeleteModal";
import EditModal from "../../Components/EditModal/EditModal";

function DashAdministrator() {
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { administrators, getAllAdministrators } = useAdministratorsStore();
  const { teams, getAllTeams } = useTeamsStore();

  useEffect(() => {
    getAllAdministrators();
    getAllTeams();
  }, [getAllAdministrators, getAllTeams]);

  const handleAddAdministrator = async (formData) => {
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
      // setIsAddPopUp(false);
      setIsAddModalOpen(false);
    } catch (error) {
      console.log("Error creating administrators:", error);
    }
  };

  const handleEditAdministrator = async (formData) => {
    try {
      const response = await axiosInstance.patch(
        `/administrator/update/${formData._id}`,
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
              if (administrator._id === formData._id) {
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

      // setIsEditPopUp(false);
      setIsEditModalOpen(false);
    } catch (error) {
      console.log("Error updating administrator:", error);
    }
  };

  const handleDeleteAdministrator = async () => {
    try {
      const response = await axiosInstance.delete(
        `/administrator/delete/${selectedRowData._id}`
      );
      if (response) {
        console.log("Administrator deleted successfully:");
        useAdministratorsStore.setState((state) => ({
          administrators: state.administrators.filter(
            (administrator) => administrator._id !== selectedRowData._id
          ),
        }));
      }
      // setIsOpen(false);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.log("Error deleting administrators:", error);
    }
  };

  return (
    <>
      <div className={StyleDashAdministrators.container}>
        <button
          className={StyleDashAdministrators.add}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Administrator +
        </button>
        <Table
          data={administrators}
          isEdit={true}
          ForWhat="administrators"
          handleEditOpen={() => setIsEditModalOpen(true)}
          handleOpenDelete={() => setIsDeleteModalOpen(true)}
          setSelectedRowData={setSelectedRowData}
        />
      </div>

      <AddModal
        isOpen={isAddModalOpen}
        toggle={() => setIsAddModalOpen(false)}
        onConfirm={handleAddAdministrator}
        title="Add New Administrator"
        buttonTitle="Add Administrator"
        fields={[
          { label: "Name", id: "name", type: "text" },
          { label: "Characteristic", id: "characteristic", type: "text" },
          { label: "Team", id: "team", type: "select", options: teams },
          { label: "Image", id: "image", type: "file" },
        ]}
        // loadingAdd={loadingAddCategory}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        toggle={() => setIsDeleteModalOpen(false)}
        title="Administrator Deletion"
        body="Are you sure you want to delete this administrator?"
        onConfirm={handleDeleteAdministrator}
        // loadingDelete={loadingDelete}
      />

      <EditModal
        isOpen={isEditModalOpen}
        toggle={() => setIsEditModalOpen(false)}
        title="Edit Administrator"
        data={selectedRowData}
        onConfirm={handleEditAdministrator}
        fields={[
          { id: "name", label: "Name", type: "text" },
          { id: "characteristic", label: "Characteristic", type: "text" },
          {
            id: "team",
            label: "Team",
            type: "select",
            options: teams,
            // loading: loadingAccounts,
          },
          { id: "image", label: "Image", type: "file" },
        ]}
        // loadingUpdate={loadingUpdate}
      />
    </>
  );
}

export default DashAdministrator;
