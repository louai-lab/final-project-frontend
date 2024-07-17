import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import StyleDashOverview from "./DashOverview.module.css";
import DashCard from "../../Components/DashCard/DashCard";
import { useUsersStore } from "../../Zustand/Store";
import { FaUserFriends } from "react-icons/fa";
import { useTeamsStore } from "../../Zustand/Store";
import { BsMicrosoftTeams } from "react-icons/bs";
import { usePlayersStore } from "../../Zustand/Store";
import { GiBabyfootPlayers } from "react-icons/gi";
import { useTitlesStore } from "../../Zustand/Store";
import { MdEmojiEvents } from "react-icons/md";
import { usePitchesStore } from "../../Zustand/Store";
import { MdOutlineStadium } from "react-icons/md";
import { useAdministratorsStore } from "../../Zustand/Store";
import { GrUserManager } from "react-icons/gr";
import PieColor from "../../Components/PieColor/PieColor";
import BarColor from "../../Components/BarColor/BarColor";

function DashOverview() {
  const { userCount } = useUsersStore();
  const { teamCount } = useTeamsStore();
  const { totalPlayersCount } = usePlayersStore();
  const { titleCount } = useTitlesStore();
  const { pitchCount } = usePitchesStore();
  const { administratorsCount } = useAdministratorsStore();

  return (
    <div className={StyleDashOverview.container}>
      <Typography
        variant="h1"
        component="h1"
        sx={{
          fontSize: "2rem",
          fontWeight: "bold",
        }}
      >
        Analytics Overview
      </Typography>

      <div className={StyleDashOverview.dashCardContainer}>
        <DashCard title="Total Users" number={userCount} icon={FaUserFriends} />
        <DashCard
          title="Total Teams"
          number={teamCount}
          icon={BsMicrosoftTeams}
        />
        <DashCard
          title="Total Players"
          number={totalPlayersCount}
          icon={GiBabyfootPlayers}
        />
        <DashCard
          title="Total Titles"
          number={titleCount}
          icon={MdEmojiEvents}
        />
        <DashCard
          title="Total Pitches"
          number={pitchCount}
          icon={MdOutlineStadium}
        />
        <DashCard
          title="Total Administrators"
          number={administratorsCount}
          icon={GrUserManager}
        />
      </div>

      <BarColor />

      <PieColor />
    </div>
  );
}

export default DashOverview;
