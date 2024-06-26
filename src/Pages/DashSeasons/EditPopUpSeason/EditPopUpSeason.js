import { Box, FormControl, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import StyleEditPopUp from "./EditPopUpSeason.module.css";

function EditPopUpSeason({
  handleSave,
  handleCancelEdit,
  selectedRowData,
  formErrorUpdate,
}) {
  const [formData, setFormData] = useState({
    seasonName: selectedRowData.seasonName,
  });

  const handleChange = (e) => {
    const { name, type, checked } = e.target;
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
          Edit Season
        </h1>

        {formErrorUpdate && (
          <div style={{ color: "red" }}>{formErrorUpdate}</div>
        )}

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
                label="Season"
                name="seasonName"
                value={formData.seasonName}
                onChange={handleChange}
                placeholder="YYYY/YYYY"
                required
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

export default EditPopUpSeason;
