import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home/Home.js";
import Login from "../Pages/Login/Login.js";
import Matches from "../Pages/Matches/Matches.js";
import SingleMatch from "../Pages/SingleMatch/SingleMatch.js";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/singlematch" element={<SingleMatch />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
