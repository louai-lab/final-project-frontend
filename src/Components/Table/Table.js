import { useState, useEffect } from "react";
import { Box, IconButton, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Grid from "@mui/material/Unstable_Grid2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StyleTable from "./Table.module.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useMatchesStore, usePlayersStore } from "../../Zustand/Store";
import { useTeamsStore } from "../../Zustand/Store";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

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

  const { loading, matches, matchCount } = useMatchesStore();
  const { selectedPageNumber, updateSelectedPageNumber } = useMatchesStore();
  const [currentPage, setCurrentPage] = useState(1);
  const { getAllMatches } = useMatchesStore();
  const { getAllPlayers, playersCount } = usePlayersStore();
  const { selectedTeamId, updateSelectedTeamId } = useMatchesStore();
  const { getAllTeams } = useMatchesStore();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const { selectedPlayerName, updateSelectedPlayerName } = usePlayersStore();
  const { selectedPageNumberPlayer, updateSelectedPageNumberPlayer } =
    usePlayersStore();

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

  const handlePlayerNameChange = (event) => {
    const playerNamee = event.target.value;
    setPlayerName(playerNamee);
  };

  const handleSearch = () => {
    // console.log("Searching for player:", playerName);
    updateSelectedPlayerName(playerName);
  };

  useEffect(() => {
    getAllPlayers(selectedPlayerName);
  }, [getAllPlayers, selectedPlayerName]);

  useEffect(() => {
    getAllPlayers(selectedPageNumberPlayer);
  }, [getAllPlayers, selectedPageNumberPlayer]);

  useEffect(() => {
    getAllMatches(selectedTeamId, selectedPageNumber);
  }, [getAllMatches, selectedTeamId]);

  useEffect(() => {
    getAllMatches(selectedTeamId, selectedPageNumber);
  }, [selectedPageNumber]);

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
        visibleFields = ["name", "position", "team"];
      } else if (ForWhat === "teams") {
        visibleFields = ["name", "image", "players"];
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
        ];
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
                style={{ width: "140px", height: "140px" }}
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
                  alignItems: "center",
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

          if (field === "team_a") {
            const { team, score } = params.row.team_a;
            return `${team.name} (${score})`;
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
                Type: {item.type}, Team: {item.team.name},
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
                          Select a team
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <TextField
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
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ height: "55px" }}
                        onClick={handleSearch}
                      >
                        Search
                      </Button>
                    </div>
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
                height: "100px !important",
                maxHeight: "100px !important",
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
