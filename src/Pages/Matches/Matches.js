import React from "react";
import StyleMatches from "./Matches.module.css";
import { useMatchesStore } from "../../Zustand/Store";
import logo from "../../Assets/icons/Lebanese_Football_Association_(LFA)_logo.svg";
import StadiumIcon from '@mui/icons-material/Stadium';

function Matches() {
  const { lastMatch } = useMatchesStore();
  // console.log(lastMatch.team_a.team.image);

  return (
    <div className={StyleMatches.matchesContainer}>
      <div className={StyleMatches.matchesHeroSection}>
        <div className={StyleMatches.lastMatch}>
          <img
            src={logo}
            width={100}
            height={80}
            alt="Lebanese Football Association"
          />
          <p>{lastMatch.title}</p>
        </div>
        <div className={StyleMatches.twoTeams}>
          <img
            src={`${process.env.REACT_APP_IMAGE_PATH}/${lastMatch.team_a?.team.image}`}
            alt={lastMatch.team_a?.team.name}
            className={StyleMatches.teamsImage}
          />
          <div className={StyleMatches.teamsName}>
            <p>{lastMatch.team_a?.team.name}</p>
            <p>{lastMatch.team_b?.team.name}</p>
          </div>
          <img
            src={`${process.env.REACT_APP_IMAGE_PATH}/${lastMatch.team_b?.team.image}`}
            alt={lastMatch.team_b?.team.name}
            className={StyleMatches.teamsImage}
          />
        </div>
        <div className={StyleMatches.stadium}>
          <StadiumIcon/>
          <p>{lastMatch.pitch}</p>
        </div>
      </div>
    </div>
  );
}

export default Matches;
