import React from "react";
import StyleMatches from "./Matches.module.css";
import { useMatchesStore } from "../../Zustand/Store";
import logo from "../../Assets/icons/Lebanese_Football_Association_(LFA)_logo.svg";
import StadiumIcon from "@mui/icons-material/Stadium";
import { Reveal } from "../../Frammotion/RevealAnimation";

function Matches() {
  const { lastMatch } = useMatchesStore();
  const { matches } = useMatchesStore();
  const { lastMatchByWatcher } = useMatchesStore();
  console.log(lastMatchByWatcher);
  // console.log(matches);
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
            <Reveal>
              <article key={match._id} className={StyleMatches.cardMatch}>
                <article className={StyleMatches.aboveHr}>
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

                  <section>
                    <section className={StyleMatches.oneTeamScore}>
                      <p>{match.team_a?.team.name}</p>
                      <p
                        style={{
                          fontWeight:
                            match.team_a?.score > match.team_b?.score
                              ? "bold"
                              : "normal",
                        }}
                      >
                        {match.team_a?.score}
                      </p>
                    </section>
                    <section className={StyleMatches.oneTeamScore}>
                      <p>{match.team_b?.team.name}</p>
                      <p
                        style={{
                          fontWeight:
                            match.team_b?.score > match.team_a?.score
                              ? "bold"
                              : "normal",
                        }}
                      >
                        {match.team_b?.score}
                      </p>
                    </section>
                  </section>
                </article>
                <hr className={StyleMatches.horizontalLine} />
                <section className={StyleMatches.employees}>
                  <img
                    src={`${process.env.REACT_APP_IMAGE_PATH}/${match.watcher?.image}`}
                    alt={match.team_b?.team.name}
                    className={StyleMatches.imageEmployees}
                  />
                  <img
                    src={`${process.env.REACT_APP_IMAGE_PATH}/${match.referee?.image}`}
                    alt={match.team_b?.team.name}
                    className={StyleMatches.imageEmployees}
                    style={{ marginLeft: "-5px" }}
                  />
                </section>
              </article>
            </Reveal>
          );
        })}
      </article>
    </main>
  );
}

export default Matches;
