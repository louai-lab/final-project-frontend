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
import StyleAddPopUp from "./AddPopUpPlayer.module.css";

function AddPopUp() {
  const [isAddPopUp, setIsAddPopUp] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    password: "",
    image: "",
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
            //   width: "100%",
              marginBottom: "1.5rem",
            }}
          >
            Add A Player , need editing
          </h1>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              rowGap: "1rem",
              //   overflow:"scroll",
              //   paddingTop: "0.5rem",
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
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </FormControl>

              <FormControl fullWidth>
                <InputLabel htmlFor="role">Choose the role</InputLabel>
                <Select
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <MenuItem
                    value="admin"
                    style={{ display: "flex", gap: "20px" }}
                  >
                    admin
                  </MenuItem>
                  <MenuItem
                    value="referee"
                    style={{ display: "flex", gap: "20px" }}
                  >
                    referee
                  </MenuItem>
                  <MenuItem
                    value="watcher"
                    style={{ display: "flex", gap: "20px" }}
                  >
                    watcher
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
                  borderRadius:"20px",
                  "&:hover": {
                    bgcolor: "var(--third-clr)",
                    color: "white",
                  },
                }}
              >
                Submit
              </Button>
              <button className={StyleAddPopUp.cancel}>Cancel</button>
            </Stack>
          </form>
        </Box>
      </div>
    </>
  );
}

export default AddPopUp;
