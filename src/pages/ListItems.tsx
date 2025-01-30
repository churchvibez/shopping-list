import React, { useState } from "react";
import { useNavigate, 
  useParams 
} from "react-router-dom";
import { 
  useSelector, 
  useDispatch 
} from "react-redux";
import {
  RootState,
  AppDispatch,
  Item,
  addItemToList,
  selectTopRecommendations,
  updateItemInList,
  updateListTotal,
  addToHistory,
} from "../store/store";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  Autocomplete,
  Box,
  ListItemButton,
  styled,
  TextFieldProps,
  alpha,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid2";
import ClearIcon from '@mui/icons-material/Clear';
import "../styles/main.scss";

// list of all suggested products in alphabetical order

const russianProducts = Array.from(
  new Set([
    "апельсины",
    "арбуз",
    "ананас",
    "бананы",
    "батон",
    "блины",
    "вафли",
    "виноград",
    "варенье",
    "груши",
    "говядина",
    "гречка",
    "дыня",
    "дрожжи",
    "десерт",
    "ежевика",
    "ежики (из мяса)",
    "еда для кошек",
    "ёлочные игрушки",
    "ёжики (для дома)",
    "желе",
    "жареная картошка",
    "жареный хлеб",
    "зефир",
    "зелёный горошек",
    "зелёный чай",
    "икра",
    "инжир",
    "имбирь",
    "йогурт",
    "йод",
    "йогуртовый десерт",
    "капуста",
    "картофель",
    "кефир",
    "кетчуп",
    "курица",
    "лимоны",
    "лук",
    "лаваш",
    "молоко",
    "мёд",
    "макароны",
    "нектарины",
    "напитки",
    "нут",
    "огурцы",
    "оливковое масло",
    "овсянка",
    "помидоры",
    "перец",
    "пельмени",
    "рыба",
    "рис",
    "редька",
    "сыр",
    "сметана",
    "сок",
    "творог",
    "тыква",
    "томаты",
    "уксус",
    "укроп",
    "устрицы",
    "фасоль",
    "фрукты",
    "финики",
    "хлеб",
    "хурма",
    "хрен",
    "цветная капуста",
    "цукини",
    "цыплёнок",
    "чай",
    "черешня",
    "чеснок",
    "шоколад",
    "шампиньоны",
    "шарлотка",
    "щи",
    "щавель",
    "щука",
    "ёмкостные баночки",
    "ёмкость для масла",
    "эскимо",
    "эклеры",
    "южные фрукты",
    "яблоки",
    "ягоды",
    "яйца",
  ])
);

