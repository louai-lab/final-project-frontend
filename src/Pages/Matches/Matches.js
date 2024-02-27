import React, { useEffect, useState } from "react";
import StyleMatches from "./Matches.module.css";
import { useMatchesStore } from "../../Zustand/Store";
import { useUserStore } from "../../Zustand/Store";
import { useTeamsStore } from "../../Zustand/Store";
import logo from "../../Assets/icons/Lebanese_Football_Association_(LFA)_logo.svg";
import StadiumIcon from "@mui/icons-material/Stadium";
import { Reveal } from "../../Frammotion/RevealAnimation";
import FootballLoader from "../FootballLoader/FootballLoader";
import { useNavigate } from "react-router-dom";
import iconFilter from "../../Assets/icons/ion--filter (1).svg";
import Filter from "../../Components/Filter/Filter";

function Matches() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { lastMatch } = useMatchesStore();
  const { getAllTeams } = useTeamsStore();
  const { getAllMatches } = useMatchesStore();
  const { getLastMatch } = useMatchesStore();
  const [popUpFilter, setPopUpFilter] = useState(false);
  const { updateSelectedTeamId } = useTeamsStore();

  useEffect(() => {
    getAllTeams();
    getAllMatches();
    getLastMatch();
  }, []);

  const { loading, matches } = useMatchesStore();

  const handleMatchClick = (match) => {
    if (match && match._id) {
      navigate(`/match`, { state: { match } });
    } else {
      console.error("Match object is undefined or missing properties.");
    }
  };

  const openPopUpFilter = () => {
    setPopUpFilter(true);
    document.body.style.overflow = "hidden";
  };

  const closePopUpFilter = () => {
    setPopUpFilter(false);
    document.body.style.overflow = "auto";
  };

  const handleOpenFilter = (e) => {
    e.preventDefault();
    openPopUpFilter();
  };

  const handleCloseFilter = (e) => {
    e.preventDefault();
    closePopUpFilter();
  };

  const handleApply = (teamId) => {
    // console.log(teamId);
    updateSelectedTeamId(teamId)
  };

  return (
    <>
      {loading ? (
        <div>
          <FootballLoader />
        </div>
      ) : (
        <>
          {popUpFilter && (
            <>
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100vh",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 1002,
                }}
                onClick={handleCloseFilter}
              ></div>
              <Filter
                handleCloseFilter={handleCloseFilter}
                handleApply={handleApply}
              />
              <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1003,
                }}
              ></div>
            </>
          )}
          <main className={StyleMatches.matchesContainer}>
            <article className={StyleMatches.matchesHeroSection}>
              <section className={StyleMatches.lastMatch}>
                <img
                  src={logo}
                  width={80}
                  height={60}
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
              <span className={StyleMatches.blur}></span>
            </article>

            {loading ? "" : <p className={StyleMatches.vs}>VS</p>}

            <article className={StyleMatches.middle}>
              <h1>Fixtures & results</h1>
              <button
                onClick={handleOpenFilter}
                type="button"
                className={`${StyleMatches.Filter} ${StyleMatches.CancelTransition}`}
              >
                <p>Filter</p>
                <img src={iconFilter} alt="" />
              </button>
            </article>

            <article className={StyleMatches.cardsContainer}>
              {loading ? (
                <div>
                  <FootballLoader />
                </div>
              ) : (
                <>
                  {matches.map((match) => {
                    return (
                      <Reveal key={match._id}>
                        <button
                          className={`${StyleMatches.navigate} ${StyleMatches.buttonReset}`}
                          onClick={() => handleMatchClick(match)}
                        >
                          <article
                            key={match._id}
                            className={StyleMatches.cardMatch}
                          >
                            <article className={StyleMatches.aboveHr}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <section className={StyleMatches.cardImages}>
                                  <img
                                    src={`${process.env.REACT_APP_IMAGE_PATH}/${match.team_a?.team.image}`}
                                    alt={match.team_a?.team.name}
                                    className={StyleMatches.cardImage}
                                  />
                                  <span>vs</span>
                                  <img
                                    src={`${process.env.REACT_APP_IMAGE_PATH}/${match.team_b?.team.image}`}
                                    alt={match.team_b?.team.name}
                                    className={StyleMatches.cardImage}
                                  />
                                </section>
                                <p
                                  className={
                                    match.played
                                      ? StyleMatches.playedRed
                                      : StyleMatches.playedGreen
                                  }
                                >
                                  {match.played === true ? (
                                    "FT"
                                  ) : (
                                    <>
                                      <div>
                                        {new Date(
                                          match.match_date
                                        ).toLocaleDateString("en-US", {
                                          timeZone: "UTC",
                                          year: "numeric",
                                          month: "numeric",
                                          day: "numeric",
                                        })}
                                      </div>
                                      <div>
                                        {new Date(
                                          match.match_date
                                        ).toLocaleTimeString("en-US", {
                                          timeZone: "UTC",
                                          hour: "numeric",
                                          minute: "numeric",
                                        })}
                                      </div>
                                    </>
                                  )}
                                </p>
                              </div>

                              <section className={StyleMatches.cardTitle}>
                                {match.title}
                              </section>

                              <section>
                                <section className={StyleMatches.oneTeamScore}>
                                  <p
                                    style={{
                                      fontWeight:
                                        match.team_a?.score >
                                        match.team_b?.score
                                          ? "bold"
                                          : "normal",

                                      color:
                                        match.team_a?.score >
                                        match.team_b?.score
                                          ? "white"
                                          : "grey",
                                    }}
                                  >
                                    {match.team_a?.team.name}
                                  </p>
                                  <p
                                    style={{
                                      fontWeight:
                                        match.team_a?.score >
                                        match.team_b?.score
                                          ? "bold"
                                          : "normal",
                                      color:
                                        match.team_a?.score >
                                        match.team_b?.score
                                          ? "white"
                                          : "grey",
                                    }}
                                  >
                                    {match.team_a?.score}
                                  </p>
                                </section>
                                <section className={StyleMatches.oneTeamScore}>
                                  <p
                                    style={{
                                      fontWeight:
                                        match.team_b?.score >
                                        match.team_a?.score
                                          ? "bold"
                                          : "normal",
                                      color:
                                        match.team_b?.score >
                                        match.team_a?.score
                                          ? "white"
                                          : "grey",
                                    }}
                                  >
                                    {match.team_b?.team.name}
                                  </p>
                                  <p
                                    style={{
                                      fontWeight:
                                        match.team_b?.score >
                                        match.team_a?.score
                                          ? "bold"
                                          : "normal",

                                      color:
                                        match.team_b?.score >
                                        match.team_a?.score
                                          ? "white"
                                          : "grey",
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
                        </button>
                      </Reveal>
                    );
                  })}
                </>
              )}
            </article>
          </main>
        </>
      )}
    </>
  );
}

export default Matches;
