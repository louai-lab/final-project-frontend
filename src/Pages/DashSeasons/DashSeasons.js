import { useEffect, useState } from "react";
import StyleDashSeasons from "./DashSeasons.module.css";
import { useSeasonsStore } from "../../Zustand/Store";
import Table from "../../Components/Table/Table";
import axiosInstance from "../../Utils/AxiosInstance";
import AddModal from "../../Components/AddModal/AddModal";
import EditModal from "../../Components/EditModal/EditModal";
import DeleteModal from "../../Components/DeleteModal/DeleteModal";

function DashSeasons() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const { seasons, getAllSeasons } = useSeasonsStore();

  useEffect(() => {
    getAllSeasons();
  }, [getAllSeasons]);

  const handleAddSeason = async (formData) => {
    // console.log(formData);

    try {
      const response = await axiosInstance.post("/season/add", formData);

      if (response) {
        useSeasonsStore.setState((state) => ({
          seasons: [response.data, ...state.seasons],
        }));
        console.log("Seasons created successfully:");
      }
      // setIsAddPopUp(false);
      setIsAddModalOpen(false);
    } catch (error) {
      // if (error.response && error.response.data && error.response.data.error) {
      //   setFormError(error.response.data.error);
      // } else {
      //   console.error("Error creating season:", error);
      //   setFormError("An unexpected error occurred. Please try again.");
      // }
      console.error("Error creating season:", error);
    }
  };

  const handleEditTitle = async (formData) => {
    // console.log(formData);
    // console.log(id);

    try {
      const response = await axiosInstance.patch(
        `/season/update/${formData._id}`,
        formData
      );

      if (response) {
        console.log("Season updated successfully:");
        useSeasonsStore.setState((state) => {
          const updatedSeason = state.seasons.map((season) => {
            if (season._id === formData._id) {
              return response.data;
            }
            return season;
          });
          return {
            seasons: updatedSeason,
          };
        });
      }
      // setIsEditPopUp(false);
      setIsEditModalOpen(false);
    } catch (error) {
      // if (error.response && error.response.data && error.response.data.error) {
      //   setFormErrorUpdate(error.response.data.error);
      // } else {
      //   console.error("Error creating season:", error);
      //   setFormErrorUpdate("An unexpected error occurred. Please try again.");
      // }
      console.log("Error updating season:", error);
    }
  };

  const handleDeleteSeason = async () => {
    try {
      const response = await axiosInstance.delete(
        `/season/delete/${selectedRowData._id}`
      );

      if (response) {
        console.log("Season deleted successfully:");
        useSeasonsStore.setState((state) => ({
          seasons: state.seasons.filter(
            (season) => season._id !== selectedRowData._id
          ),
        }));
      }
      // setIsOpen(false);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.log("Error deleting title:", error);
    }
  };

  return (
    <>
      <div className={StyleDashSeasons.container}>
        <button
          className={StyleDashSeasons.add}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Season +
        </button>
        <Table
          data={seasons}
          isEdit={true}
          handleEditOpen={() => setIsEditModalOpen(true)}
          handleOpenDelete={() => setIsDeleteModalOpen(true)}
          setSelectedRowData={setSelectedRowData}
        />
      </div>

      <AddModal
        isOpen={isAddModalOpen}
        toggle={() => setIsAddModalOpen(false)}
        onConfirm={handleAddSeason}
        title="Add New Team"
        buttonTitle="Add Team"
        fields={[
          // { label: "Season", id: "seasonName", type: "text" },
          { label: "First Part", id: "firstPart", type: "number" },
          { label: "Second Part", id: "secondPart", type: "number" },
        ]}
        // loadingAdd={loadingAddCategory}
      />

      <EditModal
        isOpen={isEditModalOpen}
        toggle={() => setIsEditModalOpen(false)}
        title="Edit Title"
        data={selectedRowData}
        onConfirm={handleEditTitle}
        fields={[
          // { id: "seasonName", label: "Season", type: "text" },
          { id: "firstPart", label: "First Part", type: "number" },
          { id: "secondPart", label: "Second Part", type: "number" },
        ]}
        // loadingUpdate={loadingUpdate}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        toggle={() => setIsDeleteModalOpen(false)}
        title="Season Deletion"
        body="Are you sure you want to delete this season?"
        onConfirm={handleDeleteSeason}
        // loadingDelete={loadingDelete}
      />
    </>
  );
}

export default DashSeasons;
