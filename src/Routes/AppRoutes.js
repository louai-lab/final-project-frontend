import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home/Home.js";
import Login from "../Pages/Login/Login.js";
import Matches from "../Pages/Matches/Matches.js";
import SingleMatch from "../Pages/SingleMatch/SingleMatch.js";
import NetworkError from "../Pages/NetworkError/NetworkError.js";
import ProtectedRoute from "./ProtectedRoutes.js";
import UserContext from "../Context/UserContext.js";
import DashOutlet from "./DashOutlet.js";
import DashPlayers from "../Pages/DashPlayers/DashPlayers.js";
import DashTeams from "../Pages/DashTeams/DashTeams.js";
import NotFound from "../Pages/NotFound/NotFound.js";

function AppRoutes() {
  const {user}=useContext(UserContext)
  return (
    <Routes>
      <Route path="/*" exact element={<NotFound/>}/>
      <Route path="/network_error" element={<NetworkError />} />
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute isAllowed={user}/>}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/singlematch" element={<SingleMatch />} />
      </Route>

      <Route path="/dashboard/*" exact element={<NotFound/>}/>
      <Route path="/dashboard" element={<DashOutlet/>}>
        <Route path="/dashboard/players" exact element={<DashPlayers/>}/>
        <Route path="/dashboard/teams" exact element={<DashTeams/>}/>
      </Route>

    </Routes>
  );
}

export default AppRoutes;
