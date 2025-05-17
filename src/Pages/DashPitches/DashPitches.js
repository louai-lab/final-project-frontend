import { useEffect, useState } from "react";
import Table from "../../Components/Table/Table";
import { usePitchesStore } from "../../Zustand/Store";
import StyleDashPitches from "./DashPitches.module.css";
import axiosInstance from "../../Utils/AxiosInstance";
import AddModal from "../../Components/AddModal/AddModal";
import EditModal from "../../Components/EditModal/EditModal";
import DeleteModal from "../../Components/DeleteModal/DeleteModal";

function DashPitches() {
  const { pitches, getAllPitches } = usePitchesStore();

  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    getAllPitches();
  }, [getAllPitches]);

  const handleAddPitch = async (formData) => {
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
      // setIsAddPopUp(false);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleEditPitch = async (formData) => {
    try {
      const response = await axiosInstance.patch(
        `/pitch/update/${formData._id}`,
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
            if (pitch._id === formData._id) {
              return response.data;
            }
            return pitch;
          });
          return {
            pitches: updatedPitch,
          };
        });
      }
      // setIsEditPopUp(false);
      setIsEditModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePitch = async () => {
    // console.log(id);
    try {
      const response = await axiosInstance.delete(
        `/pitch/delete/${selectedRowData._id}`
      );

      if (response) {
        console.log("Pitch deleted successfully:");
        usePitchesStore.setState((state) => ({
          pitches: state.pitches.filter(
            (pitch) => pitch._id !== selectedRowData._id
          ),
        }));
      }
      // setIsOpen(false);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.log("Error deleting pitch:", error);
    }
  };

  return (
    <>
      <div className={StyleDashPitches.container}>
        <button
          className={StyleDashPitches.add}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Pitch +
        </button>
        <Table
          data={pitches}
          isEdit={true}
          ForWhat="pitches"
          handleEditOpen={() => setIsEditModalOpen(true)}
          handleOpenDelete={() => setIsDeleteModalOpen(true)}
          setSelectedRowData={setSelectedRowData}
        />
      </div>

      <AddModal
        isOpen={isAddModalOpen}
        toggle={() => setIsAddModalOpen(false)}
        onConfirm={handleAddPitch}
        title="Add New Pitch"
        buttonTitle="Add Pitch"
        fields={[
          { label: "Name", id: "name", type: "text" },
          { label: "Location", id: "location", type: "text" },
          { label: "Image", id: "image", type: "file" },
        ]}
        // loadingAdd={loadingAddCategory}
      />

      <EditModal
        isOpen={isEditModalOpen}
        toggle={() => setIsEditModalOpen(false)}
        title="Edit Pitch"
        data={selectedRowData}
        onConfirm={handleEditPitch}
        fields={[
          { id: "name", label: "Name", type: "text" },
          { id: "location", label: "Location", type: "text" },
          { id: "image", label: "Image", type: "file" },
        ]}
        // loadingUpdate={loadingUpdate}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        toggle={() => setIsDeleteModalOpen(false)}
        title="Pitch Deletion"
        body="Are you sure you want to delete this pitch?"
        onConfirm={handleDeletePitch}
        // loadingDelete={loadingDelete}
      />
    </>
  );
}

export default DashPitches;
