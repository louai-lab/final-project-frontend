import React from "react";
import StyleHome from "./Home.module.css";
import firstTeam from "../../Assets/icons/Ellipse 6.svg";
import secondTeam from "../../Assets/icons/Ellipse 8.svg";
import LandingPage from "../../Assets/icons/referee-showing-red-yellow-cards-football-soccer-player-while-gaming-white-studio-background.jpg";

function Home() {
  const matches = [
    {
      title: "Match 1",
      time: "15:00",
      stadium: "Stadium 1",
      teams: [
        { name: "Real Madrid ", logo: "teamA_logo.png" },
        { name: "Liverpool", logo: "teamB_logo.png" },
      ],
    },
    {
      title: "Match 2",
      time: "18:30",
      stadium: "Stadium 2",
      teams: [
        { name: "Team C", logo: "teamC_logo.png" },
        { name: "Team D", logo: "teamD_logo.png" },
      ],
    },
  ];

  return (
    <div className={StyleHome.homeContainer}>
      <header className={StyleHome.HeroSection}>
        <div className={StyleHome.position}>
          <p className={StyleHome.association}>Lebanese Football Association</p>
          <h1>FIXTURES</h1>
          <div className={StyleHome.fixtureContainer}>
            {matches.map((match, index) => (
              <div key={index} className={StyleHome.fixture}>
                <div className={StyleHome.info}>
                  <p className={StyleHome.title}>{match.title}</p>
                  <p className={StyleHome.time}>{match.time}</p>
                  <p className={StyleHome.stadium}>{match.stadium}</p>
                </div>
                <div className={StyleHome.teams}>
                  <div className={StyleHome.oneTeam}>
                    <img
                      src={firstTeam}
                      alt={`Logo of ${match.teams[0].name}`}
                      style={{ width: "70px" }}
                    />
                    <p className={StyleHome.teamName}>{match.teams[0].name}</p>
                  </div>
                  <p style={{ fontWeight: "bold" }}>VS</p>
                  <div className={StyleHome.oneTeam}>
                    <img
                      src={secondTeam}
                      alt={`Logo of ${match.teams[1].name}`}
                      style={{ width: "70px" }}
                    />
                    <p className={StyleHome.teamName}>{match.teams[1].name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className={StyleHome.slidesHome}>
        <div className={StyleHome.leftSlideHome}>
          <h4>Football Program</h4>
          <p className={StyleHome.hiddenText}>
            Custom-made nutrition programs that will ehance your athletic
            performance, increase focus, and give you maximum endurance
            according to your role on the team.
          </p>
        </div>
        <div className={StyleHome.rightSlideHome}>
          <h4>Football Program</h4>
          <p className={StyleHome.hiddenText}>
            Nutrition programs tailored to maximise athletic performances of all
            players on the team each according to their position and role.
          </p>
        </div>
      </div>

      <div className={StyleHome.descriptionSection}>
        <div className={StyleHome.imageSection}>
          <img src={LandingPage} alt="" />
        </div>
        <div className={StyleHome.trackHome}>
          <h1>Track Live Match Actions</h1>
          <p>
            Stay up-to-date with real-time updates and comprehensive statistics
            during the match. Our cutting-edge platform offers in-depth insights
            into every player's move, team strategies, and key moments. Immerse
            yourself in the game with live commentary, dynamic visualizations,
            and personalized notifications.
          </p>

          <button type="button" className={StyleHome.explore}>
            Explore More
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
