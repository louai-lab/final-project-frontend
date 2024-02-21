import React, { useEffect, useTransition, useState } from "react";
import { useLocation } from "react-router-dom";
import StyleSingleMatch from "./SingleMatch.module.css";
import TabButton from "../../Components/TabButton/TabButton";

function SingleMatch() {
  const [tab, setTab] = useState("live");
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (id) => {
    startTransition(() => {
      setTab(id);
    });
  };
  const location = useLocation();
  const { match } = location.state || {};

  useEffect(() => {
    // console.log(match);
  }, [match]);

  const event = match.details.details;

  // console.log(event);

  const TAB_DATA = [
    {
      title: "Live",
      id: "live",
      content: (
        <div className={StyleSingleMatch.liveContainer}>
          <h1>Hi live</h1>
          {/* {event.map((item, index) => (
            <h1 key={index}>{item.goal}</h1>
          ))} */}
        </div>
      ),
    },
    {
      title: "Line-ups",
      id: "line-ups",
      content: (
        <div className={StyleSingleMatch.lineContainer}>
          <h1>Hi line ups</h1>
        </div>
      ),
    },
    {
      title: "stats",
      id: "stats",
      content: (
        <div className={StyleSingleMatch.statsContainer}>
          <h1>hi Stats</h1>
        </div>
      ),
    },
  ];

  return (
    <main className={StyleSingleMatch.matchContainer}>
      <article className={StyleSingleMatch.matchHeroSection}>
        <section className={StyleSingleMatch.teamA}>
          <img
            src={`${process.env.REACT_APP_IMAGE_PATH}/${match.team_a?.team.image}`}
            alt={match.team_a?.team.name}
            className={StyleSingleMatch.cardImage}
          />
          <h1>{match.team_a?.team.name}</h1>
        </section>
        <section className={StyleSingleMatch.result}>
          <p>{match.team_a?.score}</p>
          <span>-</span>
          <p>{match.team_b?.score}</p>
        </section>
        <section className={StyleSingleMatch.teamA}>
          <img
            src={`${process.env.REACT_APP_IMAGE_PATH}/${match.team_b?.team.image}`}
            alt={match.team_b?.team.name}
            className={StyleSingleMatch.cardImage}
          />
          <h1>{match.team_a?.team.name}</h1>
        </section>
      </article>
      <article className={StyleSingleMatch.live}>
        <section className={StyleSingleMatch.position}>
          <section className={StyleSingleMatch.tabContainer}>
            <TabButton
              selectTab={() => handleTabChange("live")}
              active={tab === "live"}
            >
              LIVE
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("line-ups")}
              active={tab === "line-ups"}
            >
              LINE-UPS
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("stats")}
              active={tab === "stats"}
            >
              STATS
            </TabButton>
          </section>

          <div>{TAB_DATA.find((t) => t.id === tab).content}</div>
        </section>
      </article>
    </main>
  );
}

export default SingleMatch;
