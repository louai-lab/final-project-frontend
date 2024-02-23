import { create } from "zustand";
import axiosInstance from "../Utils/AxiosInstance";

export const useUserStore = create((set) => ({
  // const navigate = useNavigate();

  user: null,
  loading: true,
  users: [],
  setUser: (data) => set(() => ({ user: data })),
  logOut: async () => {
    try {
      await axiosInstance.post("/user/logout");
      set(() => ({ user: null }));
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  },
  getUser: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get("/user/logged-in-user");
      if (response) {
        // console.log(response);
        set({ user: response.data.user, loading: false });
      }
    } catch (err) {
      console.error(err);
      set({ loading: false });
    }
  },
}));

export const useUsersStore = create((set) => ({
  users: [],
  loading: true,
  getAllUsers: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get("/user");
      if (response) {
        // console.log(response.data);
        set({ users: response.data, loading: false });
      }
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
  referees: [],
  getAllReferees: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get("/user/referees");
      if (response) {
        // console.log(response.data)
        set({ referees: response.data, loading: false });
      }
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
  watchers: [],
  getAllWatchers: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get("/user/watchers");
      if (response) {
        // console.log(response.data);
        set({ watchers: response.data, loading: false });
      }
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
  linesman: [],
  getAllLinesman: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get("/user/linesman");
      if (response) {
        // console.log(response.data);
        set({ linesman: response.data, loading: false });
      }
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
}));

export const usePlayersStore = create((set) => ({
  players: [],
  loading: true,
  getAllPlayers: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get("/player");
      if (response) {
        // console.log(response.data);
        set({ players: response.data, loading: false });
      }
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
  playersNoTeam: [],
  getAllPlayersNoTeam: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get("/player/playersnoteam");
      if (response) {
        // console.log(response.data)
        set({ playersNoTeam: response.data, loading: false });
      }
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
}));

export const useTeamsStore = create((set) => ({
  teams: [],
  loading: true,
  getAllTeams: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get("/team");
      if (response) {
        // console.log(response.data);
        set({ teams: response.data, loading: false });
      }
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
}));

// console.log(user)

export const useMatchesStore = create((set) => ({
  matches: [],
  loading: true,
  getAllMatches: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get("/match");
      if (response) {
        set({ matches: response.data, loading: false });
      }
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
  matchesByWatcher: [],
  getAllMatchesByWatcher: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get("/match/matchesbywatcher");
      if (response) {
        // console.log(response.data);
        set({ matchesByWatcher: response.data, loading: false });
      }
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  matchesByReferee: [],
  getAllMatchesByReferee: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get("/match/matchesbyreferee");
      if (response) {
        // console.log(response.data);
        set({ matchesByReferee: response.data, loading: false });
      }
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  lastMatch: {},
  getLastMatch: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get("/match/getlastcreatedmatch");
      if (response) {
        set({ lastMatch: response.data, loading: false });
      }
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
  lastMatchByWatcher: {},
  getLastMatchByWatcher: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get(
        `/match/getlastcreatedmatchbywatcher`
      );
      if (response) {
        // console.log(response.data)
        set({ lastMatchByWatcher: response.data, loading: false });
      }
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
  lastMatchByReferee: {},
  getLastMatchByReferee: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get(
        `/match/getlastcreatedmatchbyreferee`
      );
      if (response) {
        // console.log(response.data)
        set({ lastMatchByReferee: response.data, loading: false });
      }
    } catch (error) {
      console.log(error);
      set({ loading: false });
    }
  },
}));
