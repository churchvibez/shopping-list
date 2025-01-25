import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  RootState,
  AppDispatch,
  Item,
  removeItemFromList,
  addItemToList,
  selectTopRecommendations,
  updateItemInList,
  updateListTotal,
  removeItemFromListAndUpdateTotal,
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
} from "@mui/material";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid2";
import "../styles/main.scss";

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
    "ёгурт",
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
    "ъёмкостные баночки",
    "ъёмкость для масла",
    "ырка (сметана с зеленью)",
    "ьемкости для хранения",
    "эскимо",
    "эклеры",
    "эстрагон",
    "юкола",
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
  const shoppingList = useSelector((state: RootState) =>
    state.shoppingLists.find((list) => list.key === key)
  );
  
  const purchasedItems =
    shoppingList?.items.filter((item) => item.pricePerUnit !== undefined) || [];
  const inListItems =
    shoppingList?.items.filter((item) => item.pricePerUnit === undefined) || [];

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [indices, setIndices] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [isPricePopupOpen, setIsPricePopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [price, setPrice] = useState<string>("");

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

  const handleAdd = () => {
    if (product.trim()) {
      const newItem: Item = { name: product.trim(), amount: amount, indices: indices };
      dispatch(addItemToList({ key: key!, item: newItem }));
      setProduct("");
      setAmount("");
      setIndices("");
      setIsPopupOpen(false);
    }
  };

  const handleRemove = (listKey: string, itemName: string) => {
    dispatch(removeItemFromList({ listKey, itemName }));
  };

  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev);
  };

  return (
    <div className="container-fluid page-container">
      <div className="container mt-4">
    
  <Typography variant="h4" align="center" sx={{ flexGrow: 1, textAlign: "center" }}>
    List: {shoppingList?.name || "Список покупок"}
    <IconButton
        edge="end"
        color="error"
        onClick={() => {
            if (key) {
                dispatch(deleteList(shoppingList.key));
                navigate("/lists");
              }
        }}
    >
        <DeleteIcon />
    </IconButton>
  </Typography>


        {/* Dialog for adding items */}
        <Dialog
          open={isPopupOpen}
          onClose={togglePopup}
          fullWidth
          maxWidth="xl"
          sx={{
            "& .MuiDialog-paper": {
              width: "600px",
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
              {/* Left column */}
              <Grid item xs={6}>
                <Grid container spacing={4} direction="column" sx={{ marginTop: "7%" }}>
                  <Grid item>
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
                        />
                      )}
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      label="Количество"
                      placeholder="Например: 3..."
                      className="popup-input"
                    />
                  </Grid>

                  <Grid item>
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
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <DialogActions sx={{ marginTop: "10%" }}>
                  <Button variant="contained" color="success" onClick={handleAdd}>
                    Добавить
                  </Button>
                  <Button variant="outlined" color="error" onClick={togglePopup}>
                    Отменить
                  </Button>
                </DialogActions>
              </Grid>

              {/* Right column */}
              <Grid item xs={6}>
                <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} centered>
                  <Tab label="Рекомендации" />
                  <Tab label="А-Я" />
                </Tabs>
                {activeTab === 0 && (
                  <List sx={{ maxHeight: "300px", overflowY: "auto" }}>
                    {recommendations.map((item, index) => (
                      <ListItem key={index} button="true" onClick={() => setProduct(item.name)}>
                        <ListItemText primary={`${item.name}`} />
                      </ListItem>
                    ))}
                  </List>
                )}
                {activeTab === 1 && (
                  <List sx={{ maxHeight: "300px", overflowY: "auto" }}>
                    {russianProducts.map((letter, index) => (
                      <ListItem key={index} button="true" onClick={() => setProduct(letter)}>
                        <ListItemText primary={letter} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>

        {/* Display purchased and in-list items */}
        {shoppingList && shoppingList.items.length > 0 ? (
          <>
          <Typography
            variant="h5"
            align="center"
            sx={{ marginTop: "20px", textDecoration: "underline" }}
          >
            Purchased
          </Typography>
          
          <Grid className="centered-list-container">
          <List sx={{width: "50%"}}>
            {purchasedItems.map((item) => (
              <ListItem className="custom-list-item" key={item.name}>
                <ListItemIcon>
                  <FormatListBulletedOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`${item.name} - ${item.amount} ${item.indices}`}
                  secondary={`Total: ₽${(item.pricePerUnit! * parseFloat(item.amount)).toFixed(2)}`}
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
          
        
          <Typography
            variant="h5"
            align="center"
            sx={{ marginTop: "20px", textDecoration: "underline" }}
          >
            In List
          </Typography>
          <Grid className="centered-list-container">
          <List sx={{width: "50%"}}>
            {inListItems.map((item) => (
              <ListItem
                className="custom-list-item"
                key={item.name}
                button
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
              </ListItem>
            ))}
          </List>
          </Grid>
        </>
        
        ) : (
          <Typography align="center" variant="h6" color="textSecondary">
            Список пуст!
          </Typography>
        )}

        <Grid container justifyContent="center" sx={{ marginTop: "20px" }}>
          <Button
            variant="contained"
            color="success"
            onClick={togglePopup}
            className="add-button-centered"
          >
            <AddIcon />
          </Button>
        </Grid>

        {/* Dialog for price input */}
        <Dialog
          open={isPricePopupOpen}
          onClose={() => {
            setIsPricePopupOpen(false);
            setSelectedItem(null); // Clear the selected item when closed
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
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              label="Цена за штуку"
              placeholder="Введите цену"
              className="popup-input"
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                if (selectedItem && price.trim()) {
                  const totalSpent =
                    parseFloat(price) * parseFloat(selectedItem.amount);

                  // Dispatch action to update the list total
                  dispatch(
                    updateItemInList({
                      key: key!,
                      item: {
                        ...selectedItem,
                        pricePerUnit: parseFloat(price),
                      },
                    })
                  );

                  // Update the list total
                  const x = shoppingList?.total + totalSpent;
                  dispatch(
                    updateListTotal({
                      listKey: key!,
                      newTotal: x,
                    })
                  );

                  dispatch(
                    addToHistory({
                      item: selectedItem,
                      totalPrice: totalSpent,
                      pricePerUnit: parseFloat(price),
                    })
                  );

                  setPrice(""); // Reset price input
                  setIsPricePopupOpen(false); // Close dialog
                }
              }}
            >
              Добавить
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setIsPricePopupOpen(false);
                setSelectedItem(null); // Clear the selected item
                setPrice(""); // Reset price input
              }}
            >
              Отменить
            </Button>
          </DialogActions>
        </Dialog>
        <Typography variant="h6" color="textSecondary" align="center">
    Total: ₽{shoppingList?.total?.toFixed(2) || "0.00"}
  </Typography>
      </div>
    </div>
  );
};

export default ListItems;
