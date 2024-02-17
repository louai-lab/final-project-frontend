import React, { useState } from "react";
import StyleEditPopUp from "./EditPopUpMatch.module.css";
import {
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useTeamsStore } from "../../../Zustand/Store";
import { useUsersStore } from "../../../Zustand/Store";

function EditPopUpMatch({ selectedRowData, handleCancelEdit , handleSave }) {
  const { teams } = useTeamsStore();
  const { referees } = useUsersStore();
  const { watchers } = useUsersStore();
  const { linesman } = useUsersStore();
  const combinedDateTime = new Date(selectedRowData.match_date);
  const [formData, setFormData] = useState({
    title: selectedRowData.title,
    season: selectedRowData.season,
    pitch: selectedRowData.pitch,
    match_date: combinedDateTime.toISOString().split("T")[0],
    match_time: combinedDateTime.toISOString().split("T")[1].slice(0, 5),
    team_a: {
      team: selectedRowData.team_a.team._id,
    },
    team_b: {
      team: selectedRowData.team_b.team._id,
    },
    referee: selectedRowData.referee._id,
    watcher: selectedRowData.watcher._id,
    linesman_one: selectedRowData.linesman_one._id,
    linesman_two: selectedRowData.linesman_two._id,
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    // Check if the input type is file for handling images
    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        setFormData((prevData) => ({
          ...prevData,
          image: file,
        }));
      }
    } else {
      setFormData((prevData) => {
        // Handle nested structure for team_a and team_b
        if (name === "team_a" || name === "team_b") {
          const teamKey = name; // Either "team_a" or "team_b"
          const updatedTeam = {
            ...prevData[teamKey],
            team: value,
          };

          return {
            ...prevData,
            [teamKey]: updatedTeam,
          };
        }

        // For other fields
        return {
          ...prevData,
          [name]: type === "checkbox" ? checked : value,
        };
      });
    }
  };

  const handleSaveClick = (e) => {
    e.preventDefault()
    handleSave(formData)
  };

  return (
    <div>
      <Box
        className={StyleEditPopUp.addPopUp}
        sx={{
          "& .MuiOutlinedInput-notchedOutline ": {
            border: "1.5px solid  gray !important",
            borderRadius: "20px",
          },
          "& .Mui-focused > .MuiOutlinedInput-notchedOutline ": {
            border: "2px solid var(--primary-clr) !important",
            borderRadius: "20px",
          },
          "& .Mui-focused.MuiFormLabel-root ": {
            color: "var(--primary-clr) !important",
          },
        }}
      >
        <h1
          style={{
            //   width: "100%",
            marginBottom: "1.5rem",
          }}
        >
          Edit A Match
        </h1>
        <form
          //   onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            rowGap: "1rem",
          }}
        >
          <Stack rowGap="2rem">
            <div className={StyleEditPopUp.inputsWrapper}>
              <FormControl className={StyleEditPopUp.formControl}>
                <TextField
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl className={StyleEditPopUp.formControl}>
                <TextField
                  label="Season"
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl className={StyleEditPopUp.formControl}>
                <TextField
                  label="Pitch"
                  name="pitch"
                  value={formData.pitch}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl className={StyleEditPopUp.formControl}>
                <InputLabel htmlFor="team_a">Choose Home Team</InputLabel>
                <Select
                  label="Home Team"
                  name="team_a"
                  value={formData.team_a.team || ""}
                  onChange={handleChange}
                >
                  {teams.map((team) => (
                    <MenuItem
                      key={team._id}
                      value={team._id}
                      style={{ display: "flex", gap: "20px" }}
                    >
                      <img
                        src={`${process.env.REACT_APP_IMAGE_PATH}/${team.image}`}
                        alt={team.name}
                        style={{
                          width: "20px",
                          height: "20px",
                          marginLeft: "5px",
                        }}
                      />
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl className={StyleEditPopUp.formControl}>
                <InputLabel htmlFor="team_b">Choose Guest Team</InputLabel>
                <Select
                  label="Guest Team"
                  name="team_b"
                  value={formData.team_b.team || ""}
                  onChange={handleChange}
                >
                  {teams.map((team) => (
                    <MenuItem
                      key={team._id}
                      value={team._id}
                      style={{ display: "flex", gap: "20px" }}
                    >
                      <img
                        src={`${process.env.REACT_APP_IMAGE_PATH}/${team.image}`}
                        alt={team.name}
                        style={{
                          width: "20px",
                          height: "20px",
                          marginLeft: "5px",
                        }}
                      />
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl className={StyleEditPopUp.formControl}>
                <InputLabel htmlFor="referee">Choose Referee</InputLabel>
                <Select
                  label="Referee"
                  name="referee"
                  value={formData.referee || ""}
                  onChange={handleChange}
                >
                  {referees.map((referee) => (
                    <MenuItem
                      key={referee._id}
                      value={referee._id}
                      style={{ display: "flex", gap: "20px" }}
                    >
                      {referee.firstName} {referee.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl className={StyleEditPopUp.formControl}>
                <InputLabel htmlFor="watcher">Choose Watcher</InputLabel>
                <Select
                  label="Watcher"
                  name="watcher"
                  value={formData.watcher || ""}
                  onChange={handleChange}
                >
                  {watchers.map((watcher) => (
                    <MenuItem
                      key={watcher._id}
                      value={watcher._id}
                      style={{ display: "flex", gap: "20px" }}
                    >
                      {watcher.firstName} {watcher.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl className={StyleEditPopUp.formControl}>
                <InputLabel htmlFor="linesman_one">
                  Choose first linesman
                </InputLabel>
                <Select
                  label="Linesman one"
                  name="linesman_one"
                  value={formData.linesman_one || ""}
                  onChange={handleChange}
                >
                  {linesman.map((man) => (
                    <MenuItem
                      key={man._id}
                      value={man._id}
                      style={{ display: "flex", gap: "20px" }}
                    >
                      {man.firstName} {man.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl className={StyleEditPopUp.formControl}>
                <InputLabel htmlFor="linesman_two">
                  Choose second linesman
                </InputLabel>
                <Select
                  label="Linesman two"
                  name="linesman_two"
                  value={formData.linesman_two || ""}
                  onChange={handleChange}
                >
                  {linesman.map((man) => (
                    <MenuItem
                      key={man._id}
                      value={man._id}
                      style={{ display: "flex", gap: "20px" }}
                    >
                      {man.firstName} {man.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className={StyleEditPopUp.formControl}>
                <TextField
                  label="Match Date"
                  name="match_date"
                  type="date"
                  value={formData.match_date}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl className={StyleEditPopUp.formControl}>
                <TextField
                  label="Match Time"
                  name="match_time"
                  type="time"
                  value={formData.match_time}
                  onChange={handleChange}
                />
              </FormControl>
            </div>

            <button className={StyleEditPopUp.save} onClick={handleSaveClick}>
              Save
            </button>
            <button
              className={StyleEditPopUp.cancel}
              type="button"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </Stack>
        </form>
      </Box>
    </div>
  );
}

export default EditPopUpMatch;
