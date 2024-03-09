import React, { useState } from "react";
import StyleAddPopUp from "./AddPopUpMatch.module.css";
import {
  FormControl,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useTeamsStore } from "../../../Zustand/Store";
import { useUsersStore } from "../../../Zustand/Store";

function AddPopUpMatch({ handleCancelAdd, handleFormSubmitMatch }) {
  const { teams } = useTeamsStore();
  const { referees } = useUsersStore();
  const { watchers } = useUsersStore();
  const { linesman } = useUsersStore();
  const [formData, setFormData] = useState({
    title: "",
    season: "",
    pitch: "",
    match_date: "",
    match_time: "",
    team_a: {
      team: "",
    },
    team_b: {
      team: "",
    },
    referee: "",
    watcher: "",
    linesman_one: "",
    linesman_two: "",
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

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
        if (name === "team_a" || name === "team_b") {
          const teamKey = name;
          const updatedTeam = {
            ...prevData[teamKey],
            team: value,
          };

          return {
            ...prevData,
            [teamKey]: updatedTeam,
          };
        }

        return {
          ...prevData,
          [name]: type === "checkbox" ? checked : value,
        };
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleFormSubmitMatch(formData);
  };

  return (
    <>
      <div>
        <Box
          className={StyleAddPopUp.addPopUp}
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
              marginBottom: "1.5rem",
              fontSize: "clamp(10px , 4rem , 25px)",
            }}
          >
            Add Match
          </h1>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              rowGap: "1rem",
            }}
          >
            <Stack
              rowGap="2rem"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className={StyleAddPopUp.inputsWrapper}>
                <FormControl className={StyleAddPopUp.formControl}>
                  <TextField
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </FormControl>

                <FormControl className={StyleAddPopUp.formControl}>
                  <TextField
                    label="Season"
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    required
                  />
                </FormControl>

                <FormControl className={StyleAddPopUp.formControl}>
                  <TextField
                    label="Pitch"
                    name="pitch"
                    value={formData.pitch}
                    onChange={handleChange}
                    required
                  />
                </FormControl>

                <FormControl className={StyleAddPopUp.formControl}>
                  <InputLabel htmlFor="team_a">Choose Home Team</InputLabel>
                  <Select
                    label="Home Team"
                    name="team_a"
                    value={formData.team_a.team || ""}
                    onChange={handleChange}
                    required
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

                <FormControl className={StyleAddPopUp.formControl}>
                  <InputLabel htmlFor="team_b">Choose Guest Team</InputLabel>
                  <Select
                    label="Guest Team"
                    name="team_b"
                    value={formData.team_b.team || ""}
                    onChange={handleChange}
                    required
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

                <FormControl className={StyleAddPopUp.formControl}>
                  <InputLabel htmlFor="referee">Choose Referee</InputLabel>
                  <Select
                    label="Referee"
                    name="referee"
                    value={formData.referee || ""}
                    onChange={handleChange}
                    required
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

                <FormControl className={StyleAddPopUp.formControl}>
                  <InputLabel htmlFor="watcher">Choose Watcher</InputLabel>
                  <Select
                    label="Watcher"
                    name="watcher"
                    value={formData.watcher || ""}
                    onChange={handleChange}
                    required
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

                <FormControl className={StyleAddPopUp.formControl}>
                  <InputLabel htmlFor="linesman_one">
                    Choose first linesman
                  </InputLabel>
                  <Select
                    label="Linesman one"
                    name="linesman_one"
                    value={formData.linesman_one || ""}
                    onChange={handleChange}
                    required
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

                <FormControl className={StyleAddPopUp.formControl}>
                  <InputLabel htmlFor="linesman_two">
                    Choose second linesman
                  </InputLabel>
                  <Select
                    label="Linesman two"
                    name="linesman_two"
                    value={formData.linesman_two || ""}
                    onChange={handleChange}
                    required
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
                <FormControl className={StyleAddPopUp.formControl}>
                  <TextField
                    label="Match Date"
                    name="match_date"
                    type="date"
                    value={formData.match_date}
                    onChange={handleChange}
                    required
                  />
                </FormControl>

                <FormControl className={StyleAddPopUp.formControl}>
                  <TextField
                    label="Match Time"
                    name="match_time"
                    type="time"
                    value={formData.match_time}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
              </div>

              <Button
                type="submit"
                variant="contained"
                className={StyleAddPopUp.submit}

                // sx={{
                //   bgcolor: "var(--primary-clr)",
                //   width: "250px",
                //   transition: "background-color 0.3s ease, color 0.3s ease",
                //   textTransform: "none",
                //   fontWeight: "bold",
                //   borderRadius: "20px",
                //   "&:hover": {
                //     bgcolor: "var(--third-clr)",
                //     color: "white",
                //   },
                // }}
              >
                Submit
              </Button>
              <button
                className={StyleAddPopUp.cancel}
                type="button"
                onClick={handleCancelAdd}
              >
                Cancel
              </button>
            </Stack>
          </form>
        </Box>
      </div>
    </>
  );
}

export default AddPopUpMatch;
