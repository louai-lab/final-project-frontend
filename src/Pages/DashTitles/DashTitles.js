import { useTitlesStore } from "../../Zustand/Store";
import Table from "../../Components/Table/Table";
import StyleDashTitles from "./DashTitles.module.css";

function DashTitles() {
  const { titles } = useTitlesStore();
  return (
    <>
      <div className={StyleDashTitles.container}>
        <button className={StyleDashTitles.add}>
          Add Title
        </button>
        <Table
          data={titles}
          isEdit={true}
          ForWhat="titles"
        //   handleEditOpen={handleEditOpen}
        //   handleOpenDelete={handleOpen}
        //   setSelectedRowData={setSelectedRowData}
        />
      </div>
    </>
  );
}

export default DashTitles;
