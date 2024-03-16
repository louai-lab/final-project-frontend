import { create } from "zustand";
import axiosInstance from "../Utils/AxiosInstance";
import { queryClient } from "../Utils/react-query-config";

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

export const useMatchesStore = create((set, get) => ({
  selectedTeamId: null,
  updateSelectedTeamId: (teamId) => {
    set({ selectedTeamId: teamId });
  },
  selectedPageNumber: null,
  updateSelectedPageNumber: (pageNumber) => {
    set({ selectedPageNumber: pageNumber });
    // console.log(pageNumber);
  },
  matches: [],
  loading: true,
  setMatches: (newState) => {
    set({ matches: newState });
  },

  getAllMatches: async (teamId) => {
    try {
      set({ loading: true });

      const pageNumber = get().selectedPageNumber || 1;

      const pageSize = 10;

      const url = teamId
        ? `/match?teamId=${teamId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
        : `/match?pageNumber=${pageNumber}&pageSize=${pageSize}`;

      const data = await queryClient.fetchQuery(
        ["matches", teamId, pageNumber, pageSize],
        async () => axiosInstance.get(url).then((res) => res.data)
      );

      // const matchCount = data.length;
      const matchCount = data.matchCount;

      set({ matches: data.matches, matchCount, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  LastTwoMatches: {},
  getLastTwoCreatedMatches: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get(
        "/match/getLastTwoCreatedMatches"
      );
      if (response) {
        set({ LastTwoMatches: response.data, loading: false });
      }
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
}));
