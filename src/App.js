import { useEffect } from "react";
import "./App.css";
import AppRoutes from "./Routes/AppRoutes";
import { useUserStore } from "./Zustand/Store";
import { useUsersStore } from "./Zustand/Store";
import { usePlayersStore } from "./Zustand/Store";
import { useTeamsStore } from "./Zustand/Store";
import Loading from "./Pages/Loading/Loading.js";
function App() {
  const { loading, getUser } = useUserStore();
  const { getAllUsers } = useUsersStore();
  const {getAllPlayers} = usePlayersStore();
  const {getAllTeams}= useTeamsStore();

  useEffect(() => {
    getUser();
    getAllUsers();
    getAllPlayers();
    getAllTeams();
  }, []);

  return loading ? (
    <div>
      <Loading />
    </div>
  ) : (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
