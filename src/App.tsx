import React from "react";
import AddIcon from '@mui/icons-material/Add';
import ShoppingLists from "./pages/ShoppingLists";
import History from "./pages/History";
import ListItems from "./pages/ListItems";
import { useState } from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab, Box, Button, Dialog, DialogTitle, TextField, DialogContent, DialogActions, DialogContentText } from "@mui/material";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { AppDispatch, clearHistoryList, createList } from "./store/store";
import { useDispatch } from "react-redux";
import { saveListToDB } from "./db";
import RubbishBinIcon from "./assets/rubbish-bin.svg";

// page for our navigation and header

const App: React.FC = () => {
  const location = useLocation();
  const currentTab = location.pathname;
  const dispatch = useDispatch<AppDispatch>();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  // clear all data after confirming
  const handleClearHistory = () => {
    dispatch(clearHistoryList());
    setConfirmOpen(false); 
  };

  const handleOpenConfirm = () => {
    setConfirmOpen(true); 
  };

  return (
    <Box className="app-container" sx={{ minHeight: "100vh", backgroundColor: "rgb(221, 230, 220)" }}>
      {/* header */}
      <AppBar position="sticky" sx={{ backgroundColor: "rgb(148, 181, 145)" }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Список Покупок
          </Typography>
          <Tabs value={currentTab} textColor="inherit" indicatorColor="primary">
              <Button
                color="inherit"
                onClick={() => setIsDialogOpen(true)}
                sx={{
                }}
              >
                <AddIcon />
              </Button>
              <Tab
                label="Списки"
                value="/lists"
                component={Link}
                to="/lists"
                sx={{ fontWeight: "bold" }}
              />
              <Tab
                label="История покупок"
                value="/history"
                component={Link}
                to="/history"
                sx={{ fontWeight: "bold" }}
              />
              <Button onClick={handleOpenConfirm}>
                <img src={RubbishBinIcon} style={{ width: '18px', height: '18px' }} />
              </Button>
          </Tabs>
        </Toolbar>

        {/* dialog box for clearing all history */}
        <Dialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
        >
          <DialogTitle sx={{
              display: "flex",
              justifyContent: "center",
              gap: "5px",
              width: "100%",
            }}>
              Очистить Историю
          </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Это очистит всю историю. Вы уверены, что хотите продолжить?
              </DialogContentText>
            </DialogContent>
          
          <DialogActions>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "5px",
                width: "100%",
              }}
            >
              <Button
                onClick={handleClearHistory}
                variant="contained"
                color="primary"
              >
                Удалить
              </Button>
              <Button
                onClick={() => setConfirmOpen(false)}
                variant="contained"
                color="error"
              >
                Отменить
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
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

      {/* option for adding a new list from the nav bar */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>
          <Typography align="center" variant="h6" component="h2">
            Добавить новый список
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            overflowY: "visible",
            position: "relative",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            label="Название списка"
            placeholder="Введите название"
            sx={{
              "& .MuiOutlinedInput-root": {
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
              gap: "5px",
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
                dispatch(createList({ key: listKey, name: listName}));
                saveListToDB(listKey, {
                  key: listKey,
                  name: listName, 
                  items: [],
                  total: 0,
                })

                setListName("");
                setIsDialogOpen(false);
              }}
              variant="contained"
              color="success"
            >
              Добавить
            </Button>
            <Button
              onClick={() => setIsDialogOpen(false)}
              variant="contained"
              color="error"
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
