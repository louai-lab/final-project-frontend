import React from "react";
import { Outlet } from "react-router-dom";
import DashSidebar from "../Layouts/DashSidebar/DashSidebar";

function DashOutlet() {
  return (
    <>
      <DashSidebar />
      <Outlet/>
    </>
  );
}

export default DashOutlet;
