import React, { useState } from "react";
import Table from "../../Components/Table/Table";
import StyleDashUsers from "./DashUsers.module.css";
import { useUsersStore } from "../../Zustand/Store";

function DashUsers() {
  const [isAddPopUp, setIsAddPopUp] = useState(false);
  const { users } = useUsersStore();
  const dataWithIds = users.map((row, index) => ({ ...row, id: index + 1 }));

  // console.log(users);
  const handleOpenPopUp = () => {
    setIsAddPopUp(true);
  };

  return (
    <>
      {isAddPopUp && (
        <>
          <div className={StyleDashUsers.addPopUp}>
            <h1>Add</h1>
          </div>
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
      <div className={StyleDashUsers.container}>
        <button className={StyleDashUsers.add} onClick={handleOpenPopUp}>
          Add An User
        </button>
        <Table data={dataWithIds} isEdit={true} ForWhat="users" />
      </div>
    </>
  );
}

export default DashUsers;
