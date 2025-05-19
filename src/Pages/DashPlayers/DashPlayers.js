import { useEffect, useMemo, useState } from "react";
import StyleDashPlayers from "./DashPlayers.module.css";
import { usePlayersStore } from "../../Zustand/Store.js";
import Table from "../../Components/Table/Table.js";
import axiosInstance from "../../Utils/AxiosInstance.js";
import { useTeamsStore } from "../../Zustand/Store.js";
import AddModal from "../../Components/AddModal/AddModal.js";
import FormatDate from "../../Utils/FormatDate.js";
import DeleteModal from "../../Components/DeleteModal/DeleteModal.js";
import EditModal from "../../Components/EditModal/EditModal.js";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

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

  const columns = useMemo(
    () => [
      {
        headerName: "Name",
        field: "name",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Image",
        field: "image",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150,
        // valueGetter: (params) => params.data.team?.name || "No Team",
        cellRenderer: (params) => {
          return (
            <img
              src={`${process.env.REACT_APP_IMAGE_PATH}/${params.data.image}`}
              alt="Player"
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
          );
        },
      },
      {
        headerName: "T-shirt Number",
        field: "tShirtNumber",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Team",
        field: "team",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150,
        valueGetter: (params) => params.data.team?.name || "No Team",
      },
      {
        headerName: "Id Card",
        field: "idCard",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Mother Name",
        field: "motherName",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Actions",
        field: "actions",
        minWidth: 200,
        sortable: false,
        filter: false,
        cellRenderer: (params) => (
          <div className="d-flex gap-2 align-items-center h-100">
            <button
              className="btn btn-warning"
              // onClick={() => handleEditClick(params?.data)}
              onClick={() => {
                setSelectedRowData(params?.data);
                setIsEditModalOpen(true);
              }}
            >
              <i
                className="uil uil-pen font-size-18 text-white"
                id="edittooltip"
              />{" "}
              <span className="text-white">Edit</span>
            </button>
            <button
              className="btn btn-danger"
              // onClick={() =>  handleDeleteClick(params?.data)}
              onClick={() => {
                setSelectedRowData(params?.data);
                setIsDeleteModalOpen(true);
              }}
              style={{ backgroundColor: "var(--primary-clr)" }}
            >
              <i
                className="uil uil-trash-alt font-size-18"
                id="deletetooltip"
              />{" "}
              <span className="text-white">Delete</span>
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // console.log("players", players);
  return (
    <>
      <div className={StyleDashPlayers.container}>
        <button
          className={StyleDashPlayers.add}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Player +
        </button>

        <div style={{ height: "calc(100vh - 270px)" }}>
          <AgGridReact
            rowData={players}
            columnDefs={columns}
            rowHeight={50}
            pagination={true}
            paginationPageSize={50}
            domLayout="normal"
            paginationPageSizeSelector={[50, 100, 200]}
            suppressPaginationPanel={false}
          />
        </div>
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
