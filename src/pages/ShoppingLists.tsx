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

    const listKey = `list-${Date.now()}`;

    // creates list on the page and entry in shoppingLists
    dispatch(createList({ key: listKey, name: listName }));
    setListName("");
    setIsDialogOpen(false);
  };
  
  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h5" align="center" sx={{
        marginBottom: "2%",
        fontWeight: "600",
        color: "#0046A1",
      }}>
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
                  width: "250px",
                  borderColor: "#94b591",
                  color: "#0046A1",
                  borderRadius: "8px",
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
              borderColor: "#94b591",
              color: "#0046A1",
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: "8px",
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
              backgroundColor: "#FAFAFA",
              borderRadius: "8px",
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
              gap: "10px",
              width: "100%",
            }}
          >
            <Button
              onClick={handleCreateList}
              variant="contained"
              sx={{
                backgroundColor: "#7ca577", 
                "&:hover": {
                  backgroundColor: "#5d8c4f",
                },
                color: "#FFFFFF",
              }}
            >
              Добавить
            </Button>
            <Button
              onClick={() => setIsDialogOpen(false)}
              variant="contained"
              sx={{
                backgroundColor: "#E57373",
                "&:hover": {
                  backgroundColor: "#C62828",
                },
                color: "#FFFFFF",
              }}
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
