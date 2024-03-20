import React, { useState } from "react";
import StyleEditProfile from "./EventEditProfile.module.css";
import { useUserStore } from "../../../Zustand/Store";
import axiosInstance from "../../../Utils/AxiosInstance";
import { FormControl } from "@mui/material";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";

function EventEditProfile({ setIsOpenProfilePopUp, handleCloseEditProfile }) {
  const { user, loading, getUser } = useUserStore();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);

  // console.log(user);
  const id = (user && user._id) || (user && user.userId);

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    checkPassword: "",
    newPassword: "",
    image: user.image,
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

  const handleEditProfile = async () => {
    try {
      formData.id = id;
      const response = await axiosInstance.patch(`/user/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response) {
        console.log("User updated successfully:");
        useUserStore.setState((state) => ({
          ...state,
          user: response.data,
        }));
      }
      setIsOpenProfilePopUp(false);
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.response && error.response.status === 401) {
        setError("Old password is incorrect");
      }
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleTogglePasswordNew = () => {
    setShowPasswordNew(!showPasswordNew);
  };

  return (
    <div className={StyleEditProfile.popUpContainer}>
      <h1 className={StyleEditProfile.eventH1}>Edit Profile</h1>
      <form
        action="#"
        style={{
          width: "100%"
        }}
      >
        <div className={StyleEditProfile.control}>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            placeholder="First Name"
            onChange={handleChange}
          />
        </div>

        <div className={StyleEditProfile.control}>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            placeholder="Last Name"
            onChange={handleChange}
          />
        </div>

        <div className={StyleEditProfile.control}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            value={formData.email}
            placeholder="email"
            onChange={handleChange}
          />
        </div>

        <div className={StyleEditProfile.control}>
          <label htmlFor="checkPassword">
            Old Password{" "}
            {error && (
              <span
                style={{ fontSize: "clamp(8px, 2.5rem, 15px)", color: "red" }}
              >
                {error}
              </span>
            )}
          </label>

          <input
            type={showPassword ? "text" : "password"}
            name="checkPassword"
            id="checkPassword"
            value={formData.checkPassword}
            placeholder="Old Password"
            onChange={handleChange}
            autoComplete="off"
          />
          <div
            className={StyleEditProfile.eyeIcon}
            onClick={handleTogglePassword}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </div>
        </div>

        <div className={StyleEditProfile.control}>
          <label htmlFor="newPassword">New Password</label>
          <input
            type={showPasswordNew ? "text" : "password"}
            name="newPassword"
            id="newPassword"
            value={formData.newPassword}
            placeholder="New Password"
            onChange={handleChange}
            autoComplete="off"
          />
          <div
            className={StyleEditProfile.eyeIconNew}
            onClick={handleTogglePasswordNew}
          >
            {showPasswordNew ? <FaEye /> : <FaEyeSlash />}
          </div>
        </div>

        <FormControl fullWidth>
          <input type="file" name="image" id="image" onChange={handleChange} />
        </FormControl>

        <div className={StyleEditProfile.control}>
          <button
            type="button"
            onClick={handleEditProfile}
            className={StyleEditProfile.addEvent}
          >
            Save
          </button>
        </div>
        <div className={StyleEditProfile.control}>
          <button
            type="button"
            onClick={handleCloseEditProfile}
            className={StyleEditProfile.cancelEvent}
          >
            Exit
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventEditProfile;
