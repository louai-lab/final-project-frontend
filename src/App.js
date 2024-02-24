import { useEffect } from "react";
import "./App.css";
import AppRoutes from "./Routes/AppRoutes";
import { useUserStore } from "./Zustand/Store";
import { useUsersStore } from "./Zustand/Store";
import { usePlayersStore } from "./Zustand/Store";
import { useTeamsStore } from "./Zustand/Store";
import { useMatchesStore } from "./Zustand/Store";
// import Loading from "./Pages/Loading/Loading.js";
import FootballLoader from "./Pages/FootballLoader/FootballLoader.js";

function App() {
  const { user } = useUserStore();
  // console.log(user)

  // console.log(watcherID)
  const { loading, getUser } = useUserStore();
  const { getAllUsers } = useUsersStore();
  const { getAllReferees } = useUsersStore();
  const { getAllWatchers } = useUsersStore();
  const { getAllLinesman } = useUsersStore();
  const { getAllPlayers } = usePlayersStore();
  const { getAllPlayersNoTeam } = usePlayersStore();
  const { getAllTeams } = useTeamsStore();
  const { getAllMatches } = useMatchesStore();
  const { getAllMatchesByWatcher } = useMatchesStore();
  const { getAllMatchesByReferee } = useMatchesStore();
  const { getLastMatch } = useMatchesStore();
  const { getLastMatchByWatcher } = useMatchesStore();
  const { getLastMatchByReferee } = useMatchesStore();

  // console.log(user);
  useEffect(() => {
    // console.log('enter useefect' , user)
    getUser();
    getAllUsers();
    getAllReferees();
    getAllWatchers();
    getAllLinesman();
    getAllPlayers();
    getAllPlayersNoTeam();
    getAllTeams();
    getAllMatches();
    getLastMatch();

    getAllMatchesByWatcher();
    getLastMatchByWatcher();

    getAllMatchesByReferee();
    getLastMatchByReferee();
  }, []);

  return loading ? (
    <div>
      <FootballLoader />
    </div>
  ) : (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
