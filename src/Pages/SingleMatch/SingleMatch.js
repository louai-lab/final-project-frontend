import React, { useEffect, useTransition, useState } from "react";
import { useLocation } from "react-router-dom";
import StyleSingleMatch from "./SingleMatch.module.css";
import TabButton from "../../Components/TabButton/TabButton";
import Event from "../../Components/Event/Event";

function SingleMatch() {
  const [tab, setTab] = useState("live");
  const [isPending, startTransition] = useTransition();
  const [isOpenPopUpEvent, setIsOpenPopUpEvent] = useState(false);

  const handleTabChange = (id) => {
    startTransition(() => {
      setTab(id);
    });
  };
  const location = useLocation();
  const { match } = location.state || {};

  const cancelEvent=()=>{
    setIsOpenPopUpEvent(false)
  }

  const openPopUp = () => {
    setIsOpenPopUpEvent(true);
    document.body.style.overflow = "hidden";
  };

  const closePopUp = () => {
    setIsOpenPopUpEvent(false);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    // console.log(match);
  }, [match]);

  // console.log(match.details._id)

  const events = match?.details?.details;

  const TAB_DATA = [
    {
      title: "Live",
      id: "live",
      content: (
        <div className={StyleSingleMatch.liveContainer}>
          {events.map((event) => (
            <div
              // className={StyleSingleMatch.event}
              className={`${StyleSingleMatch.event} ${
                event.team._id === match.team_b.team._id
                  ? StyleSingleMatch.flexStart
                  : StyleSingleMatch.flexEnd
              }`}
            >
              <div
                className={`${StyleSingleMatch.type} ${
                  event.team._id === match.team_b.team._id
                    ? StyleSingleMatch.rowDirection
                    : ""
                }`}
              >
                {event.type === "goal" ? (
                  <img
                    src={`${process.env.REACT_APP_IMAGE_PATH}/football.png`}
                    alt="goal"
                    className={StyleSingleMatch.iconType}
                  />
                ) : event.type === "yellow_card" ? (
                  <img
                    src={`${process.env.REACT_APP_IMAGE_PATH}/yellow-card.png`}
                    alt="yellow-card"
                    className={StyleSingleMatch.iconType}
                  />
                ) : event.type === "red_card" ? (
                  <img
                    src={`${process.env.REACT_APP_IMAGE_PATH}/red-card.png`}
                    alt="red-card"
                    className={StyleSingleMatch.iconType}
                  />
                ) : (
                  <img
                    src={`${process.env.REACT_APP_IMAGE_PATH}/substitution.png`}
                    alt="substitution"
                    className={StyleSingleMatch.iconSubstitution}
                  />
                )}
                <div>
                  {event.type === "substitution" ? (
                    <div className={StyleSingleMatch.substitution}>
                      <p>{event.playerIn.name}</p>
                      <p className={StyleSingleMatch.out}>
                        {event.playerOut.name}
                      </p>
                    </div>
                  ) : (
                    <p>{event.playerIn.name}</p>
                  )}
                </div>
              </div>
              <div>O</div>
              <p>{event.minute}'</p>
            </div>
          ))}
          <button className={StyleSingleMatch.open} onClick={openPopUp}>
            +
          </button>
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
    <>
      {isOpenPopUpEvent && (
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
            onClick={closePopUp}
          ></div>

          <Event cancelEvent={cancelEvent} />
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
            <h1>{match.team_b?.team.name}</h1>
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

            {TAB_DATA.find((t) => t.id === tab).content}
          </section>
        </article>
      </main>
    </>
  );
}

export default SingleMatch;
