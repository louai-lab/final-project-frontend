import { Typography } from "@mui/material";
import { useTeamsStore } from "../../Zustand/Store";
import { BarChart } from "@mui/x-charts/BarChart";
// import StyleBarColor from './BarColor.module.css'
import "./BarColor.css";
import StyleBarColor from "./BarColor.module.css";

function BarColor() {
  const { teams } = useTeamsStore();
  const ids = teams?.map((team) => team?._id) || [];
  const teamNames = teams?.map((team) => team?.name) || [];
  const playerCount = teams?.map((team) => team.playerCount) || [];
  return (
    <div className={StyleBarColor.borderBar}>
      <h1 style={{ marginLeft:"10px" }}>
        Player per Team
      </h1>
      <div>
        <BarChart
          xAxis={[
            {
              id: ids,
              data: teamNames,
              scaleType: "band",
            },
          ]}
          series={[
            {
              data: playerCount,
            },
          ]}
          width={800}
          height={500}
        />
      </div>
    </div>
  );
}

export default BarColor;
