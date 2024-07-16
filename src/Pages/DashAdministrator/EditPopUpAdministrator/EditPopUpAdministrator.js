import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import StyleEditPopUp from "./EditPopUpAdministrator.module.css";
import { useTeamsStore } from "../../../Zustand/Store";

function EditPopUpAdministrator({
  selectedRowData,
  handleCancelEdit,
  handleSave,
}) {
  const { teams } = useTeamsStore();

  const [formData, setFormData] = useState({
    name: selectedRowData.name,
    characteristic: selectedRowData.characteristic,
    team: selectedRowData.team ? selectedRowData.team._id : "",
    image: selectedRowData.image,
  });

  const handleChange = (e) => {
    const { name, type, checked, idCard, dateOfBirth, motherName } = e.target;
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
            color:"var(--primary-clr)"
          }}
        >
          Edit Administrator
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
                label="Characteristic"
                name="characteristic"
                value={formData.characteristic}
                onChange={handleChange}
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

            <FormControl fullWidth>
              <input
                className={StyleEditPopUp.input}
                type="file"
                name="image"
                id="image"
                onChange={handleChange}
              />
            </FormControl>

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
    </>
  );
}

export default EditPopUpAdministrator;
