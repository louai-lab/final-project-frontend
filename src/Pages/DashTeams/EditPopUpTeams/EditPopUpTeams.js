import React, { useState } from "react";
import StyleEditPopUp from "./EditPopUpTeams.module.css";
import {
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import { usePlayersStore } from "../../../Zustand/Store";

function EditPopUpTeams({ selectedRowData, handleCancelEdit }) {
//   const { teams } = useTeamsStore();
  const { playersNoTeam } = usePlayersStore();
  const [formData, setFormData] = useState({
    name: selectedRowData.name,
    image: selectedRowData.image,
    players: selectedRowData.players,
    // players: selectedRowData.players ? selectedRowData.players._id : "",
  });

  console.log(formData.players)

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
          Edit A Team
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
              <InputLabel htmlFor="players">Choose the Players</InputLabel>
              <Select
                label="Players"
                name="players"
                value={formData.players.map((player) => player._id) || []}
                onChange={handleChange}
                multiple
              >
                {playersNoTeam.map((player) => (
                  <MenuItem
                    key={player._id}
                    value={player._id}
                    style={{ display: "flex", gap: "20px" }}
                  >
                    {player.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <input
                className={StyleEditPopUp.input}
                type="file"
                name="image"
                id="image"
                onChange={handleChange}
              />
            </FormControl>

            {/* onClick={handleSaveClick} */}

            <button className={StyleEditPopUp.cancel}>Save</button>
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

export default EditPopUpTeams;
