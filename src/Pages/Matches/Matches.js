import React from "react";
import StyleMatches from "./Matches.module.css";
import { useMatchesStore } from "../../Zustand/Store";
import logo from "../../Assets/icons/Lebanese_Football_Association_(LFA)_logo.svg";
import StadiumIcon from "@mui/icons-material/Stadium";

function Matches() {
  const { lastMatch } = useMatchesStore();
  const { matches } = useMatchesStore();
  // console.log(matches)
  // console.log(lastMatch.team_a.team.image);

  return (
    <main className={StyleMatches.matchesContainer}>
      <article className={StyleMatches.matchesHeroSection}>
        <section className={StyleMatches.lastMatch}>
          <img
            src={logo}
            width={100}
            height={80}
            alt="Lebanese Football Association"
          />
          <p>{lastMatch.title}</p>
        </section>
        <section className={StyleMatches.twoTeams}>
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
        </section>
        <section className={StyleMatches.stadium}>
          <StadiumIcon />
          <p>{lastMatch.pitch}</p>
        </section>
      </article>

      <article className={StyleMatches.middle}>
        <h1>ALL Matches</h1>
      </article>

      <article className={StyleMatches.cardsContainer}>
        {matches.map((match) => {
          return (
            <article key={match._id} className={StyleMatches.cardMatch}>
              <section className={StyleMatches.cardImages}>
                <img
                  src={`${process.env.REACT_APP_IMAGE_PATH}/${match.team_a?.team.image}`}
                  alt={match.team_a?.team.name}
                  className={StyleMatches.cardImage}
                />
                <span>VS</span>
                <img
                  src={`${process.env.REACT_APP_IMAGE_PATH}/${match.team_b?.team.image}`}
                  alt={match.team_b?.team.name}
                  className={StyleMatches.cardImage}
                />
              </section>

              <section className={StyleMatches.cardTitle}>
                {match.title}
              </section>

              <section className={StyleMatches.oneTeamScore}>
                <p>{match.team_a?.team.name}</p>
                <p>{match.team_a?.score}</p>
              </section>
              <section className={StyleMatches.oneTeamScore}>
                <p>{match.team_b?.team.name}</p>
                <p>{match.team_b?.score}</p>
              </section>
            </article>
          );
        })}
      </article>
    </main>
  );
}

export default Matches;
