import React, { useState } from "react";
import StyleAddPopUp from "./AddPopUpTeam.module.css";
// import usePlayersStore  from "../../Zustand/Store.js";
import { usePlayersStore } from "../../../Zustand/Store";
import {
  FormControl,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Chip,
} from "@mui/material";
import Box from "@mui/material/Box";

function AddPopUpTeam({ handleCancelAdd, handleFormSubmitTeam }) {
  const { playersNoTeam } = usePlayersStore();
  // console.log(playersNoTeam)
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    playersIds: [],
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleFormSubmitTeam(formData);
  };

  return (
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
            color: "var(--primary-clr)",
          }}
        >
          Add Team
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
              <InputLabel htmlFor="playersIds">Choose Players</InputLabel>
              <Select
                label="Players"
                name="playersIds"
                multiple
                value={formData.playersIds}
                onChange={handleChange}
                renderValue={(selected) => (
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {selected.map((value) => (
                      <Chip
                        key={value._id}
                        label={value.name}
                        style={{ margin: 2 }}
                      />
                    ))}
                  </div>
                )}
              >
                {playersNoTeam.map((player) => (
                  <MenuItem key={player._id} value={player}>
                    {player.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <input
                className={StyleAddPopUp.input}
                type="file"
                name="image"
                id="image"
                onChange={handleChange}
                required
              />
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "var(--primary-clr)",
                opacity: "1",
                transition: "opacity 0.3s ease",
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: "10px",
                "&:hover": {
                  bgcolor: "var(--primary-clr)",
                  color: "white",
                  opacity: "0.7",
                  cursor: "pointer",
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
  );
}

export default AddPopUpTeam;
