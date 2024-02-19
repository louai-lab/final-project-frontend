import { create } from "zustand";
import axiosInstance from "../Utils/AxiosInstance";

export const useUserStore = create((set) => ({
  user: null,
  loading: true,
  users: [],
  setUser: (data) => set(() => ({ user: data })),
  logOut: () => set(() => ({ user: null })),
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

export const useMatchesStore = create((set) => ({
  matches: [],
  loading: true,
  getAllMatches: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get("/match");
      if (response) {
        // console.log(response.data);
        set({ matches: response.data, loading: false });
      }
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
  lastMatch: {} ,
  getLastMatch: async () => {
    try {
      set({loading:true});
      const response = await axiosInstance.get('/match/getlastcreatedmatch');
      if(response){
        set({lastMatch:response.data , loading:false})
      }
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
}));
