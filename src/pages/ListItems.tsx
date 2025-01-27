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
  removeItemFromList,
  addItemToList,
  selectTopRecommendations,
  updateItemInList,
  updateListTotal,
  addToHistory,
  deleteList,
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
  ListItemIcon,
  ListItemText,
  IconButton,
  Tabs,
  Tab,
  Autocomplete,
  Box,
  ListItemButton,
} from "@mui/material";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid2";
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

  const shoppingList = useSelector((state: RootState) =>
    state.shoppingLists.find((list) => list.key === key)
  );
  const purchasedItems =
    shoppingList?.items.filter((item) => item.pricePerUnit !== undefined) || [];
  const inListItems =
    shoppingList?.items.filter((item) => item.pricePerUnit === undefined) || [];

  // measurement units when adding a product
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
    "центнеры",
  ];

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

  return (
    <div className="container-fluid page-container">
      <div className="container mt-4" style={{maxWidth: "100%", margin: "0 auto"}}>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            margin: "0 0px",
          }}
        >
          {/* arrow to go back to list of lists */}
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate("/lists")}
            sx={{ marginRight: "auto" }}
          >
            <ArrowBackIcon />
          </IconButton>
          {/* total price of the list */}
          <Typography
            variant="h5"
            align="center"
            sx={{
              flexGrow: 1,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Список: {shoppingList?.name || "Список покупок"}
          </Typography>

          <IconButton
            edge="end"
            color="error"
            onClick={() => {
              if (shoppingList?.key) {
                dispatch(deleteList(shoppingList.key));
                navigate("/lists");
              } else {
                console.warn("list doesn't have a key");
              }
            }}
            sx={{ marginLeft: "auto" }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>

        {/* dialog to add a product */}
        <Dialog
          open={isPopupOpen}
          onClose={togglePopup}
          fullWidth
          maxWidth="sm"
          sx={{
            "& .MuiDialog-paper": {
              width: "95%",
              height: "500px",
            },
          }}
        >
          <DialogTitle>
            <Typography align="center" variant="h6" component="h2">
              Добавить продукт
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={4}>
              <Grid>
                <Grid container spacing={4} direction="column" sx={{ marginTop: "7%" }}>
                  {/* input field for product name */}
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
                      onInputChange={(_, newValue) => setProduct(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          label="Название продукта"
                          placeholder="Например: хлеб..."
                          className="popup-input"
                          error={productError}
                          helperText={productError ? "Требуется": ""}
                        />
                      )}
                    />
                  </Grid>
                  
                  {/* input field for product quantity */}
                  <Grid>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={amount}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          setAmount(value);
                        }
                      }}
                      label="Количество"
                      placeholder="Например: 3..."
                      className="popup-input"
                      error={amountError}
                      helperText={amountError ? "Требуется": ""}
                    />
                  </Grid>

                  {/* input field for product measurements*/}
                  <Grid>
                    <Autocomplete
                      freeSolo
                      options={measurementUnits}
                      value={indices}
                      onInputChange={(_, newValue) => setIndices(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          label="Единицы измерения"
                          placeholder="Например: литры..."
                          className="popup-input"
                          error={indicesError}
                          helperText={indicesError ? "Требуется": ""}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <DialogActions sx={{ marginTop: "10%" }}>
                  <Button variant="contained" color="success" onClick={handleAdd}>
                    Добавить
                  </Button>
                  <Button variant="contained" color="error" onClick={togglePopup}>
                    Отменить
                  </Button>
                </DialogActions>
              </Grid>

              {/* recommendations and items by alphabet */}
              <Grid sx={{width: "260px"}}>
                <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} centered>
                  <Tab label="Рекомендации" />
                  <Tab label="А-Я" />
                </Tabs>
                {activeTab === 0 && (
                  <List sx={{ maxHeight: "300px", overflowY: "auto" }}>
                    {recommendations.map((item, index) => (
                      <ListItemButton
                        sx={{
                          whiteSpace: "normal",
                          overflowWrap: "break-word",
                          wordBreak: "break-word",
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
                  <List sx={{ maxHeight: "300px", overflowY: "auto" }}>
                    {russianProducts.map((letter, index) => (
                      <ListItemButton key={index} onClick={() => setProduct(letter)}>
                        <ListItemText primary={letter} />
                      </ListItemButton>
                    ))}
                  </List>
                )}
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>

        {/* items the user has purchased in that list */}
        {shoppingList && shoppingList.items.length > 0 ? (
          <>
          <Typography
            variant="h5"
            align="center"
            sx={{ marginTop: "20px", textDecoration: "underline" }}
          >
            Куплено
          </Typography>
        
          <Grid container justifyContent="center" sx={{ padding: "0 10px" }}>
            <List sx={{ width: "100%", maxWidth: "600px", wordBreak: "break-word" }}>
              {purchasedItems.map((item) => (
                <ListItem className="custom-list-item" key={item.name}>
                  <ListItemIcon>
                    <FormatListBulletedOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${item.name} - ${item.amount} ${item.indices}`}
                    secondary={`Сумма: ₽${(item.pricePerUnit! * parseFloat(item.amount)).toFixed(2)}`}
                    
                  />
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => {
                      dispatch(removeItemFromList({ listKey: key!, itemName: item.name }));
                      dispatch(
                        updateListTotal({
                          listKey: key!,
                          newTotal:
                            shoppingList.total -
                            item.pricePerUnit! * parseFloat(item.amount),
                        })
                      );
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Grid>
        
          {/* items the user has not purchased yet */}
          <Typography
            variant="h5"
            align="center"
            sx={{ marginTop: "20px", textDecoration: "underline", fontSize: "1.2rem" }}
          >
            В списке
          </Typography>
          <Grid container justifyContent="center" sx={{ padding: "0 10px" }}>
            <List sx={{ width: "100%", maxWidth: "600px", wordBreak: "break-word" }}>
              {inListItems.map((item) => (
                <ListItemButton
                  className="custom-list-item"
                  key={item.name}
                  onClick={() => {
                    setSelectedItem(item);
                    setIsPricePopupOpen(true);
                  }}
                >
                  <ListItemIcon>
                    <FormatListBulletedOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${item.name} - ${item.amount} ${item.indices}`}
                  />
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(removeItemFromList({ listKey: key!, itemName: item.name }));
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemButton>
              ))}
            </List>
          </Grid>
        </>
        ) : (
          <Typography align="center" variant="h6" color="textSecondary">
            Список пуст!
          </Typography>
        )}

        <Grid container justifyContent="center" sx={{ marginTop: "20px", padding: "0 10px" }}>
          <Button
            variant="contained"
            color="success"
            onClick={togglePopup}
            sx={{ width: "60px", height: "60px", borderRadius: "50%" }}
          >
            <AddIcon />
          </Button>
        </Grid>


        {/* popup for adding the price of a product */}
        <Dialog
          open={isPricePopupOpen}
          onClose={() => {
            setIsPricePopupOpen(false);
            setSelectedItem(null);
          }}
          fullWidth
          maxWidth="xs"
          sx={{
            "& .MuiDialog-paper": {
              width: "90%",
              maxWidth: "400px",
            },
          }}
        >

          <DialogTitle>
            <Typography align="center" variant="h6" component="h2">
              Укажите цену
            </Typography>
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              variant="outlined"
              type="text"
              value={price}
              sx={{marginTop: "2%"}}
              onChange={(e) => {
                const value = e.target.value;
                // this ensures that we only have only numbers
                // 1 decimal point, and only 2 numbers after the d.p.
                if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
                  setPrice(value);
                }
              }}
              label="Цена за штуку"
              placeholder="Введите цену"
              className="popup-input"
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
              variant="contained"
              color="success"
              onClick={() => {
                if (selectedItem && price.trim()) {
                  const totalSpent = parseFloat(price) * parseFloat(selectedItem.amount);

                  // update the item price in the list 
                  dispatch(
                    updateItemInList({
                      key: key!,
                      item: {
                        ...selectedItem,
                        pricePerUnit: parseFloat(price),
                      },
                    })
                  );
                  
                  // update the list total
                  const x = (shoppingList?.total ?? 0) + totalSpent;
                  dispatch(
                    updateListTotal({
                      listKey: key!,
                      newTotal: x,
                    })
                  );

                  // add the purchased item to the history
                  dispatch(
                    addToHistory({
                      item: selectedItem,
                      totalPrice: totalSpent,
                      pricePerUnit: parseFloat(price),
                    })
                  );

                  setPrice("");
                  setIsPricePopupOpen(false);
                }
              }}
            >
              Добавить
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setIsPricePopupOpen(false);
                setSelectedItem(null);
                setPrice("");
              }}
            >
              Отменить
            </Button>
            </Box>
          </DialogActions>
        </Dialog>

        {/* total for that shopping list */}
        <Typography
          variant="h6"
          color="textSecondary"
          align="center"
          sx={{ fontSize: "1rem", marginBottom: "20px", marginTop: "10px" }}
        >
          Общая сумма: ₽{shoppingList?.total?.toFixed(2) || "0.00"}
        </Typography>

        
      </div>
    </div>
  );
};

export default ListItems;
