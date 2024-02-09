import React from "react";
import { Outlet } from "react-router-dom";
// import DashSidebar from "../Layouts/DashSidebar/DashSidebar";
import DashSidebar from "../Layouts/DashSidebar/DashSidebar/DashSidebar.js";

function DashOutlet() {
  return (
    <>
      <DashSidebar />
      <Outlet/>
    </>
  );
}

export default DashOutlet;
