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

function AddPopUpMatch({ handleCancelAdd }) {
  const { teams } = useTeamsStore();
  const { referees } = useUsersStore();
  const { watchers } = useUsersStore();
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    team: "",
  });

  const handleChange = (e) => {
    const { name, type, checked } = e.target;
    // Check if the input type is file for handling images
    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        setFormData({
          ...formData,
          image: file,
        });
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : e.target.value,
      }));
    }
  };

  const handleSubmit = () => {};

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
              //   width: "100%",
              marginBottom: "1.5rem",
            }}
          >
            Add A Match
          </h1>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              rowGap: "1rem",
            }}
          >
            <Stack rowGap="2rem" sx={{display:"flex" , flexWrap:"wrap"}}>
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
                  value={formData.season}
                  onChange={handleChange}
                  required
                />
              </FormControl>

              <FormControl className={StyleAddPopUp.formControl}>
                <InputLabel htmlFor="team">Choose Home Team</InputLabel>
                <Select
                  label="Home Team"
                  name="team"
                  value={formData.team || ""}
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

              <FormControl className={StyleAddPopUp.formControl}>
                <InputLabel htmlFor="team">Choose Guest Team</InputLabel>
                <Select
                  label="Guest Team"
                  name="team"
                  value={formData.team || ""}
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

              <FormControl className={StyleAddPopUp.formControl}>
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

              <FormControl className={StyleAddPopUp.formControl}>
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
              </div>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "var(--primary-clr)",
                  transition: "background-color 0.3s ease, color 0.3s ease",
                  textTransform: "none",
                  fontWeight: "bold",
                  borderRadius: "20px",
                  "&:hover": {
                    bgcolor: "var(--third-clr)",
                    color: "white",
                  },
                }}
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
