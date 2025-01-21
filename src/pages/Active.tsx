import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { addToActive, removeFromActive, clearActive } from "../store/store";
import CustomList from "../components/CustomList";
import RubbishBinIcon from "../assets/rubbish-bin.svg";
import '../styles/main.scss';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';

const Active: React.FC = () => {
  const activeList = useSelector((state: RootState) => state.active);
  const historyList = useSelector((state: RootState) => state.history);
  const lastAdded = useSelector((state: RootState) => state.lastAdded);
  const dispatch = useDispatch<AppDispatch>();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [product, setProduct] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleAdd = () => {
    if (product.trim()) {
      dispatch(addToActive(product.trim()));
      setProduct("");
      setIsPopupOpen(false);
    }
  };

  const handleRemove = (item: string) => {
    dispatch(removeFromActive(item));
  };

  const handleClearActive = () => {
    dispatch(clearActive());
  };

  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev);
    setSuggestions([]);
  };

  // functionality for autocompletion
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setProduct(input);

    // handle empty input
    if (input.trim() === "") {
      setSuggestions([]);
      return;
    }

    // retrieve suggestions from list of previous items added
    const filteredSuggestions = historyList.filter((item) => 
      item.toLowerCase().includes(input.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  }

  return (
    <div className="container-fluid page-container">
      <div className="container mt-4">
        <Dialog open={isPopupOpen} onClose={togglePopup}>
          <DialogTitle>
            <Typography align="center" variant="h6" component="h2">
              Добавить продукт
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
              value={product}
              onChange={handleInputChange}
              label="Например: хлеб..."
              placeholder="Введите продукт"
              sx={{
                marginTop: '15px',
                marginBottom: '15px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#94b591', 
                  },
                  '&:hover fieldset': {
                    borderColor: '#7ca577',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#5d8c4f',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#94b591',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#5d8c4f',
                },
              }}
            />
            {suggestions.length > 0 && (
              <ul className="autocomplete-list">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="autocomplete-item"
                  onClick={() => {
                    setProduct(suggestion);
                    setSuggestions([]);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{
                color: "#94b591",
                borderColor: "#94b591",
                "&:hover": {
                  borderColor: "#94b591",
                  backgroundColor: "rgba(29, 98, 202, 0.1)",
                },
              }}
            >
              Добавить
            </Button>
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={togglePopup}
              sx={{
                color: "rgb(255, 87, 87)",
                borderColor: "rgb(255, 87, 87)",
                "&:hover": {
                  borderColor: "rgb(255, 87, 87)",
                  backgroundColor: "rgba(255, 0, 0, 0.1)",
                },
              }}
            >
              Отменить
            </Button>
          </DialogActions>
        </Dialog>

        {/* either display list of items, or message saying empty */}
        <div>
          {activeList.length > 0 ? (
            <div className="custom-list">
              <CustomList 
              items={activeList} 
              onDelete={handleRemove} 
            />
            </div>
          ) : (
              <Typography
                variant="h4"
                align="center"
                color="textSecondary"
              >
                Список покупок пуст!
              </Typography>
          )}
        </div>

        <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ marginTop: '20px' }}>
          {activeList.length > 0 && (
            <Grid>
              <Button onClick={handleClearActive}>
                <img src={RubbishBinIcon} alt="Очистить" style={{ width: '25px', height: '25px' }} />
              </Button>
            </Grid>
          )}
          <Grid>
            <Button
              variant="contained"
              color="success"
              onClick={togglePopup}
              sx={{
                '&:hover': {
                  backgroundColor: '#9fd47f',
                },
              }}
            >
              <AddIcon />
            </Button>
          </Grid>
        </Grid>

      
        <Grid 
          container 
          direction="column" 
          alignItems="center"
          sx={{ marginTop: '5%' }}
        >
          <Grid>
            <Typography variant="h6" align="center">
              Последние продукты
            </Typography>
          </Grid>
          <Grid 
            size={{ xs: 5, md: 6}}
            sx= {{
              marginLeft: '10%',
            }}
          >
            {lastAdded.length > 0 ? (
              <List className="custom-list">
                {[...new Set(lastAdded)].map((item) => (
                  <ListItem key={item} className="custom-list-item">
                    <ListItemIcon>
                      <FormatListBulletedOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={() => dispatch(addToActive(item))}
                      disabled={activeList.includes(item)} 
                      sx={{
                        opacity: activeList.includes(item) ? 0.5 : 1,
                        pointerEvents: activeList.includes(item) ? 'none' : 'auto',
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography
                align="center"
                sx={{
                  textAlign: 'center',
                  marginLeft: '15%',
                  transform: 'translateX(-20.5%)',
                }}
              >
                Нет добавленных товаров!
              </Typography>
            )}
          </Grid>
        </Grid>
        </div>
      </div>
  );
};

export default Active;
