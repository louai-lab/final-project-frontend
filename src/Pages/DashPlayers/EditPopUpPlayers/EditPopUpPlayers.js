import React, { useState } from "react";
import {
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import StyleEditPopUp from "./EditPopUpPlayers.module.css";
import { useTeamsStore } from "../../../Zustand/Store";

function EditPopUpPlayers({ selectedRowData, handleCancelEdit, handleSave }) {
  const { teams } = useTeamsStore();
  const [formData, setFormData] = useState({
    name: selectedRowData.name,
    position: selectedRowData.position,
    team: selectedRowData.team ? selectedRowData.team._id : "",
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

  const handleSaveClick = (e) => {
    e.preventDefault();
    handleSave(formData);
  };

  return (
    <>
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
          Edit A Player
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
            <FormControl fullWidth>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel htmlFor="team">Choose the team</InputLabel>
              <Select
                label="Team"
                name="team"
                value={formData.team || ""}
                onChange={handleChange}
              >
                <MenuItem value="">No Team</MenuItem>
                {teams.map((team) => (
                  <MenuItem
                    key={team._id}
                    value={team._id}
                    style={{ display: "flex", gap: "20px" }}
                  >
                    <img
                      src={
                        team.image
                          ? `${process.env.REACT_APP_IMAGE_PATH}/${team.image}`
                          : ""
                      }
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

            <button className={StyleEditPopUp.cancel} onClick={handleSaveClick}>
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
    </>
  );
}

export default EditPopUpPlayers;
