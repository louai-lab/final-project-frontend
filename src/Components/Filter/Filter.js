import React, { useState } from "react";
import StyleFilter from "./Filter.module.css";
import { useTeamsStore } from "../../Zustand/Store";
import { useLanguage } from "../../Utils/LanguageContext";

function Filter({ handleCloseFilter, handleApply }) {
  const { teams } = useTeamsStore();
  const [teamId, setTeamId] = useState(null);

  const { language } = useLanguage();

  const handleTeamClick = (teamId) => {
    setTeamId(teamId);
  };

  const handleSendApply = (e) => {
    e.preventDefault();
    handleApply(teamId);
  };

    // console.log(teams);
  return (
    <main className={StyleFilter.popUpFilter}>
      <div
        className={
          language === "en"
            ? StyleFilter.headerFilter
            : StyleFilter.headerFilterAR
        }
      >
        <h1 style={{ fontSize: "clamp(12px , 3vw , 25px)" }}>
          {language === "en"
            ? "Filter Matches by Team"
            : "بحث عن المباريات حسب الفريق"}
        </h1>
        <button
          type="button"
          onClick={handleCloseFilter}
          className={StyleFilter.exit}
        >
          X
        </button>
      </div>
      <article className={StyleFilter.teamsContainer}>
        {teams.map((team) => {
          return (
            <button
              key={team._id}
              className={`${StyleFilter.singleTeam} ${
                teamId === team._id ? StyleFilter.selectedTeam : ""
              }`}
              onClick={() => handleTeamClick(team._id)}
            >
              <img
                src={`${process.env.REACT_APP_IMAGE_PATH}/${team.image}`}
                alt={team.name}
                className={StyleFilter.imagesFilter}
              />
              <p>{team.name}</p>
            </button>
          );
        })}
      </article>
      <div className={StyleFilter.footerFilter}>
        <button
          type="button"
          className={StyleFilter.apply}
          onClick={handleSendApply}
        >
          {language === "en" ? "Apply Selection" : "تطبيق"}
        </button>
      </div>
    </main>
  );
}

export default Filter;
