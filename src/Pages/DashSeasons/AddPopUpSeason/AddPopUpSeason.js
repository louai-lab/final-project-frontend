import React, { useState } from "react";
import StyleAddPopUp from "./AddPopUpSeason.module.css";
import { Box, Button, FormControl, Stack, TextField } from "@mui/material";

function AddPopUpSeason({
  handleCancelAdd,
  handleFormSubmitSeason,
  formError,
}) {
  const [formData, setFormData] = useState({
    seasonName: "",
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
    handleFormSubmitSeason(formData);
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
          Add Season
        </h1>
        {formError && <div style={{ color: "red" }}>{formError}</div>}
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
                label="Season"
                name="seasonName"
                value={formData.seasonName}
                onChange={handleChange}
                placeholder="YYYY/YYYY"
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

export default AddPopUpSeason;
