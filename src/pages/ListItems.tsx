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
} from "@mui/material";
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
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          margin: "0",
        }}
      >
        <Button
        startIcon={<ArrowBackIcon />}
        sx={{
          position: "absolute",
            top: "0",
            left: "0",
            margin: "10px",
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
            marginTop: "13px",
            fontWeight: "bold",
            color: "#0046a1",
          }}
        >
          Список: {shoppingList?.name || "Список покупок"}
        </Typography>
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
              borderRadius: "12px", 
              padding: "20px",
              backgroundColor: "#F8F9FA", 
            },
          }}
        >
          <DialogTitle>
            <Typography align="center" variant="h6" component="h2" sx={{ fontWeight: 600, color: "#0046A1" }}>
              Добавить продукт
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={4}>
              <Grid>
                <Grid container direction="column" sx={{ marginTop: "7%" }}>
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
                          sx={{
                            backgroundColor: "#FAFAFA",
                            borderRadius: "8px",
                            padding: "10px",
                          }}
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
                      sx={{
                        backgroundColor: "#FAFAFA",
                        borderRadius: "8px",
                        padding: "10px",
                      }}
                    />
                  </Grid>

                  {/* input field for product measurements*/}
                  <Grid>
                    <Autocomplete
                      freeSolo
                      options={Object.keys(measurementUnits)}
                      value={indices}
                      onInputChange={(_, newValue) => {
                        setIndices(measurementUnits[newValue] || newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          label="Единицы измерения"
                          placeholder="Например: литры..."
                          className="popup-input"
                          error={indicesError}
                          helperText={indicesError ? "Требуется" : ""}
                          sx={{
                            backgroundColor: "#FAFAFA",
                            borderRadius: "8px",
                            padding: "10px",
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <DialogActions>
                  <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: "10px", padding: "10px" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleAdd}
                      sx={{ fontWeight: 600 }}
                    >
                      Добавить
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      onClick={togglePopup}
                      sx={{ fontWeight: 600 }}
                    >
                      Отменить
                    </Button>
                  </Box>
                </DialogActions>

              </Grid>
              {/* recommendations and items by alphabet */}
              <Grid sx={{width: "220px"}}>
                <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} centered>
                  <Tab label="Рекомендации" />
                  <Tab label="А-Я" />
                </Tabs>
                {activeTab === 0 && (
                  <List sx={{ maxHeight: "300px", overflowY: "auto", backgroundColor: "#F1F3F5", borderRadius: "8px", padding: "5px" }}>

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
                  <List sx={{ maxHeight: "300px", overflowY: "auto", backgroundColor: "#F1F3F5", borderRadius: "8px", padding: "5px" }}>

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

      {/* Items Not Purchased */}
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
          backgroundColor: "#f7f9fc",
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

      {/* Purchased Items */}

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
          backgroundColor: "#f7f9fc",
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

      {/* Add Item Button */}
      <Grid container justifyContent="center" sx={{ marginTop: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={togglePopup}
          sx={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
          }}
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
            <Typography align="center" variant="h6" component="h2" sx={{ fontWeight: 600, color: "#0046A1" }}>
              Укажите цену
            </Typography>
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              variant="outlined"
              type="text"
              value={price}
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
              sx={{
                backgroundColor: "#FAFAFA",
                borderRadius: "8px",
                padding: "10px",
                marginTop: "10px",
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
                      listKey: key!,
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

    </div>
  </div>
);

};

export default ListItems;
