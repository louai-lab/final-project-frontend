import * as React from "react";
import StylePieCard from "./PieColor.module.css";
import { Typography } from "@mui/material";
import { useUsersStore } from "../../Zustand/Store";
import { PieChart } from "@mui/x-charts";
// import { useUsersStore } from "../../Zustand/Store";

export default function PieColor() {
  const { watcherCount, refereeCount, linesManCount } = useUsersStore();

  return (
    <div className={StylePieCard.borderPie}>
      <Typography style={{ color: "var(--primary-clr)" }}>
        For referee and watcher later
      </Typography>
      <div className={StylePieCard.chart}>
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: watcherCount, label: "Watcher" },
                { id: 1, value: refereeCount, label: "Referee" },
                { id: 2, value: linesManCount, label: "Lines Man" },
              ],
            },
          ]}
          width={600}
          height={400}
        />
      </div>
    </div>
  );
}
