import { useEffect } from "react";
import "./App.css";
import AppRoutes from "./Routes/AppRoutes";
import { useUserStore } from "./Zustand/Store";
import { useUsersStore } from "./Zustand/Store";
function App() {
  const { loading, setUser, getUser, user } = useUserStore();
  const {getAllUsers}=useUsersStore();
  
  useEffect(() => {
    getUser();
    getAllUsers()
  }, []);

  return (
    !loading && (
      <div className="App">
        <AppRoutes />
      </div>
    )
  );
}

export default App;
