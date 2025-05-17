import { useTitlesStore } from "../../Zustand/Store";
import Table from "../../Components/Table/Table";
import StyleDashTitles from "./DashTitles.module.css";
import { useEffect, useState } from "react";
import axiosInstance from "../../Utils/AxiosInstance";
import DeleteModal from "../../Components/DeleteModal/DeleteModal";
import AddModal from "../../Components/AddModal/AddModal";
import EditModal from "../../Components/EditModal/EditModal";

function DashTitles() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const { titles, getAllTitles } = useTitlesStore();

  useEffect(() => {
    getAllTitles();
  }, [getAllTitles]);

  const handleAddTitle = async (formData) => {
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
      // setIsAddPopUp(false);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleEditTitle = async (formData) => {
    try {
      const response = await axiosInstance.patch(
        `/title/update/${formData._id}`,
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
            if (title._id === formData._id) {
              return response.data;
            }
            return title;
          });
          return {
            titles: updatedTitle,
          };
        });
      }
      // setIsEditPopUp(false);
      setIsEditModalOpen(false);
    } catch (error) {
      console.log("Error updating title:", error);
    }
  };

  const handleDeleteTitle = async () => {
    // console.log(id);
    try {
      const response = await axiosInstance.delete(
        `/title/delete/${selectedRowData._id}`
      );

      if (response) {
        console.log("Title deleted successfully:");
        useTitlesStore.setState((state) => ({
          titles: state.titles.filter(
            (title) => title._id !== selectedRowData._id
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
      <div className={StyleDashTitles.container}>
        <button
          className={StyleDashTitles.add}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Title +
        </button>
        <Table
          data={titles}
          isEdit={true}
          ForWhat="titles"
          handleEditOpen={() => setIsEditModalOpen(true)}
          handleOpenDelete={() => setIsDeleteModalOpen(true)}
          setSelectedRowData={setSelectedRowData}
        />
      </div>

      <AddModal
        isOpen={isAddModalOpen}
        toggle={() => setIsAddModalOpen(false)}
        onConfirm={handleAddTitle}
        title="Add New Title"
        buttonTitle="Add Title"
        fields={[
          { label: "Name", id: "name", type: "text" },
          { label: "Image", id: "image", type: "file" },
        ]}
        // loadingAdd={loadingAddCategory}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        toggle={() => setIsDeleteModalOpen(false)}
        title="Title Deletion"
        body="Are you sure you want to delete this title?"
        onConfirm={handleDeleteTitle}
        // loadingDelete={loadingDelete}
      />

      <EditModal
        isOpen={isEditModalOpen}
        toggle={() => setIsEditModalOpen(false)}
        title="Edit Title"
        data={selectedRowData}
        onConfirm={handleEditTitle}
        fields={[
          { id: "name", label: "Name", type: "text" },
          { id: "image", label: "Image", type: "file" },
        ]}
        // loadingUpdate={loadingUpdate}
      />
    </>
  );
}

export default DashTitles;
