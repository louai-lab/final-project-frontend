import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import StylePieCard from "./PieColor.module.css";
import { Typography } from "@mui/material";
import { useTeamsStore } from "../../Zustand/Store";

export default function PieColor() {
  const { teams } = useTeamsStore();
  //   console.log(teams);
  return (
    <div className={StylePieCard.borderPie}>
      <Typography style={{ color: "var(--primary-clr)" }}>
        Player per Team
      </Typography>
      <PieChart
        series={[
          {
            data: teams?.map((team) => ({
              id: team?._id,
              value: team?.playerCount,
              label: team?.name,
            })),
          },
        ]}
        width={500}
        height={300}
      />
    </div>
  );
}
