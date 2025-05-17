import { useEffect, useState } from "react";
import Table from "../../Components/Table/Table";
import { usePlayersStore, useTeamsStore } from "../../Zustand/Store";
import StyleDashTeams from "./DashTeams.module.css";
import axiosInstance from "../../Utils/AxiosInstance";
import DeleteModal from "../../Components/DeleteModal/DeleteModal";
import AddModal from "../../Components/AddModal/AddModal";
import EditModal from "../../Components/EditModal/EditModal";

function DashTeams() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const { teams, getAllTeams } = useTeamsStore();
  const { playersNoTeam, getAllPlayersNoTeam } = usePlayersStore();

  useEffect(() => {
    getAllTeams();
    getAllPlayersNoTeam();
  }, [getAllTeams, getAllPlayersNoTeam]);

  // console.log(teams)

  const handleAddTeam = async (formData) => {
    console.log("formData", formData);
    try {
      const playerIds = formData.playersIds.map((player) => player._id);

      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("image", formData.image);
      formDataToSend.append("playersIds", playerIds);

      // console.log(formData);

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
        console.log("Team created successfully:");
      }
      // setIsAddPopUp(false);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleDeleteTeam = async () => {
    try {
      const response = await axiosInstance.delete(
        `/team/delete/${selectedRowData._id}`
      );
      if (response) {
        console.log("Team deleted successfully:");
        useTeamsStore.setState((state) => ({
          teams: state.teams.filter((team) => team._id !== selectedRowData._id),
        }));
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.log("Error deleting team:", error);
    }
  };

  const handleEditTeam = async (formData) => {
    try {
      const response = await axiosInstance.patch(
        `/team/update/${formData._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response) {
        console.log("Team updated successfully:");
        useTeamsStore.setState((state) => {
          const updatedTeams = state.teams.map((team) => {
            if (team._id === formData._id) {
              return response.data;
            }
            return team;
          });
          return {
            teams: updatedTeams,
          };
        });
      }
      // setIsEditPopUp(false);
      setIsEditModalOpen(false);
    } catch (error) {
      console.log("Error updating team:", error);
    }
  };

  return (
    <>
      <div className={StyleDashTeams.container}>
        <button
          className={StyleDashTeams.add}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Team +
        </button>
        <Table
          data={teams}
          isEdit={true}
          ForWhat="teams"
          handleEditOpen={() => setIsEditModalOpen(true)}
          handleOpenDelete={() => setIsDeleteModalOpen(true)}
          setSelectedRowData={setSelectedRowData}
        />
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        toggle={() => setIsDeleteModalOpen(false)}
        title="Team Deletion"
        body="Are you sure you want to delete this team?"
        onConfirm={handleDeleteTeam}
        // loadingDelete={loadingDelete}
      />

      <AddModal
        isOpen={isAddModalOpen}
        toggle={() => setIsAddModalOpen(false)}
        onConfirm={handleAddTeam}
        title="Add New Team"
        buttonTitle="Add Team"
        fields={[
          { label: "Name", id: "name", type: "text" },
          {
            label: "Players",
            id: "playersIds",
            type: "select",
            options: playersNoTeam,
            isMulti: true,
          },
          { label: "Image", id: "image", type: "file" },
        ]}
        // loadingAdd={loadingAddCategory}
      />

      <EditModal
        isOpen={isEditModalOpen}
        toggle={() => setIsEditModalOpen(false)}
        title="Edit Team"
        data={selectedRowData}
        onConfirm={handleEditTeam}
        fields={[
          { id: "name", label: "Name", type: "text" },
          { id: "image", label: "Image", type: "file" },
        ]}
        // loadingUpdate={loadingUpdate}
      />
    </>
  );
}

export default DashTeams;
