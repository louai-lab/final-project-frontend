import React from "react";
import StyleProfile from "./Profile.module.css";
import { useUserStore } from "../../Zustand/Store";
import { useMatchesStore } from "../../Zustand/Store";

function Profile() {
  const { user } = useUserStore();
  const { matchCount } = useMatchesStore();
  const { matches } = useMatchesStore();
  // console.log(user);
  // console.log(matches);
  return (
    <div className={StyleProfile.main}>
      <div className={StyleProfile.profileContainer}>
        <div className={StyleProfile.left}>
          <img
            src={`${process.env.REACT_APP_IMAGE_PATH}/${user.image}`}
            alt={user.firstName}
            className={StyleProfile.imageProfile}
          />
          <p>
            {user.firstName} {user.lastName}
            <br></br>
            <p style={{ color: "grey" }}>{user.role}</p>
          </p>
        </div>

        <div className={StyleProfile.right}>
          <div className={StyleProfile.personalInfo}>
            <p>
              <span className={StyleProfile.span}>First Name</span> :{" "}
              {user.firstName}
            </p>
            <p>
              <span className={StyleProfile.span}>Last Name</span> :{" "}
              {user.lastName}
            </p>
            <p>
              <span className={StyleProfile.span}>Email</span> : {user.email}
            </p>
            <p>
              <span className={StyleProfile.span}>Role</span> : {user.role}
            </p>
          </div>
          <div className={StyleProfile.statisticContainer}>
            <div className={StyleProfile.matchCount}>
              <p>Matches</p>
              <p>+{matchCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={StyleProfile.private}>
        <div className={StyleProfile.matchesPrivate}>
          <h1>Matches</h1>
        </div>
        <div className={StyleProfile.reportsPrivate}>
          <h1>Reports</h1>
        </div>
      </div>
    </div>
  );
}

export default Profile;
