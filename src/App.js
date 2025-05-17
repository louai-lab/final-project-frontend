import { useEffect } from "react";
import "./App.css";
import AppRoutes from "./Routes/AppRoutes";
import { useUserStore } from "./Zustand/Store";
import { useAboutUsStore } from "./Zustand/Store";
import FootballLoader from "./Pages/FootballLoader/FootballLoader.js";
import { Helmet } from "react-helmet-async";
import { HelmetProvider } from "react-helmet-async";
import FavIcon from "./Assets/icons/Lebanese_Football_Association_(LFA)_logo.svg";

function App() {
  // const { user } = useUserStore();
  // const { matches } = useMatchesStore();
  // console.log(user)

  // console.log(watcherID)
  const { loading, getUser } = useUserStore();
  // const { getAllUsers } = useUsersStore();
  // const { getAllReferees } = useUsersStore();
  // const { getAllWatchers } = useUsersStore();
  // const { getAllLinesman } = useUsersStore();
  // const { getAllPlayers } = usePlayersStore();
  // const { getAllPlayersNoTeam } = usePlayersStore();
  // const { getAllTeams } = useTeamsStore();
  // const { getAllMatches } = useMatchesStore();
  // const { getAllTitles } = useTitlesStore();
  // const { getAllSeasons } = useSeasonsStore();
  // const { getAllPitches } = usePitchesStore();
  // const { getAllAdministrators } = useAdministratorsStore();
  const { getAboutUs } = useAboutUsStore();

  // console.log(user);

  useEffect(() => {
    getUser();
    // getAllUsers();
    // getAllReferees();
    // getAllWatchers();
    // getAllLinesman();
    // getAllPlayers();
    // getAllPlayersNoTeam();
    // getAllTeams();
    // getAllMatches();
    // getAllTitles();
    // getAllSeasons();
    // getAllPitches();
    // getAllAdministrators();
    getAboutUs();
  }, [
    getUser,
    // getAllUsers,
    // getAllReferees,
    // getAllWatchers,
    // getAllLinesman,
    // getAllPlayers,
    // getAllPlayersNoTeam,
    // getAllTeams,
    // getAllMatches,
    // getAllTitles,
    // getAllSeasons,
    // getAllPitches,
    // getAllAdministrators,
    getAboutUs,
  ]);

  // console.log(user)
  // console.log(matches)

  return loading ? (
    <div>
      <FootballLoader />
    </div>
  ) : (
    <div className="App">
      <HelmetProvider>
        <Helmet>
          <link rel="shortcut icon" href={FavIcon} type="image/x-icon" />
          <title>Lebanese Football Association in The North</title>
        </Helmet>
        <AppRoutes />
      </HelmetProvider>
    </div>
  );
}

export default App;
