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
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import StyleEditPopUp from "./EditPopUpUser.module.css";

function EditPopUpUser({ selectedRowData, handleCancelEdit, handleSave }) {
  const [showPassword, setShowPassword] = useState(false);
  // console.log(selectedRowData);

  const [formData, setFormData] = useState({
    firstName: selectedRowData.firstName,
    lastName: selectedRowData.lastName,
    email: selectedRowData.email,
    checkPassword: "",
    newPassword: "",
    role: selectedRowData.role,
    image: selectedRowData.image,
  });
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, type, checked } = e.target;

    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        setFormData({
          ...formData,
          image: file,
        });
        // console.log(file)
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
          Edit A User
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
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                type={showPassword ? "text" : "password"}
                label="Old Password"
                name="checkPassword"
                value={formData.checkPassword}
                onChange={handleChange}
              />
              <div
                className={StyleEditPopUp.eyeIcon}
                onClick={handleTogglePassword}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </FormControl>

            <FormControl fullWidth>
              <TextField
                type={showPassword ? "text" : "password"}
                label="New Password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
              />
              <div
                className={StyleEditPopUp.eyeIcon}
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
              </Select>
            </FormControl>

            {/* <img
              src={`${process.env.REACT_APP_IMAGE_PATH}/${formData.image}`} 
              alt="User Avatar"
              style={{ width: "80px" }}
            /> */}

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
            <button className={StyleEditPopUp.cancel} type="button" onClick={handleCancelEdit}>
              Cancel
            </button>
          </Stack>
        </form>
      </Box>
    </>
  );
}

export default EditPopUpUser;
