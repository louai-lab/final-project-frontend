import { Box, FormControl, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAboutUsStore } from "../../Zustand/Store";
import StyleAboutUs from "./DashAboutUs.module.css";
import axiosInstance from "../../Utils/AxiosInstance";

function DashAboutUs() {
  const { aboutUs } = useAboutUsStore();

  // console.log(aboutUs);

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    email: "",
    facebook: "",
    phone: "",
    location: "",
  });

  useEffect(() => {
    setFormData({
      name: aboutUs.name,
      image: aboutUs.image,
      email: aboutUs.email,
      facebook: aboutUs.facebook,
      phone: aboutUs.phone,
      location: aboutUs.location,
    });
  }, [aboutUs]);

  const handleSave = async (e) => {
    e.preventDefault();
    // console.log(formData);

    try {
      const response = await axiosInstance.patch(
        `/aboutus/update/66994047991cae7b56ec1c8b`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response) {
        console.log("About updated successfully:");
      }
    } catch (error) {
      console.log("Error updating About us:", error);
    }
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
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : e.target.value,
      }));
    }
  };
  return (
    <div className={StyleAboutUs.containerAboutUs}>
      <h1 style={{ color: "var(--primary-clr)" }}>
        Manage Info About Association
      </h1>
      <Box
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
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            // width: "100%",
            rowGap: "1rem",
            marginTop: "40px",
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
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Facebook"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </FormControl>

            <FormControl fullWidth>
              <input
                className={StyleAboutUs.input}
                type="file"
                name="image"
                id="image"
                onChange={handleChange}
              />
            </FormControl>

            <button className={StyleAboutUs.save} onClick={handleSave}>
              Save
            </button>
            {/* <button
            className={StyleAboutUs.cancel}
            type="button"
            // onClick={handleCancelEdit}
          >
            Cancel
          </button> */}
          </Stack>
        </form>
      </Box>
    </div>
  );
}

export default DashAboutUs;
