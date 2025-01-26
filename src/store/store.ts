import { configureStore, createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { saveListToDB, getListFromDB, saveHistoryToDB, getHistoryFromDB, clearAllDBStores, deleteListFromDB } from "../db";
import { WritableDraft } from "immer";

// define the interface for our item, shopping list and initial state

export interface Item {
  name: string;
  amount: string;
  indices: string;
  popularity?: number; 
  pricePerUnit?: number; 
}

export interface ShoppingList {
  key: string; 
  name: string;
  items: Item[];
  total: number; 
}

export interface HistoryItem extends Item {
  totalPrice: number;
}

interface AppState {
  shoppingLists: ShoppingList[];
  history: {
    items: HistoryItem[];
    totalSpent: number; 
  };
}

const initialState: AppState = {
  shoppingLists: [],
  history: {
    items: [],
    totalSpent: 0,
  },
};

// create the redux slice with all reducers
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    createList(state, action: PayloadAction<{ key: string; name: string }>) {
      state.shoppingLists.push({ key: action.payload.key, name: action.payload.name, items: [], total: 0 });
    },

    addItemToList(state, action: PayloadAction<{ key: string; item: Item }>) {
        const { key, item } = action.payload;  
        const lowerItemName = item.name.toLowerCase();
        const list = state.shoppingLists.find((list) => list.key === key);
    
        if (list) {
            const exists = list.items.some((existingItem) => existingItem.name.toLowerCase() === lowerItemName);
    
            if (exists) {
                console.warn(`"${item.name}" already in list`);
                return;
            }
    
            list.items.push({
                ...item,
                name: lowerItemName,
            });
    
        }
    },

    updateItemInList(state, action: PayloadAction<{ key: string; item: Item }>) {
        const { key, item } = action.payload;
        const list = state.shoppingLists.find((list) => list.key === key);
        if (list) {
          const index = list.items.findIndex((i) => i.name === item.name);
          if (index > -1) {
            list.items[index] = item;
      
            list.total = list.items.reduce((acc, curr) => {
              const price = curr.pricePerUnit ? parseFloat(curr.pricePerUnit.toString()) : 0;
              const amount = curr.amount ? parseFloat(curr.amount.toString()) : 0;
              return acc + price * amount;
            }, 0);
          }
        }
      },
      
    removeItemFromList(state, action: PayloadAction<{ listKey: string; itemName: string }>) {
        const { listKey, itemName } = action.payload;
        const normalizedItemName = itemName.toLowerCase();
    
        const list = state.shoppingLists.find((list) => list.key === listKey);
        if (list) {
            list.items = list.items.filter((item) => item.name.toLowerCase() !== normalizedItemName);
        }
    },
    
    purchaseItem(
        state,
        action: PayloadAction<{ listKey: string; itemName: string; pricePerUnit: number }>
      ) {
        const { listKey, itemName, pricePerUnit } = action.payload;
        const shoppingList = state.shoppingLists.find((list) => list.key === listKey);
      
        if (shoppingList) {
          const item = shoppingList.items.find((i) => i.name === itemName);
          
          if (item) {
            const totalSpent = parseFloat(item.amount) * pricePerUnit;
            const historyItem = state.history.items.find((h) => h.name.toLowerCase() === item.name.toLowerCase());
            
            if (historyItem) {
              historyItem.popularity = (historyItem.popularity || 0) + 1;
              historyItem.totalPrice += totalSpent;
            } else {
              state.history.items.push({
                ...item,
                totalPrice: totalSpent,
                pricePerUnit,
                popularity: 1,
              });
            }
      
            state.history.totalSpent += totalSpent;
            const newTotal = (shoppingList.total || 0) + totalSpent;
            shoppingList.total = newTotal;
            shoppingList.items = shoppingList.items.filter((i) => i.name !== itemName);
          }
        }
      }, 
      
    clearList(state, action: PayloadAction<string>) {
      const list = state.shoppingLists.find((list) => list.key === action.payload);
      if (list) {
        list.items = [];
        list.total = 0;
      }
    },

    clearHistoryList(state) {
        state.history.items = [];
        state.history.totalSpent = 0;
        state.shoppingLists = [];

        (async () => {
            await clearAllDBStores();
        })();
    },
    
    loadFromDB(_state, action: PayloadAction<AppState>) {
      return {
        ...initialState,
        ...action.payload,
      };
    },

    addToHistory(
      state: WritableDraft<AppState>,
      action: PayloadAction<{ item: Item; totalPrice: number; pricePerUnit: number }>
      ) {
        const { item, totalPrice, pricePerUnit } = action.payload;
        const normalizedItemName = item.name.toLowerCase();
        const historyItem = state.history.items.find(
            (h) => h.name.toLowerCase() === normalizedItemName
        );
        
        if (historyItem) {
            historyItem.totalPrice += totalPrice;
            historyItem.popularity = (historyItem.popularity || 0) + 1;
            historyItem.pricePerUnit = pricePerUnit;
        } else {
            state.history.items.push({
            ...item,
            totalPrice,
            pricePerUnit,
            popularity: 1,
            });
        }
        state.history.totalSpent += totalPrice;
    },

    deleteList(state, action: PayloadAction<string>) {
      const listKey = action.payload;
      state.shoppingLists = state.shoppingLists.filter((list) => list.key !== listKey);
      deleteListFromDB(listKey);
    },

    updateListTotal(state, action: PayloadAction<{ listKey: string; newTotal: number }>) {
        const { listKey, newTotal } = action.payload;
        const shoppingList = state.shoppingLists.find((list) => list.key === listKey);
        if (shoppingList) {
          shoppingList.total = newTotal;
        }
    },

    removeItemFromListAndUpdateTotal(
    state,
    action: PayloadAction<{ listKey: string; itemName: string }>
    ) {
        const { listKey, itemName } = action.payload;
        const shoppingList = state.shoppingLists.find((list) => list.key === listKey);
        if (shoppingList) {
            shoppingList.items = shoppingList.items.filter(
                (item) => item.name.toLowerCase() !== itemName.toLowerCase()
            );
          }
      },          
    },  
  },
);

