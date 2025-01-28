import React from "react";
import AddIcon from '@mui/icons-material/Add';
import ShoppingLists from "./pages/ShoppingLists";
import History from "./pages/History";
import ListItems from "./pages/ListItems";
import { useState } from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab, Box, Button, Dialog, DialogTitle, TextField, DialogContent, DialogActions, IconButton } from "@mui/material";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { AppDispatch, createList } from "./store/store";
import { useDispatch } from "react-redux";
import { saveHistoryToDB, saveListToDB } from "./db";

// page for our navigation and header

const App: React.FC = () => {
  const location = useLocation();
  const currentTab = location.pathname;
  const dispatch = useDispatch<AppDispatch>();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [listName, setListName] = useState("");

  return (
    <Box className="app-container" sx={{
      minHeight: "100vh",
      backgroundColor: "#E6F4EA",
      padding: "2rem",
    }}>
      <AppBar position="sticky" sx={{ backgroundColor: "#0046A1" }}>
        <Toolbar>
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              color: "#FFFFFF",
            }}
          >
            Список Покупок
          </Typography>
          <Tabs
            value={currentTab}
            textColor="inherit"
            indicatorColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                fontWeight: "bold",
                color: "#FFFFFF",
                "&.Mui-selected": {
                  color: "#94b591",
                },
              },
            }}
          >
            <Tab
              label="Списки"
              value="/lists"
              component={Link}
              to="/lists"
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            />
            <Tab
              label="История покупок"
              value="/history"
              component={Link}
              to="/history"
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            />
          </Tabs>
          <IconButton
            color="inherit"
            onClick={() => setIsDialogOpen(true)}
            sx={{
              marginLeft: "1rem",
              backgroundColor: "#94b591",
              color: "#FFFFFF",
              borderRadius: "50%",
              "&:hover": {
                backgroundColor: "#7ca577",
              },
            }}
          >
            <AddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>


      {/* routing/navigation */}
      <Box sx={{ padding: "2rem" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/lists" replace />} />
          <Route path="/lists" element={<ShoppingLists />} />
          <Route path="/list/:key" element={<ListItems />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<Navigate to="/lists" replace />} />
        </Routes>
      </Box>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            backgroundColor: "#F8F9FA",
            padding: "20px",
          },
        }}
      >
        <DialogTitle>
          <Typography
            align="center"
            variant="h6"
            component="h2"
            sx={{
              fontWeight: "600",
              color: "#0046A1",
            }}
          >
            Добавить новый список
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            label="Название списка"
            placeholder="Введите название"
            sx={{
              backgroundColor: "#FFFFFF",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "& fieldset": {
                  borderColor: "#94b591",
                },
                "&:hover fieldset": {
                  borderColor: "#7ca577",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#5d8c4f",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#94b591",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#5d8c4f",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <Button
              onClick={() => {
                if (listName.trim() === "") {
                  console.warn("list name is empty");
                  return;
                }

                const listKey = `list-${Date.now()}`;
                dispatch(
                  createList({
                    key: listKey,
                    name: listName,
                  })
                );
                saveListToDB(listKey, {
                  key: listKey,
                  name: listName,
                  items: [],
                  total: 0,
                });
                saveHistoryToDB("history", {
                  lists: {
                    [listKey]: {
                      listKey,
                      listName,
                      purchases: [],
                      total: 0,
                    },
                  },
                  totalSpent: 0,
                });

                setListName("");
                setIsDialogOpen(false);
              }}
              variant="contained"
              sx={{
                backgroundColor: "#7ca577",
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#5d8c4f",
                },
              }}
            >
              Добавить
            </Button>
            <Button
              onClick={() => setIsDialogOpen(false)}
              variant="contained"
              sx={{
                backgroundColor: "#E57373",
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#C62828",
                },
              }}
            >
              Отменить
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default App;
