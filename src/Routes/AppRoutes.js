import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home/Home.js";
import Login from "../Pages/Login/Login.js";
import Matches from "../Pages/Matches/Matches.js";
import SingleMatch from "../Pages/SingleMatch/SingleMatch.js";
import NetworkError from "../Pages/NetworkError/NetworkError.js";
import ProtectedRoute from "./ProtectedRoutes.js";
import { useUserStore } from "../Zustand/Store.js";
import DashOutlet from "./DashOutlet.js";
import DashPlayers from "../Pages/DashPlayers/DashPlayers.js";
import DashTeams from "../Pages/DashTeams/DashTeams.js";
import NotFound from "../Pages/NotFound/NotFound.js";
import DashUsers from "../Pages/DashUsers/DashUsers.js";

function AppRoutes() {
  const { user } = useUserStore();
  return (
    <Routes>
      <Route path="/network_error" element={<NetworkError />} />
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute isAllowed={user} />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/singlematch" element={<SingleMatch />} />
        <Route path="/notfound" element={<NotFound/>}/>
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAllowed={user && user.role === "admin"}>
            <DashOutlet />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard/users" exact element={<DashUsers />} />
        <Route path="/dashboard/players" exact element={<DashPlayers />} />
        <Route path="/dashboard/teams" exact element={<DashTeams />} />
        <Route path="/dashboard/*" exact element={<NotFound />} />
      </Route>
      <Route path="/*" exact element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
