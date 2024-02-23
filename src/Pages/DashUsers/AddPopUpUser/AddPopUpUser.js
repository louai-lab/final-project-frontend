import React, { useState } from "react";
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
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import StyleAddPopUp from "./AddPopUpUser.module.css";

function AddPopUp({ handleCancelAdd , handleFormSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    password: "",
    image: "",
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

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
    handleFormSubmit(formData)
  };

  return (
    <>
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
          Add An User
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
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                type={showPassword ? "text" : "password"}
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div
                className={StyleAddPopUp.eyeIcon}
                onClick={handleTogglePassword}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel htmlFor="role">Choose the role</InputLabel>
              <Select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <MenuItem
                  value="admin"
                  style={{ display: "flex", gap: "20px" }}
                >
                  Admin
                </MenuItem>
                <MenuItem
                  value="referee"
                  style={{ display: "flex", gap: "20px" }}
                >
                  Referee
                </MenuItem>
                <MenuItem
                  value="watcher"
                  style={{ display: "flex", gap: "20px" }}
                >
                  Watcher
                </MenuItem>
                <MenuItem
                  value="linesman"
                  style={{ display: "flex", gap: "20px" }}
                >
                  LinesMan
                </MenuItem>
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
            <button className={StyleAddPopUp.cancel} type="button" onClick={handleCancelAdd}>
              Cancel
            </button>
          </Stack>
        </form>
      </Box>
    </>
  );
}

export default AddPopUp;