export const {
  createList,
  addItemToList,
  updateItemInList,
  purchaseItem,
  clearList,
  loadFromDB,
  removeItemFromList,
  clearHistoryList,
  updateListTotal,
  removeItemFromListAndUpdateTotal,
  addToHistory, 
  deleteList
} = appSlice.actions;

const store = configureStore({
  reducer: appSlice.reducer,
});

// create var for history so we always load previous history version and not new
let previousHistoryState = initialState.history;
store.subscribe(() => {
  const state = store.getState();
  state.shoppingLists.forEach((list) => saveListToDB(list.key, list));
  if (JSON.stringify(state.history) !== JSON.stringify(previousHistoryState)) {
    saveHistoryToDB("history", state.history);
    previousHistoryState = state.history;
  } else {
    console.log("history not saved here");
  }
});

// display only the top 5 recommendations based on popularity coefficient
export const selectTopRecommendations = createSelector(
  [(state: RootState) => state.history.items],
  (historyItems) => {
    const popularityMap: Record<string, { name: string; popularity: number }> = {};

    historyItems.forEach((item) => {
      const normalizedName = item.name.toLowerCase();
      if (!popularityMap[normalizedName]) {
        popularityMap[normalizedName] = { name: item.name, popularity: 0 };
      }
      popularityMap[normalizedName].popularity += item.popularity || 0;
    });

    return Object.values(popularityMap)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5);
  }
);
  
(async () => {
  const dbKeys = (await getListFromDB("")) || [];
  const shoppingLists = [];

  for (const key of dbKeys) {
    const list = await getListFromDB(key);
    if (list) shoppingLists.push(list);
  }

  const history = await getHistoryFromDB();
  
  store.dispatch(
    loadFromDB({
      shoppingLists,
      history: history && history.items && history.totalSpent !== undefined
        ? history
        : initialState.history,
    }));
  })();

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
