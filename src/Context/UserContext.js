import { createContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import axiosInstance from "../Utils/AxiosInstance";

const UserContext = createContext(null);
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
//   const navigate = useNavigate();

  useEffect(() => {
    if (!user && user === null) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoadingUser(true);
      const response = await axiosInstance.get("/user/logged-in-user");
      setUser(response.data.user);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingUser(false);
    }
  };

  //   const logOut = async () => {
  //     await axiosInstance.post("user/logout");
  //     setUser(null);
  //     navigate("/");
  //   };

  return (
    <UserContext.Provider
      value={{
        user,
        loadingUser,
        setUser,
        // logOut,
        fetchUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