// custom text field for inputs
const StyledTextField = styled((props: TextFieldProps) => (
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


const ListItems: React.FC = () => {
  const { key } = useParams<{ key: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const recommendations = useSelector(selectTopRecommendations);
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [indices, setIndices] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [isPricePopupOpen, setIsPricePopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [price, setPrice] = useState<string>("");
  const [productError, setProductError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [indicesError, setIndicesError] = useState(false);
  const [priceError, setPriceError] = useState(false);

  const shoppingList = useSelector((state: RootState) =>
    state.shoppingLists.find((list) => list.key === key)
  );
  const purchasedItems =
    shoppingList?.items.filter((item) => item.pricePerUnit !== undefined) || [];
  const inListItems =
    shoppingList?.items.filter((item) => item.pricePerUnit === undefined) || [];

  const measurementUnits: Record<string, string> = {
    "килограммы": "кг",
    "литры": "л",
    "штуки": "шт",
    "метры": "м",
    "граммы": "г",
    "миллилитры": "мл",
    "упаковки": "уп.",
    "коробки": "кор.",
    "литраж": "л.",
    "центнеры": "ц.",
  };
  
  // logic for input requirement when adding a product
  const handleAdd = () => {
    let valid = true;
  
    if (!product.trim()) {
      setProductError(true);
      valid = false;
    } else {
      setProductError(false);
    }
  
    if (!amount.trim()) {
      setAmountError(true);
      valid = false;
    } else {
      setAmountError(false);
    }
  
    if (!indices.trim()) {
      setIndicesError(true);
      valid = false;
    } else {
      setIndicesError(false);
    }
  
    if (!valid) return;
  
    const newItem: Item = { name: product.trim(), amount: amount, indices: indices };
    dispatch(addItemToList({ key: key!, item: newItem }));

    setProduct("");
    setAmount("");
    setIndices("");
    setIsPopupOpen(false);
  };

  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev);
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
  <div className="container-fluid page-container" style={{ maxWidth: "70%" }}>
    <div className="container mt-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
      
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "10px 0",
        position: "relative",
      }}
    >
      <Button
        startIcon={<ArrowBackIcon />}
        sx={{
          position: "absolute", 
          left: "-85px",
          backgroundColor: "transparent",
          color: "#3057D5",
          textTransform: "none",
          "&:hover": { textDecoration: "underline" },
        }}
        onClick={() => navigate("/lists")}
      >
        Назад
      </Button>

      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: "#0046a1",
          textAlign: "left",
          marginLeft: "10px", 
          flexGrow: 1,
        }}
      >
        Список: {shoppingList?.name || "Список покупок"}
      </Typography>
    </Box>

    <Dialog
      open={isPopupOpen}
      onClose={() => {
        togglePopup();
      }}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          width: "95%",
          height: "500px",
          paddingLeft: "10px",
          borderRadius: "12px", 
          backgroundColor: "#ffffff", 
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
            togglePopup();
          }}
          sx={{
            color: "#A6A6A6",
            "&:hover": { color: "#3C3C3C" },
          }}
        >
          <ClearIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={4}>
          <Grid>
            <Grid container direction="column" sx={{ marginTop: "7%", gap: "33px" }}>
              
            {/* product name */}
            <Grid>
              <Autocomplete
                freeSolo
                options={Array.from(
                  new Set([
                    ...recommendations.map((item) => item.name.toLowerCase()),
                    ...russianProducts.map((product) => product.toLowerCase()),
                  ])
                )}
                value={product}
                onInputChange={(_, newValue) => {
                  setProduct(newValue);
                  setProductError(false);
                }}
                disableClearable={true}
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    sx={{ width: "265px" }}
                    label="Название продукта"
                    variant="filled"
                    error={productError}
                    helperText={productError ? "Введите название продукта" : ""}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: product ? (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setProduct("")}
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
            </Grid>
              
              {/* quantity */}
              <Grid>
                <Autocomplete
                  freeSolo
                  options={[]} 
                  inputValue={amount}
                  onInputChange={(_, newValue) => {
                    if (/^\d*$/.test(newValue)) { 
                      setAmount(newValue);
                      setAmountError(false);
                    }
                  }}
                  disableClearable={true}
                  renderInput={(params) => (
                    <StyledTextField
                      {...params}
                      sx={{ width: "265px" }}
                      variant="filled"
                      label="Количество"
                      placeholder="Например: 3..."
                      error={amountError} 
                      helperText={amountError ? "Введите количество" : ""}
                      InputProps={{
                        endAdornment: amount ? (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setAmount("")}
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
              </Grid>

              {/* Measurement Units */}
              <Grid>
                <Autocomplete
                  freeSolo
                  options={Object.keys(measurementUnits)}
                  value={indices}
                  onInputChange={(_, newValue) => {
                    setIndices(measurementUnits[newValue] || newValue);
                    setIndicesError(false);
                  }}
                  disableClearable={true}
                  renderInput={(params) => (
                    <StyledTextField
                      {...params}
                      sx={{ width: "265px" }}
                      label="Единицы измерения"
                      variant="filled"
                      error={indicesError}
                      helperText={indicesError ? "Выберите единицы измерения" : ""}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: indices ? (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setIndices("")}
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
              </Grid>
            </Grid>
          </Grid>
          {/* recommendations and items by alphabet */}
          <Grid sx={{ width: "200px", flexShrink: 0 }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} centered sx={{
              "& .MuiTabs-flexContainer": {
                paddingLeft: "20px",
              },
            }}>
              <Tab label="Рекомендации" />
              <Tab label="А-Я" />
            </Tabs>
            {activeTab === 0 && (
              <List sx={{ maxHeight: "210px", overflowY: "auto", borderRadius: "8px", padding: "5px" }}>
                {recommendations.map((item, index) => (
                  <ListItemButton
                    sx={{
                      whiteSpace: "normal",
                      overflowWrap: "break-word",
                      wordBreak: "break-word"
                    }}
                    key={index}
                    onClick={() => setProduct(item.name)}
                  >
                    <ListItemText 
                      sx={{
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                      }}
                    primary={`${item.name}`} />
                  </ListItemButton>
                ))}
              </List>
            )}
            {activeTab === 1 && (
              <List sx={{ maxHeight: "190px", overflowY: "auto", borderRadius: "8px", padding: "5px" }}>

                {russianProducts.map((letter, index) => (
                  <ListItemButton key={index} onClick={() => setProduct(letter)}>
                    <ListItemText primary={letter} />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Grid>
          {/* buttons at the bottom  */}
          <Grid sx={{ display: "flex", justifyContent: "flex-end", width: "520px" }}>
          <DialogActions
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center", 
                padding: "15px",
              }}
            >
              <Button
                onClick={() => {
                  togglePopup();
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
                onClick={handleAdd}
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
                    backgroundColor: "#B71C1C",
                  },
                  "&:active": {
                    backgroundColor: "#9A1B1B",
                  },
                }}
              >
                Добавить
              </Button>
            </DialogActions>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>

    {/* not purchased */}
    <Typography
      variant="h6"
      sx={{
        marginTop: "20px",
        marginLeft: "10px",
        fontWeight: "bold",
        color: "#0046a1",
      }}
    >
      В списке
    </Typography>

    <List
      sx={{
        width: "100%",
        maxWidth: "600px",
        wordBreak: "break-word",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        padding: "10px",
      }}
    >
      {inListItems.length > 0 ? (
        inListItems.map((item) => (
          <ListItemButton
            key={item.name}
            onClick={() => {
              setSelectedItem(item);
              setIsPricePopupOpen(true);
            }}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography
                  variant="body1"
                  sx={{
                    width: "70%",
                    fontWeight: "500",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {capitalizeFirstLetter(item.name)}
                </Typography>

                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.amount} {item.indices}
                </Typography>
              </ListItemButton>

            ))
      ) : (
        <Typography align="center" color="textSecondary" variant="body1">
          Нет товаров в списке
        </Typography>
      )}
    </List>

    {/* purchased items */}

    <Grid container justifyContent="space-between" alignItems="center">
      <Typography
        variant="h6"
        align="left"
        sx={{
          marginTop: "30px",
          marginLeft: "10px",
          fontWeight: "bold",
          color: "#0046a1",
        }}
      >
        Куплено
      </Typography>
      <Typography
        variant="body1"
        color="textSecondary"
        sx={{
          marginTop: "30px",
          marginLeft: "10px",
          fontWeight: "bold",
          color: "#0046a1",
        }}
      >
        Общая сумма: ₽{shoppingList?.total?.toFixed(2) || "0.00"}
      </Typography>
    </Grid>

    <List
      sx={{
        width: "100%",
        maxWidth: "600px",
        wordBreak: "break-word",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        padding: "10px",
      }}
    >
      {purchasedItems.length > 0 ? (
        purchasedItems.map((item) => (
          <ListItem
            key={item.name}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
                sx={{
                  width: "70%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {capitalizeFirstLetter(item.name)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                  >
                    {`Сумма: ₽${(item.pricePerUnit! * parseFloat(item.amount)).toFixed(2)}`}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  {item.amount} {item.indices}
                </Typography>
              </ListItem>
            ))
      ) : (
        <Typography align="center" color="textSecondary" variant="body1">
          Нет купленных товаров
        </Typography>
      )}
    </List>

      {/* add item button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
        <Button
          variant="contained"
          onClick={togglePopup}
          sx={{
            backgroundColor: "#3C5099",
            color: "#FFFFFF",
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: "6px",
            padding: "6px 16px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            "&:hover": {
              backgroundColor: "#2F3E77",
            },
            "&:active": {
              backgroundColor: "#1E2A5E",
            },
          }}
        >
          <AddIcon sx={{ fontSize: "20px" }} /> Добавить
        </Button>
      </Box>

       {/* popup for adding the price of a product */}
       <Dialog
        open={isPricePopupOpen}
        onClose={() => {
          setIsPricePopupOpen(false);
          setSelectedItem(null);
          setPrice("");
          setPriceError(false);
        }}
        fullWidth
        maxWidth="xs"
        sx={{
          "& .MuiDialog-paper": {
            width: "90%",
            maxWidth: "400px",
            borderRadius: "8px",
            backgroundColor: "#FFFFFF",
            padding: "20px",
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
          Укажите цену
          <IconButton
            onClick={() => {
              setIsPricePopupOpen(false);
              setSelectedItem(null);
              setPrice("");
              setPriceError(false); 
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
            inputValue={price}
            onInputChange={(_, newValue) => {
              if (newValue === "" || /^\d+(\.\d{0,2})?$/.test(newValue)) {
                setPrice(newValue);
                setPriceError(false);
              }
            }}
            disableClearable={true}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                label="Цена за штуку"
                variant="filled"
                placeholder="Введите цену"
                error={priceError}
                helperText={priceError ? "Введите цену за штуку" : ""}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: price ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setPrice("")}
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
              setIsPricePopupOpen(false);
              setSelectedItem(null);
              setPrice("");
              setPriceError(false);
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
              if (!price.trim()) {
                setPriceError(true);
                return;
              }

              if (selectedItem) {
                const totalSpent = parseFloat(price) * parseFloat(selectedItem.amount);

                dispatch(
                  updateItemInList({
                    key: key!,
                    item: {
                      ...selectedItem,
                      pricePerUnit: parseFloat(price),
                    },
                  })
                );

                const newTotal = (shoppingList?.total ?? 0) + totalSpent;
                dispatch(
                  updateListTotal({
                    listKey: key!,
                    newTotal: newTotal,
                  })
                );

                dispatch(
                  addToHistory({
                    listKey: key!,
                    item: selectedItem,
                    totalPrice: totalSpent,
                    pricePerUnit: parseFloat(price),
                  })
                );

                setPrice("");
                setIsPricePopupOpen(false);
                setPriceError(false);
              }
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
                backgroundColor: "#B71C1C",
              },
              "&:active": {
                backgroundColor: "#9A1B1B",
              },
            }}
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  </div>
);

};

export default ListItems;
