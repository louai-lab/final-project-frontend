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
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

function Matches() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { lastMatch } = useMatchesStore();
  const { getAllTeams } = useTeamsStore();
  const { getAllMatches } = useMatchesStore();
  const { getLastMatch } = useMatchesStore();
  const [popUpFilter, setPopUpFilter] = useState(false);
  const { selectedTeamId, updateSelectedTeamId } = useMatchesStore();
  const { selectedPageNumber, updateSelectedPageNumber } = useMatchesStore();
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getAllTeams();
    getAllMatches(selectedTeamId);
    getAllMatches(selectedPageNumber);
    getLastMatch();
  }, [
    getAllTeams,
    getAllMatches,
    getLastMatch,
    selectedTeamId,
    selectedPageNumber,
  ]);

  const { loading, matches } = useMatchesStore();

  const handleApply = (teamId) => {
    updateSelectedTeamId(teamId);
    closePopUpFilter();
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentMatches = matches.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // console.log(value)
    updateSelectedPageNumber(value);
  };

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

  // console.log(matches)

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
              <div className={StyleMatches.bchh}>
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
                    <span className={StyleMatches.vs}>VS</span>
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
              </div>
            </article>

            {/* {loading ? "" : <p className={StyleMatches.vs}>VS</p>} */}

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

            <div className={StyleMatches.matchPagination}>
              <article className={StyleMatches.cardsContainer}>
                {loading ? (
                  <div>
                    <FootballLoader />
                  </div>
                ) : (
                  <>
                    {currentMatches.length === 0 ? (
                      <h1>No Matches Found</h1>
                    ) : (
                      currentMatches.map((match) => {
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
                                    <section
                                      className={StyleMatches.cardImages}
                                    >
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
                                              `2000-01-01T${match.match_time}:00Z`
                                            ).toLocaleTimeString("en-US", {
                                              timeZone: "UTC",
                                              hour: "numeric",
                                              minute: "numeric",
                                              hour12: true,
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
                                    <section
                                      className={StyleMatches.oneTeamScore}
                                    >
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
                                    <section
                                      className={StyleMatches.oneTeamScore}
                                    >
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
                      })
                    )}
                  </>
                )}
              </article>
              <article className={StyleMatches.pagination}>
                <Stack spacing={2} sx={{ color: "white" }}>
                  <Pagination
                    count={10}
                    // count={Math.ceil(matches.length / itemsPerPage)}
                    color="primary"
                    page={currentPage}
                    onChange={handlePageChange}
                    sx={{ color: "white" }}
                  />
                </Stack>
              </article>
            </div>
          </main>
        </>
      )}
    </>
  );
}

export default Matches;
