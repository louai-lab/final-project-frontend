import React, { useEffect, useState } from "react";
import StyleProfile from "./Profile.module.css";
import { useUserStore } from "../../Zustand/Store";
import { useMatchesStore } from "../../Zustand/Store";
import { useNavigate } from "react-router-dom";
import { MdModeEditOutline } from "react-icons/md";
import EventEditProfile from "../../Components/Event/EventEditProfile/EventEditProfile";

function Profile() {
  const navigate = useNavigate();
  const { user, loading, getUser } = useUserStore();
  const { matchCount } = useMatchesStore();
  const { matches } = useMatchesStore();
  const [isOpenEditProfilePopUp, setIsOpenProfilePopUp] = useState(false);
  const { getAllMatches } = useMatchesStore();

  // console.log(user);
  // console.log(matches);

  useEffect(() => {
    getAllMatches();
  }, []);

  const handleMatchClick = (match) => {
    if (match && match._id) {
      navigate(`/match`, { state: { match } });
    } else {
      console.error("Match object is undefined or missing properties.");
    }
  };

  const handleOpenEditProfile = () => {
    setIsOpenProfilePopUp(true);
  };

  const handleCloseEditProfile = () => {
    setIsOpenProfilePopUp(false);
  };

  return (
    <>
      {isOpenEditProfilePopUp && (
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
            onClick={handleCloseEditProfile}
          ></div>
          <EventEditProfile
            setIsOpenProfilePopUp={setIsOpenProfilePopUp}
            handleCloseEditProfile={handleCloseEditProfile}
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
      <div className={StyleProfile.main}>
        <div className={StyleProfile.profileContainer}>
          <div className={StyleProfile.left}>
            <img
              src={`${process.env.REACT_APP_IMAGE_PATH}/${user.image}`}
              alt={user.firstName}
              className={StyleProfile.imageProfile}
            />
          </div>

          <div className={StyleProfile.right}>
            <div className={StyleProfile.personalInfo}>
              <p>
                <span className={StyleProfile.span}>
                  {user.firstName} {user.lastName}
                </span>
              </p>
              <p>
                <span className={StyleProfile.email}>{user.email}</span>
              </p>
              <p style={{ opacity: "0.7" }}>{user.role}</p>
              <button
                className={StyleProfile.editProfile}
                onClick={handleOpenEditProfile}
              >
                <span>
                  <MdModeEditOutline />
                </span>
                <p>Edit Profile</p>
              </button>
            </div>
            <div className={StyleProfile.statisticContainer}>
              <div className={StyleProfile.matchCount}>
                <p>Matches</p>
                <p>+{matchCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={StyleProfile.private}>
          <div className={StyleProfile.matchesPrivate}>
            {matches.map((match) => {
              return (
                <>
                  <button
                    style={{ all: "unset" }}
                    onClick={() => handleMatchClick(match)}
                  >
                    <div className={StyleProfile.cardMatchProfile}>
                      <div className={StyleProfile.twoTeamsProfile}>
                        <div className={StyleProfile.singleTeamProfile}>
                          <p
                            style={{
                              fontWeight:
                                match.team_a?.score > match.team_b?.score
                                  ? "bold"
                                  : "normal",

                              color:
                                match.team_a?.score > match.team_b?.score
                                  ? "red"
                                  : "grey",
                            }}
                          >
                            {match.team_a?.team.name}
                          </p>
                          <p
                            style={{
                              fontWeight:
                                match.team_a?.score > match.team_b?.score
                                  ? "bold"
                                  : "normal",
                              color:
                                match.team_a?.score > match.team_b?.score
                                  ? "red"
                                  : "grey",
                            }}
                          >
                            {match.team_a?.score}
                          </p>
                        </div>
                        <div className={StyleProfile.singleTeamProfile}>
                          <p
                            style={{
                              fontWeight:
                                match.team_b?.score > match.team_a?.score
                                  ? "bold"
                                  : "normal",
                              color:
                                match.team_b?.score > match.team_a?.score
                                  ? "red"
                                  : "grey",
                            }}
                          >
                            {match.team_b?.team.name}
                          </p>
                          <p
                            style={{
                              fontWeight:
                                match.team_b?.score > match.team_a?.score
                                  ? "bold"
                                  : "normal",

                              color:
                                match.team_b?.score > match.team_a?.score
                                  ? "red"
                                  : "grey",
                            }}
                          >
                            {match.team_b?.score}
                          </p>
                        </div>
                      </div>

                      <div className={StyleProfile.dateFt}>
                        <div className={match.played && StyleProfile.playedRed}>
                          {match.played === true ? "FT" : ""}
                        </div>
                        <div
                          style={{
                            color: match.played === true ? "grey" : "black",
                          }}
                        >
                          {new Date(match.match_date).toLocaleDateString(
                            "en-US",
                            {
                              timeZone: "UTC",
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                            }
                          )}
                          <br></br>
                          {new Date(match.match_date).toLocaleTimeString(
                            "en-US",
                            {
                              timeZone: "UTC",
                              hour: "numeric",
                              minute: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
