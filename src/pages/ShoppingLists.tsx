import React, { 
  useEffect, 
  useState 
} from "react";
import { 
  Box, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField, 
  Typography 
} from "@mui/material";
import { 
  useDispatch, 
  useSelector 
} from "react-redux";
import { 
  AppDispatch, 
  createList, 
  RootState 
} from "../store/store";
import { 
  getListFromDB, 
  saveListToDB 
} from "../db";
import Grid from '@mui/material/Grid2';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";

const ShoppingLists: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const lists = useSelector((state: RootState) => state.shoppingLists);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [listName, setListName] = useState("");

  // hook to control getting all lists from indexedDB
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

  // creating a new list
  const handleCreateList = () => {
    if (listName.trim() === "") {
      console.warn("List name is empty");
      return;
    }

    // call reducer to create the list and save it to DB
    // unique key based on the current date and time
    const listKey = `list-${Date.now()}`;
    dispatch(createList({ key: listKey, name: listName }));

    saveListToDB(listKey, {
      key: listKey,
      name: listName,
      items: [],
      total: 0,
    });

    setListName("");
    setIsDialogOpen(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h5" align="center" sx={{marginBottom: "2%"}}>
        Списки покупок
      </Typography>
      <Grid
        container
        spacing={3}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        {/* display all our lists */}
        {lists.length > 0 && (
          lists.map((list) => (
            <Grid key={list.key} sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/list/${list.key}`)}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  width: "200px",
                  borderColor: " #263f24",
                  color: " #263f24",
                  "&:hover": {
                    borderColor: "#7ca577",
                    backgroundColor: "rgba(148, 181, 145, 0.1)",
                  },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  padding: "15px",
                }}
              >
                <Typography>{list.name}</Typography>
              </Button>
            </Grid>
          ))
        )}
      </Grid>

      {/* button to add list */}
      <Grid
        container
        spacing={2}
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ marginTop: "20px" }}
      >
        <Button
          variant="outlined"
          onClick={() => setIsDialogOpen(true)}
          sx={{
            borderColor: " #263f24",
            color: "#263f24",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": {
              borderColor: "#7ca577",
              backgroundColor: "rgba(148, 181, 145, 0.1)",
            },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <AddIcon />
        </Button>
      </Grid>

      {/* dialog for creating new list */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>
          <Typography align="center" variant="h6" component="h2">
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
            <Button onClick={handleCreateList} variant="contained" color="success">
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
    </div>
  );
};

export default ShoppingLists;
