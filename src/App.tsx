import React from "react";
import AddIcon from '@mui/icons-material/Add';
import ShoppingLists from "./pages/ShoppingLists";
import History from "./pages/History";
import ListItems from "./pages/ListItems";
import { useState } from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab, Box, Button, Dialog, DialogTitle, TextField, DialogContent, DialogActions, TextFieldProps, styled, alpha, InputAdornment, IconButton, Autocomplete } from "@mui/material";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { AppDispatch, createList } from "./store/store";
import { useDispatch } from "react-redux";
import ClearIcon from '@mui/icons-material/Clear';

// page for our navigation and header

const CustomTextField = styled((props: TextFieldProps) => (
  <TextField
    {...props}
    variant="filled" 
  />
))(({ theme }) => ({
  "& .MuiFilledInput-root": {
    overflow: "hidden",
    borderRadius: 4,
    border: "1px solid #E0E3E7", 
    backgroundColor: "#FFFFFF",
    transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
    height: "52px",
    boxShadow: "none", 
    "&:before, &:after": {
      display: "none !important", 
    },
    "& input": {
      paddingTop: "14px",
      paddingBottom: "12px",
      lineHeight: "20px",
    },
    "&:hover": {
      borderColor: "#B2BAC2",
    },
    "&.Mui-focused": {
      borderColor: "#3C5099", 
      boxShadow: `${alpha("#3C5099", 0.25)} 0 0 0 2px`,
      "&:before, &:after": {
        display: "none !important",
      },
    },
    "&.Mui-error": {
      borderColor: "#D32F2F",
    },
  },

  "& .MuiInputLabel-root": {
    color: "#A6B2C3", 
    transform: "translate(14px, 14px)",
    transition: "transform 0.2s ease-in-out",
  },
  "& .MuiInputLabel-shrink": {
    transform: "translate(14px, 6px)",
    fontSize: "14px",
    color: "#A6B2C3 !important",
  },
}));

const App: React.FC = () => {
  const location = useLocation();
  const currentTab = location.pathname;
  const dispatch = useDispatch<AppDispatch>();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [listNameError, setListNameError] = useState(false);

  return (
    <Box className="app-container" sx={{
      minHeight: "100vh",
      backgroundColor: "#FFFFFF",
    }}>
      <AppBar position="sticky" sx={{ backgroundColor: "#3C5099" }}>
        <Toolbar>
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              color: "#FFFFFF",
            }}
          >
            Список Покупок
          </Typography>
          <Tabs
            value={currentTab}
            textColor="inherit"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
                "& .MuiTabs-indicator": {
                  display: "none",
                },
                "& .MuiTab-root": {
                fontWeight: "bold",
                color: "#FFFFFF",
                "&.Mui-selected": {
                  color: "#ffffff",
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
                fontSize: "18px",
              }}
            />
          </Tabs>
          <Button
            variant="outlined"
            onClick={() => {
              setInputValue("");
              setListName(""); 
              setIsDialogOpen(true)}}
            sx={{
              color: "#3C5099",
              backgroundColor: "#FFFFFF",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "8px",
              padding: "6px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "#F0F4FF",
              },
              "&:active": {
                backgroundColor: "#E0E8FF",
                borderColor: "#2A3D7F",
              },
              "&:focus-visible": {
                outline: "2px solid #87A4FF",
                outlineOffset: "2px",
              },
            }}
          >
            <AddIcon sx={{ fontSize: "18px", color: "#3C5099" }} /> Создать
          </Button>
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
        onClose={() => {
          setIsDialogOpen(false);
          setListNameError(false);
        }}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "8px",
            backgroundColor: "#FFFFFF",
            padding: "20px",
            width: "400px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {/* title and close button */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "18px", 
            fontWeight: "bold", 
            padding: "12px 20px",
          }}
        >
          Добавить новый список
          <IconButton
            onClick={() => {
              setIsDialogOpen(false)
              setListNameError(false); 
            }}
            sx={{
              color: "#A6A6A6", 
              "&:hover": { color: "#3C3C3C" },
            }}
          >
            <ClearIcon />
          </IconButton>
        </DialogTitle>

        {/* content (input field) */}
        <DialogContent sx={{ padding: "8px 20px" }}>
          <Autocomplete
            freeSolo
            options={[]} 
            inputValue={inputValue}
            onInputChange={(_, newValue) => {
              setInputValue(newValue);
              setListName(newValue);
              setListNameError(false); 
            }}
            disableClearable={true}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                label="Название списка"
                variant="filled"
                error={listNameError} 
                helperText={listNameError ? "Введите название списка" : ""} 
                style={{ marginTop: 8 }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: inputValue ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          setInputValue("");
                          setListName("");
                          setListNameError(false);
                        }}
                        edge="end"
                        aria-label="clear input"
                        sx={{ padding: 0, marginRight: "4px" }}
                      >
                        <ClearIcon sx={{ color: "#A6B2C3", fontSize: 18 }} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />
            )}
          />
        </DialogContent>

        {/* action buttons (bottom right) */}
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "12px 20px",
          }}
        >
          <Button
            onClick={() => {
              setIsDialogOpen(false)
              setListNameError(false); 
            }}
            variant="outlined"
            sx={{
              borderColor: "#C3C6CE",
              color: "#3C5099",
              backgroundColor: "#FFFFFF",
              textTransform: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              padding: "6px 16px",
              fontSize: "14px",
              "&:hover": {
              backgroundColor: "#F0F4FF",
              borderColor: "#3C5099",
          },
          "&:active": {
          backgroundColor: "#E0E8FF",
          borderColor: "#2A3D7F",
          },
          "&:focus-visible": {
          outline: "2px solid #87A4FF",
          outlineOffset: "2px",
          },
            }}
          >
            Отменить
          </Button>

          <Button
            onClick={() => {
                if (listName.trim() === "") {
                  setListNameError(true);
                  console.warn("list name is empty");
                  return;
                }
            
                const listKey = `list-${Date.now()}`;
                dispatch(createList({ key: listKey, name: listName }));
                setListName("");
                setInputValue("");
                setListNameError(false); 
                setIsDialogOpen(false);
            }}
            variant="contained"
            sx={{
              backgroundColor: "#3C5099",
              color: "#FFFFFF",
              textTransform: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              padding: "6px 16px",
              fontSize: "14px",
              marginLeft: "8px",
              "&:hover": {
                backgroundColor: "#2F3E77",
              },
              "&:active": {
                backgroundColor: "#1E2A5E",
              },
            }}
          >
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default App;
