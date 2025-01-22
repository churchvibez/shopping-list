import React from "react";
import CustomList from "../components/CustomList";
import RubbishBinIcon from "../assets/rubbish-bin.svg";
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
import Autocomplete from '@mui/material/Autocomplete';
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { addToActive, removeFromActive, clearActive } from "../store/store";
import { Item } from "../store/store";
import { useState } from "react";
import '../styles/main.scss';

const Active: React.FC = () => {
  const activeList = useSelector((state: RootState) => state.active);
  const historyList = useSelector((state: RootState) => state.history);
  const lastAdded = useSelector((state: RootState) => state.lastAdded);
  const dispatch = useDispatch<AppDispatch>();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [indices, setIndices] = useState("");

  const measurementUnits = [
    "килограммы",
    "литры",
    "штуки",
    "метры",
    "граммы",
    "миллилитры",
    "упаковки",
    "коробки",
    "литраж",
    "центнеры"
  ];

  const handleAdd = () => {
    if (product.trim()) {
      const newItem: Item = { name: product.trim(), amount: amount, indices: indices }; 
      dispatch(addToActive(newItem));
      setProduct("");
      setAmount("");
      setIndices("");
      setIsPopupOpen(false);
    }
  };

  const handleClearActive = () => {
    dispatch(clearActive());
  };

  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev);
  };

  return (
    <div className="container-fluid page-container">
      <div className="container mt-4">
        <Dialog
          open={isPopupOpen}
          onClose={togglePopup}
          fullWidth
          maxWidth="xl"
          sx={{
            '& .MuiDialog-paper': {
              width: '40%',
            },
          }}
        >
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
              <Grid container justifyContent="center" alignItems="center" spacing={3}>
              <Grid>
                  <Autocomplete
                    freeSolo
                    options={historyList.map((item) => item.name)}
                    value={product}
                    onChange={(_event, newValue) => setProduct(newValue || "")}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        variant="outlined"
                        value={indices}
                        onChange={(e) => setProduct(e.target.value)}
                        label="Название продукта"
                        placeholder="Например: хлеб..."
                          sx={{
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
                            '& .MuiInputBase-root': {
                              width: '202px',
                            },
                          }}
                        />
                    )}
                  />
                </Grid>

                <Grid>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    label="Количество"
                    placeholder="Например: 3..."
                    sx={{
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
                </Grid>

                <Grid>
                  <Autocomplete
                    freeSolo
                    options={measurementUnits}
                    value={indices}
                    onChange={(_event, newValue) => setIndices(newValue || "")}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        variant="outlined"
                        value={indices}
                        onChange={(e) => setIndices(e.target.value)}
                        label="Единицы измерения"
                        placeholder="Например: литры..."
                          sx={{
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
                            '& .MuiInputBase-root': {
                              width: '202px',
                            },
                          }}
                        />
                    )}
                  />
                </Grid>
              </Grid>
            </DialogContent>
              <Grid container justifyContent="center" spacing={2}>
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
              </Grid>
              {/* whitespace under the buttons */}
              <DialogActions
                sx={{
                  marginBottom: '10px',
                }}
              ></DialogActions>
        </Dialog>

        {/* either display list of items, or message saying empty */}
        <div>
          {activeList.length > 0 ? (
            <div className="custom-list">
              <CustomList 
              items={activeList} 
              onDelete={(itemName) => dispatch(removeFromActive(itemName))} 
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
            size={{ xs: 5, md: 4.8}}
          >
            {lastAdded.length > 0 ? (
              <List className="custom-list">
                {[...new Set(lastAdded)].map((item) => (
                  <ListItem key={item.name} className="custom-list-item">
                    <ListItemIcon>
                      <FormatListBulletedOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary={
                        <Typography
                          noWrap
                          sx = {{
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipses',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.name} - {item.amount} {item.indices}
                        </Typography>
                    }/>
                      <IconButton
                        edge="end"
                        color="primary"
                        onClick={() => dispatch(addToActive(item))}
                        disabled={activeList.some((activeItem) => activeItem.name === item.name)} 
                        sx={{
                          opacity: activeList.some((activeItem) => activeItem.name === item.name) ? 0.5 : 1,
                          pointerEvents: activeList.some((activeItem) => activeItem.name === item.name) ? "none" : "auto",
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
                  marginLeft: '30%',
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
