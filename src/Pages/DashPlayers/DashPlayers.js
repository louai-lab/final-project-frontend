import { useEffect, useState } from "react";
import StyleDashPlayers from "./DashPlayers.module.css";
import { usePlayersStore } from "../../Zustand/Store.js";
import Table from "../../Components/Table/Table.js";
import axiosInstance from "../../Utils/AxiosInstance.js";
import { useTeamsStore } from "../../Zustand/Store.js";
import AddModal from "../../Components/AddModal/AddModal.js";
import FormatDate from "../../Utils/FormatDate.js";
import DeleteModal from "../../Components/DeleteModal/DeleteModal.js";
import EditModal from "../../Components/EditModal/EditModal.js";

function DashPlayers() {
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { players } = usePlayersStore();
  const { teams, getAllTeams } = useTeamsStore();

  useEffect(() => {
    getAllTeams();
  }, [getAllTeams]);

  const handleDeletePlayer = async () => {
    try {
      const response = await axiosInstance.delete(
        `/player/delete/${selectedRowData._id}`
      );
      if (response) {
        console.log("Player deleted successfully:");
        usePlayersStore.setState((state) => ({
          players: state.players.filter(
            (player) => player._id !== selectedRowData._id
          ),
        }));
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.log("Error deleting player:", error);
    }
  };

  const handleAddPlayer = async (data) => {
    try {
      data = {
        ...data,
        team: data?.team?._id,
        dateOfBirth: FormatDate(data?.dateOfBirth),
      };

      // console.log(data);

      const response = await axiosInstance.post("/player/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response) {
        usePlayersStore.setState((state) => ({
          players: [response.data, ...state.players],
        }));
        console.log("Player created successfully:");
      }

      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error creating player:", error);
    }
  };

  const handleEditPlayer = async (data) => {
    // console.log(data);

    try {
      const response = await axiosInstance.patch(
        `/player/update/${data?._id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response) {
        console.log("Player updated successfully:");
        usePlayersStore.setState((state) => {
          const updatedPlayers = state.players.map((player) => {
            if (player._id === data?._id) {
              return response.data;
            }
            return player;
          });

          return {
            players: updatedPlayers,
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
          console.log("Player has no team");
        }
      }

      setIsEditModalOpen(false);
    } catch (error) {
      console.log("Error updating player:", error);
    }
  };

  return (
    <>
      <div className={StyleDashPlayers.container}>
        <button
          className={StyleDashPlayers.add}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Player +
        </button>
        <Table
          data={players}
          isEdit={true}
          ForWhat="players"
          handleEditOpen={() => setIsEditModalOpen(true)}
          handleOpenDelete={() => setIsDeleteModalOpen(true)}
          setSelectedRowData={setSelectedRowData}
        />
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        toggle={() => setIsDeleteModalOpen(false)}
        title="Player Deletion"
        body="Are you sure you want to delete this player?"
        onConfirm={handleDeletePlayer}
        // loadingDelete={loadingDelete}
      />

      <AddModal
        isOpen={isAddModalOpen}
        toggle={() => setIsAddModalOpen(false)}
        onConfirm={handleAddPlayer}
        title="Add New Player"
        buttonTitle="Add Player"
        fields={[
          { label: "Name", id: "name", type: "text" },
          { label: "Tshirt Number", id: "tShirtNumber", type: "number" },
          { label: "Team", id: "team", type: "select", options: teams },
          { label: "ID Card", id: "idCard", type: "number" },
          {
            label: "Date of Birth",
            id: "dateOfBirth",
            type: "date",
            defaultValue: new Date(),
          },
          { label: "Image", id: "image", type: "file" },
          { label: "Mother Name", id: "motherName", type: "text" },
        ]}
        // loadingAdd={loadingAddCategory}
      />

      <EditModal
        isOpen={isEditModalOpen}
        toggle={() => setIsEditModalOpen(false)}
        title="Edit Player"
        data={selectedRowData}
        onConfirm={handleEditPlayer}
        fields={[
          { id: "name", label: "Name", type: "text" },
          { id: "tShirtNumber", label: "Tshirt Number", type: "number" },
          {
            id: "team",
            label: "Team",
            type: "select",
            options: teams,
            // loading: loadingAccounts,
          },
          { id: "idCard", label: "ID Card", type: "number" },
          { id: "image", label: "Image", type: "file" },
          { id: "motherName", label: "Mother Name", type: "text" },
        ]}
        // loadingUpdate={loadingUpdate}
      />
    </>
  );
}

export default DashPlayers;
