import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  Paper,
  TextField,
  styled,
  alpha,
  Autocomplete,
  TextFieldProps,
  InputAdornment
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, createList, deleteList, RootState } from "../store/store";
import { getListFromDB } from "../db";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useNavigate } from "react-router-dom";
import ClearIcon from '@mui/icons-material/Clear';

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

const ShoppingLists: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const lists = useSelector((state: RootState) => state.shoppingLists);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [listNameError, setListNameError] = useState(false);


  // fetch lists from IndexedDB
  useEffect(() => {
    (async () => {
      const allKeys = await getListFromDB("");
      const shoppingLists = [];
      for (const key of allKeys) {
        const list = await getListFromDB(key);
        if (list) shoppingLists.push(list);
      }
    })();
  }, [dispatch]);

  // create new list
  const handleCreateList = () => {
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
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#000000",
        }}
      >
        Списки покупок
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {lists.map((list) => (
          <Paper
            key={list.key}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 25px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              border: "1px solid #E0E3E7",
              color: "#000000",
              backgroundColor: "#FFFFFF",
              transition: "all 0.2s ease-in-out",
              borderRadius: "0px",
              "&:hover": {
                backgroundColor: "#F8F9FC",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.15)", 
              },
              cursor: "pointer",
            }}
            onClick={() => navigate(`/list/${list.key}`)}
          >
            <Typography sx={{ fontWeight: "600", color: "#0B1F33", fontSize: "16px" }}>
              {list.name}
            </Typography>

            <Button
              variant="outlined"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(deleteList(list.key));
              }}
              sx={{
                borderColor: "#D32F2F",
                color: "#D32F2F",
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                "&:hover": {
                  backgroundColor: "rgba(211, 47, 47, 0.1)",
                  borderColor: "#B71C1C",
                },
                "&:active": {
                  backgroundColor: "rgba(211, 47, 47, 0.2)",
                },
              }}
            >
              <DeleteOutlinedIcon sx={{ fontSize: 18 }} /> Удалить
            </Button>
          </Paper>
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
        <Button
          variant="contained"
          onClick={() => {
            setInputValue("");
            setListName(""); 
            setIsDialogOpen(true)
          }}
          sx={{
            backgroundColor: "#3C5099",
            color: "#FFFFFF",
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: "6px",
            padding: "6px 16px",
            "&:hover": {
              backgroundColor: "#2F3E77",
            },
            "&:active": {
              backgroundColor: "#1E2A5E",
            },
          }}
        >
          <AddIcon sx={{ marginRight: "6px" }} /> Создать
        </Button>
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
            }}
          >
            Отменить
          </Button>

          <Button
            onClick={handleCreateList}
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
            }}
          >
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShoppingLists;
