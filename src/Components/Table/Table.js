import { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Grid from "@mui/material/Unstable_Grid2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StyleTable from "./Table.module.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {
  useMatchesStore,
  usePlayersStore,
  useTitlesStore,
  useSeasonsStore,
  usePitchesStore,
} from "../../Zustand/Store";
import { useTeamsStore } from "../../Zustand/Store";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Table = ({
  data,
  isEdit,
  ForWhat,
  handleEditOpen,
  setSelectedRowData,
  handleOpenDelete,
}) => {
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(false);
  const buton = isEdit === true ? true : false;

  const { matchCount } = useMatchesStore();
  const { selectedPageNumber, updateSelectedPageNumber } = useMatchesStore();
  const [currentPage, setCurrentPage] = useState(1);
  const { getAllMatches } = useMatchesStore();
  const { getAllPlayers, playersCount } = usePlayersStore();
  const { titles } = useTitlesStore();
  const { seasons } = useSeasonsStore();
  const { pitches } = usePitchesStore();
  const { selectedTeamId, updateSelectedTeamId } = useMatchesStore();
  const { selectedTitleId, updateSelectedTitleId } = useMatchesStore();
  const [selectedTitle, setSelectedTitle] = useState(null);

  const { selectedSeasonId, updateSelectedSeasonId } = useMatchesStore();
  const [selectedSeason, setSelectedSeason] = useState(null);

  const { selectedPitchId, updateSelectedPitchId } = useMatchesStore();
  const [selectedPitch, setSelectedPitch] = useState(null);

  // const { getAllTeams } = useMatchesStore();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamForPlayer, setTeamForPlayer] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const { selectedPlayerName, updateSelectedPlayerName } = usePlayersStore();
  const { selectedTeamPlayer, updateSelectedTeamPlayer } = usePlayersStore();
  const { selectedPageNumberPlayer, updateSelectedPageNumberPlayer } =
    usePlayersStore();

  const navigate = useNavigate();

  const handlePageChange = (event, value) => {
    updateSelectedPageNumber(value);
    setCurrentPage(value);
  };

  const handlePageChangePlayer = (event, value) => {
    updateSelectedPageNumberPlayer(value);
    setCurrentPage(value);
  };

  const { teams } = useTeamsStore();

  const handleSelectChange = (event) => {
    const teamId = event.target.value;
    updateSelectedTeamId(teamId);
    const team = teams.find((team) => team._id === teamId);
    setSelectedTeam(team);
  };

  const handleSelectChangeTitle = (event) => {
    const titleId = event.target.value;
    updateSelectedTitleId(titleId);
    const title = titles.find((title) => title._id === titleId);
    setSelectedTitle(title);
  };

  const handleSelectChangeSeason = (event) => {
    const seasonId = event.target.value;
    updateSelectedSeasonId(seasonId);
    const season = seasons.find((season) => season._id === seasonId);
    setSelectedSeason(season);
  };

  const handleSelectChangePitch = (event) => {
    const pitchId = event.target.value;
    updateSelectedPitchId(pitchId);
    const pitch = pitches.find((pitch) => pitch._id === pitchId);
    setSelectedPitch(pitch);
  };

  const handlePlayerNameChange = (event) => {
    const playerNamee = event.target.value;
    setPlayerName(playerNamee);
  };

  const handleTeamChange = (event) => {
    const team = event.target.value;
    setTeamForPlayer(team);
    // console.log(team)
  };

  const handleSearch = () => {
    // console.log("Searching for player:", playerName);
    updateSelectedPlayerName(playerName);
    updateSelectedTeamPlayer(teamForPlayer);
    // console.log(selectedTeamForPlayer)
  };

  useEffect(() => {
    getAllPlayers(
      selectedPlayerName,
      selectedTeamPlayer,
      selectedPageNumberPlayer
    );
    getAllMatches(
      selectedTeamId,
      selectedTitleId,
      selectedSeasonId,
      selectedPitchId,
      selectedPageNumber
    );
    // console.log("tabel useeffect");
  }, [
    getAllPlayers,
    getAllMatches,
    selectedPlayerName,
    selectedTeamPlayer,
    selectedPageNumberPlayer,
    selectedTeamId,
    selectedTitleId,
    selectedSeasonId,
    selectedPitchId,
    selectedPageNumber,
  ]);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setScreenWidth(newWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleEdit = (e, row) => {
    e.preventDefault();
    handleEditOpen(row);
    setSelectedRowData(row);
  };

  const handleDelete = (e, row) => {
    e.preventDefault();
    handleOpenDelete(row);
    setSelectedRowData(row);
  };

  const handleMatchClick = (match) => {
    // console.log(match);

    if (match && match._id) {
      navigate("/match", { state: { match } });
    } else {
      console.error("Match object is undefined or missing properties.");
    }
  };

  let visibleFields;
  useEffect(() => {
    try {
      if (!data || data.length === 0) {
        setError(true);
        return;
      }
      if (ForWhat === "users") {
        visibleFields = ["firstName", "lastName", "role", "email", "image"];
      } else if (ForWhat === "players") {
        visibleFields = [
          "name",
          "tShirtNumber",
          "team",
          "idCard",
          "image",
          "dateOfBirth",
          "motherName",
        ];
      } else if (ForWhat === "teams") {
        visibleFields = ["name", "image", "players", "administrators"];
      } else if (ForWhat === "matches") {
        visibleFields = [
          "title",
          "season",
          "pitch",
          "match_date",
          "match_time",
          "team_a",
          "team_b",
          "referee",
          "watcher",
          "linesman_one",
          "linesman_two",
          "detailsWatcher",
          "reported",
          "isPenalties",
          "ToMatch",
        ];
      } else if (ForWhat === "titles") {
        visibleFields = ["name", "image"];
      } else if (ForWhat === "seasons") {
        visibleFields = ["firstPart", "secondPart"];
      } else if (ForWhat === "pitches") {
        visibleFields = ["name", "location", "image"];
      } else if (ForWhat === "administrators") {
        visibleFields = ["name", "characteristic", "team", "image"];
      } else {
        visibleFields = Object.keys(data[0]);
      }

      const updatedColumns = visibleFields.map((field) => ({
        field,
        headerName: field,
        flex: screenWidth < 800 ? 0 : 1,
        renderCell: (params) => {
          if (field === "image" && params.row.image) {
            return (
              <img
                src={`${process.env.REACT_APP_IMAGE_PATH}/${
                  params.row.image ? params.row.image : ""
                }`}
                alt="Icon"
                style={{ width: "140px", height: "140px", objectFit: "cover" }}
              />
            );
          }

          if (field === "team" && params.row.team) {
            const { id, name, image } = params.row.team;
            return (
              <div
                key={id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "10px",
                  justifyContent: "center",
                  alignContent: "center",
                  // alignItems: "center",
                }}
              >
                <img
                  src={`${process.env.REACT_APP_IMAGE_PATH}/${image}`}
                  alt={name}
                  style={{ width: "50px", height: "50px", marginLeft: "5px" }}
                />
                {name}
              </div>
            );
          }
          if (field === "players" && params.row.players) {
            return (
              <div className={StyleTable.scroll}>
                <strong>Players:</strong>
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                  {params.row.players.map((player) => (
                    <li key={player._id}>{player.name}</li>
                  ))}
                </ul>
              </div>
            );
          }

          if (field === "administrators" && params.row.administrators) {
            return (
              <div className={StyleTable.scroll}>
                <strong>Administrators:</strong>
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                  {params.row.administrators.map((administrator) => (
                    <li key={administrator._id}>{administrator.name}</li>
                  ))}
                </ul>
              </div>
            );
          }

          if (field === "team_a") {
            const { team, score } = params.row.team_a;
            return `${team.name} (${score})`;
          }

          if (field === "reported") {
            return params.row.reported === true ? "Not Allowed" : "Allowed";
          }

          if (field === "ToMatch") {
            return (
              <button
                className={StyleTable.show}
                type="button"
                onClick={() => handleMatchClick(params.row)}
              >
                To Match
              </button>
            );
          }

          if (field === "isPenalties") {
            return params.row.isPenalties === true
              ? "Penalties"
              : "No Penalties";
          }

          if (field === "team_b") {
            const { team, score } = params.row.team_b;
            return `${team.name} (${score})`;
          }

          if (field === "referee") {
            return params.row.referee?.firstName;
          }
          if (field === "watcher") {
            return params.row.watcher?.firstName;
          }
          if (field === "linesman_one") {
            return params.row.linesman_one?.firstName;
          }
          if (field === "linesman_two") {
            return params.row.linesman_two?.firstName;
          }

          if (field === "title") {
            return params.row.title?.name;
          }

          if (field === "season") {
            return params.row.season?.seasonName;
          }

          if (field === "pitch") {
            return params.row.pitch?.name;
          }

          if (field === "detailsWatcher") {
            return (
              <button
                className={StyleTable.show}
                onClick={() => handleEvent(params.value)}
              >
                Show Details
              </button>
            );
          }

          if (field === "match_date") {
            const matchDate = new Date(`${params.value}`);

            const options = {
              weekday: "long",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            };

            const formattedDate = matchDate.toLocaleString("en-US", options);

            params.row.formattedDate = formattedDate;
            return (
              <div className={StyleTable.scrollableDate}>{formattedDate}</div>
            );
          }
          if (field === "match_time") {
            const formattedTime = new Date(
              `2000-01-01T${params.value}:00Z`
            ).toLocaleTimeString("en-US", {
              timeZone: "UTC",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });

            params.row.formattedTime = formattedTime;

            return (
              <div className={StyleTable.scrollableDate}>{formattedTime}</div>
            );
          }

          return params.value;
        },
      }));

      if (buton === true) {
        updatedColumns.push({
          field: "actions",
          headerName: "Actions",
          renderCell: (params) => (
            <Grid
              container
              md={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <IconButton onClick={(e) => handleEdit(e, params.row)}>
                <EditIcon
                  sx={{
                    ":hover": {
                      color: "#A0471D !important",
                    },
                  }}
                />
              </IconButton>
              <IconButton onClick={(e) => handleDelete(e, params.row)}>
                <DeleteIcon
                  sx={{
                    ":hover": {
                      color: "#A0471D !important",
                    },
                  }}
                />
              </IconButton>
            </Grid>
          ),
        });
      }

      setColumns(updatedColumns);
      setError(false);
    } catch (error) {
      setError(true);
      console.error(error);
    }
  }, [ForWhat, buton, data, screenWidth]);

  const [selectedDetails, setSelectedDetails] = useState([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleEvent = (details) => {
    setSelectedDetails(details || []);
    setIsDetailsModalOpen(true);
  };

  return (
    <>
      {isDetailsModalOpen && (
        <>
          <div
            className={StyleTable.modal}
            onClick={() => setIsDetailsModalOpen(false)}
          ></div>
          <div className={`${StyleTable.eventDetails}`}>
            {selectedDetails.details.map((item) => (
              <div key={item._id} className={StyleTable.singleEvent}>
                Type: {item?.type}, Team: {item?.team?.name},
                {item.type === "substitution" ? "Player In: " : "Player: "}
                {item.playerIn?.name}, Minute: {item.minute}
                {item.type === "substitution" && (
                  <span>, Player Out: {item.playerOut.name}</span>
                )}
              </div>
            ))}
            <h1>{selectedDetails.details.length === 0 && "No events yet."}</h1>
            <button
              onClick={() => setIsDetailsModalOpen(false)}
              className={StyleTable.exit}
            >
              Exit
            </button>
          </div>
        </>
      )}
      <Box
        sx={{
          height: 800,
          mt: "3rem",
          mb: "3rem",
          fontFamily: "Helvetica Neue",
        }}
      >
        <DataGrid
          isCellEditable={(GridCellParams) => false}
          columns={columns}
          rows={data}
          getRowId={(row) => row._id}
          pageSizeOptions={[5, 10, 20, 100]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          slots={
            ForWhat === "matches"
              ? {
                  pagination: () => (
                    <div>
                      <Stack spacing={2} sx={{ color: "white" }}>
                        <Pagination
                          count={Math.ceil(matchCount / 10)}
                          color="primary"
                          page={currentPage}
                          onChange={handlePageChange}
                          sx={{ color: "white" }}
                        />
                      </Stack>
                    </div>
                  ),
                  toolbar: (props) => (
                    <div>
                      <FormControl
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: "10px", position: "sticky" }}
                      >
                        <InputLabel id="team-select-label">
                          Select team
                        </InputLabel>
                        <Select
                          labelId="team-select-label"
                          id="team-select"
                          value={selectedTeam ? selectedTeam._id : ""}
                          onChange={handleSelectChange}
                          label="Select a team"
                        >
                          <MenuItem value="">
                            <em>Select a team</em>
                          </MenuItem>
                          {teams.map((team) => (
                            <MenuItem
                              key={team._id}
                              value={team._id}
                              sx={{
                                display: "flex",
                                columnGap: "20px",
                              }}
                            >
                              <img
                                src={`${process.env.REACT_APP_IMAGE_PATH}/${team.image}`}
                                alt="Icon"
                                style={{ width: "80px", height: "80px" }}
                              />{" "}
                              <span>{team.name}</span>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: "10px", position: "sticky" }}
                      >
                        <InputLabel id="team-select-label">
                          Select title
                        </InputLabel>
                        <Select
                          labelId="title-select-label"
                          id="title-select"
                          value={selectedTitle ? selectedTitle._id : ""}
                          onChange={handleSelectChangeTitle}
                          label="Select a title"
                        >
                          <MenuItem value="">
                            <em>Select title</em>
                          </MenuItem>
                          {titles.map((title) => (
                            <MenuItem
                              key={title._id}
                              value={title._id}
                              sx={{
                                display: "flex",
                                columnGap: "20px",
                              }}
                            >
                              <img
                                src={`${process.env.REACT_APP_IMAGE_PATH}/${title.image}`}
                                alt="Icon"
                                style={{ width: "80px", height: "80px" }}
                              />{" "}
                              <span>{title.name}</span>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: "10px", position: "sticky" }}
                      >
                        <InputLabel id="season-select-label">
                          Select season
                        </InputLabel>
                        <Select
                          labelId="season-select-label"
                          id="season-select"
                          value={selectedSeason ? selectedSeason._id : ""}
                          onChange={handleSelectChangeSeason}
                          label="Select season"
                        >
                          <MenuItem value="">
                            <em>Select season</em>
                          </MenuItem>
                          {seasons.map((season) => (
                            <MenuItem
                              key={season._id}
                              value={season._id}
                              sx={{
                                display: "flex",
                                columnGap: "20px",
                              }}
                            >
                              {/* <span>{season.seasonName}</span> */}
                              <span>{season?.firstPart}</span> -{" "}
                              <span>{season?.secondPart}</span>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: "10px", position: "sticky" }}
                      >
                        <InputLabel id="pitch-select-label">
                          Select pitch
                        </InputLabel>
                        <Select
                          labelId="pitch-select-label"
                          id="pitch-select"
                          value={selectedPitch ? selectedPitch._id : ""}
                          onChange={handleSelectChangePitch}
                          label="Select pitch"
                        >
                          <MenuItem value="">
                            <em>Select pitch</em>
                          </MenuItem>
                          {pitches.map((pitch) => (
                            <MenuItem
                              key={pitch._id}
                              value={pitch._id}
                              sx={{
                                display: "flex",
                                columnGap: "20px",
                              }}
                            >
                              <span>{pitch.name}</span>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <GridToolbar {...props} />
                    </div>
                  ),
                }
              : ForWhat === "players"
              ? {
                  pagination: () => (
                    <div>
                      <Stack spacing={2} sx={{ color: "white" }}>
                        <Pagination
                          count={Math.ceil(playersCount / 10)}
                          color="primary"
                          page={currentPage}
                          onChange={handlePageChangePlayer}
                          sx={{ color: "white" }}
                        />
                      </Stack>
                    </div>
                  ),
                  toolbar: () => (
                    <>
                      <div
                        style={{
                          display: "flex",
                          // alignItems: "center",
                          marginBottom: "10px",
                        }}
                        className={StyleTable.playerSearch}
                      >
                        {/* <TextField
                          sx={{
                            marginRight: "10px",
                            width: "auto",
                            position: "sticky",
                          }}
                          label="Enter player name"
                          variant="outlined"
                          fullWidth
                          value={playerName}
                          onChange={handlePlayerNameChange}
                          // autoFocus
                        /> */}
                        <input
                          type="text"
                          style={{
                            marginRight: "10px",
                            width: "auto",
                            position: "sticky",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            outline: "none",
                          }}
                          autoFocus
                          placeholder="Enter player name"
                          value={playerName}
                          onChange={handlePlayerNameChange}
                        />

                        {/* <PlayerSearchInput
                          playerName={playerName}
                          handlePlayerNameChange={handlePlayerNameChange}
                        /> */}

                        <div
                          style={{ display: "flex", columnGap: "10px" }}
                          className={StyleTable.playerSearch2}
                        >
                          <Select
                            value={teamForPlayer || ""}
                            onChange={handleTeamChange}
                            displayEmpty
                            variant="outlined"
                            sx={{ width: "auto" }}
                          >
                            <MenuItem value="">All Teams</MenuItem>
                            {teams.map((team) => (
                              <MenuItem key={team._id} value={team._id}>
                                <img
                                  src={`${process.env.REACT_APP_IMAGE_PATH}/${team.image}`}
                                  alt="Icon"
                                  style={{ width: "20px", height: "20px" }}
                                />
                                {team.name}
                              </MenuItem>
                            ))}
                          </Select>

                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ height: "55px" }}
                            onClick={handleSearch}
                          >
                            Search
                          </Button>
                        </div>
                      </div>
                    </>
                  ),
                }
              : { toolbar: (props) => <GridToolbar {...props} /> }
          }
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          sx={{
            fontFamily: "Helvetica Neue",
            marginBottom: "4rem",
            width: "98%",
            // border: "solid 1px #BABABA",
            border: "none",
            "& .MuiToolbar-root , .MuiInputBase-input , .MuiDataGrid-columnHeaderTitleContainer , .MuiDataGrid-cell":
              {
                color: "black",
              },
            "& .MuiButtonBase-root , & .MuiSvgIcon-root , &  .MuiSvgIcon-root":
              {
                color: "var(--primary-clr)",
              },
            "& .MuiDataGrid-root , .MuiDataGrid-colCell, .MuiDataGrid-root , .MuiDataGrid-cell":
              {
                maxHeight: "150px !important",
              },
            "& .MuiDataGrid-root > *": {
              height: "100%",
            },
            "& .MuiInputBase-root , & .MuiInputBase-input": {
              color: "#000",
            },
            "& .css-v4u5dn-MuiInputBase-root-MuiInput-root:after": {
              borderBottomColor: "var(--primary-clr)",
            },
            " & .Mui-selected ": {
              bgcolor: "var(--primary-clr) !important",
            },
            "& .MuiDataGrid-row": {
              height: "150px !important",
              maxHeight: "150px !important",
            },
            "& .Mui-hovered": {
              bgcolor: " #08829557 !important",
            },
            "& .Mui-selected": {
              bgcolor: "#08829557 !important",
            },
            "& .MuiDataGrid-columnHeaders , & .MuiDataGrid-toolbarContainer , & .MuiDataGrid-footerContainer":
              {
                // height: "120px !important",
                // maxHeight: "120px !important",
                fontSize: "1.2rem",
                mb: screenWidth < 500 ? "1rem" : "0",
                border: "1px solid grey",
                borderRadius: "10px",
                marginBottom: "10px",
                backgroundColor: "lightgrey",
              },
            "& .MuiDataGrid-columnHeaderTitleContainer": {
              color: "var(--primary-clr) !important",
            },
            ".MuiDataGrid-cell": {
              width: "8rem",
              maxHeight: "150px",
              height: "150px",
            },
            "& .MuiSelect-select , & .MuiTablePagination-select , & .MuiSelect-standard MuiInputBase-input css-194a1fa-MuiSelect-select-MuiInputBase-input":
              {
                color: "var(--primary-clr) !important",
              },
          }}
        />
      </Box>
    </>
  );
};

export default Table;
