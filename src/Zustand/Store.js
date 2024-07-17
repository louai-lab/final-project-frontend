import { create } from "zustand";
import axiosInstance from "../Utils/AxiosInstance";
import { queryClient } from "../Utils/react-query-config";

export const useUserStore = create((set) => ({
  // const navigate = useNavigate();

  user: null,
  loading: true,
  users: [],
  // setUser: (data) => set(() => ({ user: data })),
  setUser: (data) => {
    // console.log("Setting user:", data);
    set(() => ({ user: data }));
  },
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
        // console.log("Fetched user data:", response.data.user);
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
        set({
          users: response.data.users,
          userCount: response.data.userCount,
          loading: false,
        });
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
        set({
          referees: response.data.referees,
          refereeCount: response.data.refereeCount,
          loading: false,
        });
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
        set({
          watchers: response.data.watchers,
          watcherCount: response.data.watcherCount,
          loading: false,
        });
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
        set({
          linesman: response.data.linesman,
          linesManCount: response.data.linesManCount,
          loading: false,
        });
      }
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
}));

export const usePlayersStore = create((set, get) => ({
  selectedTeamPlayer: null,
  updateSelectedTeamPlayer: (team) => {
    set({
      selectedTeamPlayer: team,
    });
  },

  selectedPlayerName: null,
  updateSelectedPlayerName: (playerName) => {
    set(
      { selectedPlayerName: playerName }
      // console.log(team)
    );
  },
  selectedPageNumberPlayer: null,
  updateSelectedPageNumberPlayer: (pageNumber) => {
    set({ selectedPageNumberPlayer: pageNumber });
  },
  players: [],
  loading: true,
  getAllPlayers: async () => {
    // console.log("hi")
    try {
      set({ loading: true });
      const playerName = get().selectedPlayerName || "";
      const team = get().selectedTeamPlayer || "";
      const pageNumber = get().selectedPageNumberPlayer || 1;
      const pageSize = 10;

      const url =
        playerName && team
          ? `/player?playerName=${playerName}&team=${team}&pageNumber=${pageNumber}&pageSize=${pageSize}`
          : playerName
          ? `/player?playerName=${playerName}&pageNumber=${pageNumber}&pageSize=${pageSize}`
          : team
          ? `/player?team=${team}&pageNumber=${pageNumber}&pageSize=${pageSize}`
          : `/player?pageNumber=${pageNumber}&pageSize=${pageSize}`;

      // console.log(url)

      const data = await queryClient.fetchQuery(["players"], async () =>
        axiosInstance.get(url).then((res) => res.data)
      );

      const playersCount = data.playersCount;
      const totalPlayersCount = data.totalPlayersCount;

      set({
        players: data.players,
        playersCount,
        totalPlayersCount,
        loading: false,
      });

      // console.log(data.players)
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
        // console.log(response.data.teams[1].playerCount);
        set({
          teams: response.data.teams,
          teamCount: response.data.teamCount,
          loading: false,
        });
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
  selectedTitleId: null,
  updateSelectedTitleId: (titleId) => {
    set({ selectedTitleId: titleId });
  },
  selectedSeasonId: null,
  updateSelectedSeasonId: (seasonId) => {
    set({ selectedSeasonId: seasonId });
  },
  selectedPitchId: null,
  updateSelectedPitchId: (pitchId) => {
    set({ selectedPitchId: pitchId });
  },

  matches: [],
  loading: true,
  setMatches: (newState) => {
    set({ matches: newState });
  },

  getAllMatches: async () => {
    try {
      set({ loading: true });

      const pageNumber = get().selectedPageNumber || 1;

      const pageSize = 10;

      const teamId = get().selectedTeamId || null;
      const titleId = get().selectedTitleId || null;
      const seasonId = get().selectedSeasonId || null;
      const pitchId = get().selectedPitchId || null;

      const url =
        `/match?pageNumber=${pageNumber}&pageSize=${pageSize}` +
        (teamId ? `&teamId=${teamId}` : "") +
        (titleId ? `&titleId=${titleId}` : "") +
        (seasonId ? `&seasonId=${seasonId}` : "") +
        (pitchId ? `&pitchId=${pitchId}` : "");

      // console.log(url);

      const data = await queryClient.fetchQuery(
        ["matches", teamId, titleId, pageNumber, pageSize],
        async () => axiosInstance.get(url).then((res) => res.data)
      );

      // const matchCount = data.length;
      const matchCount = data.matchCount;
      // const totalMatchsCount = data.totalMatchsCount;

      set({
        matches: data.matches,
        matchCount,
        // totalMatchsCount,
        loading: false,
      });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
}));

export const useTitlesStore = create((set) => ({
  titles: [],
  loading: true,
  getAllTitles: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get("/title");
      if (response) {
        // console.log(response.data);
        set({
          titles: response.data.titles,
          titleCount: response.data.titleCount,
          loading: false,
        });
      }
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
}));

export const useSeasonsStore = create((set) => ({
  seasons: [],
  loading: true,
  getAllSeasons: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get("/season");

      if (response) {
        set({ seasons: response.data, loading: false });
      }
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
}));

export const usePitchesStore = create((set) => ({
  pitches: [],
  loading: true,
  getAllPitches: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get("/pitch");

      if (response) {
        set({
          pitches: response.data.pitches,
          pitchCount: response.data.pitchCount,
          loading: false,
        });
      }
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
}));

export const useAdministratorsStore = create((set) => ({
  administrators: [],
  loading: true,
  getAllAdministrators: async () => {
    try {
      set({ loading: true });
      const response = await axiosInstance.get("/administrator");

      if (response) {
        set({
          administrators: response.data.administrators,
          administratorsCount: response.data.administratorsCount,
          loading: false,
        });
      }
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
}));
