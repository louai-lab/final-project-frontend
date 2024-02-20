import React, { useEffect, useRef } from "react";
import StyleHome from "./Home.module.css";
import firstTeam from "../../Assets/icons/Ellipse 6.svg";
import secondTeam from "../../Assets/icons/Ellipse 8.svg";
import Typed from "typed.js";

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

  let mystrings;

  mystrings = [""];
  useEffect(() => {
    mystrings.push("Lebanese Football Association");

    const typed = new Typed(el.current, {
      strings: mystrings,
      typeSpeed: 50,
      backSpeed: 50,
      loop: true,
      css: {
        color: "red",
      },
    });

    return () => {
      typed.destroy();
    };
  }, [mystrings]);
  const el = useRef();

  return (
    <div className={StyleHome.homeContainer}>
      <header className={StyleHome.HeroSection}>
        <div className={StyleHome.position}>
          <p className={StyleHome.association} ref={el}>
            Lebanese Football Association
          </p>
          <h1 style={{ color: "white" }}>FIXTURES</h1>
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
    </div>
  );
}

export default Home;
