import { configureStore, createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { saveListToDB, getListFromDB, saveHistoryToDB, getHistoryFromDB, clearAllDBStores, deleteListFromDB } from "../db";
import { WritableDraft } from "immer";


export interface Item {
  name: string;
  amount: string;
  indices: string;
  popularity?: number; // Only for history items
  pricePerUnit?: number; // Only for purchased items
}

export interface ShoppingList {
  key: string; // Unique key for each shopping list
  name: string; // Name of the shopping list
  items: Item[];
  total: number; // Total cost for the shopping list
}

export interface HistoryItem extends Item {
  totalPrice: number; // Total cost for this item
}

interface AppState {
  shoppingLists: ShoppingList[]; // Multiple shopping lists
  history: {
    items: HistoryItem[];
    totalSpent: number; // Total money spent in history
  };
}

const initialState: AppState = {
  shoppingLists: [], // No initial lists
  history: {
    items: [],
    totalSpent: 0,
  },
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    createList(state, action: PayloadAction<{ key: string; name: string }>) {
      state.shoppingLists.push({ key: action.payload.key, name: action.payload.name, items: [], total: 0 });
    },

    addItemToList(state, action: PayloadAction<{ key: string; item: Item }>) {
        const { key, item } = action.payload;  
        const lowerItemName = item.name.toLowerCase(); // Normalize item name to lowercase
        const list = state.shoppingLists.find((list) => list.key === key);
    
        if (list) {
            // Check if the item already exists in the shopping list (case-insensitive)
            const exists = list.items.some((existingItem) => existingItem.name.toLowerCase() === lowerItemName);
    
            if (exists) {
                console.warn(`Item "${item.name}" already exists in the list.`);
                return;
            }
    
            // Add the normalized item to the shopping list
            list.items.push({
                ...item,
                name: lowerItemName, // Store the normalized name
            });
    
            // // Check and update history
            // const historyItem = state.history.items.find((h) => h.name.toLowerCase() === lowerItemName);
            // if (historyItem) {
            //     historyItem.popularity = (historyItem.popularity || 0) + 1;
            //     console.log(`Updated popularity for "${historyItem.name}":`, historyItem.popularity);
            // } else {
            //     const newHistoryItem = {
            //         ...item,
            //         name: lowerItemName, // Store the normalized name in history
            //         popularity: 1,
            //         totalPrice: 0,
            //     };
            //     state.history.items.push(newHistoryItem);
            //     console.log(`Added new item to history: "${lowerItemName}" with popularity 1`);
            // }
        }
    },
    

    updateItemInList(state, action: PayloadAction<{ key: string; item: Item }>) {
        const { key, item } = action.payload;
        const list = state.shoppingLists.find((list) => list.key === key);
        if (list) {
          const index = list.items.findIndex((i) => i.name === item.name);
          if (index > -1) {
            list.items[index] = item;
      
            // Recalculate the total for the list
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
        console.log(`Removing item '${normalizedItemName}' from list '${listKey}'`);
    
        const list = state.shoppingLists.find((list) => list.key === listKey);
        if (list) {
            console.log("List before removal:", list.items);
            list.items = list.items.filter((item) => item.name.toLowerCase() !== normalizedItemName);
            console.log("List after removal:", list.items);
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
      
            // Add to history
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
      
            // Calculate the new total
            const newTotal = (shoppingList.total || 0) + totalSpent;
      
            // Update the list total
            shoppingList.total = newTotal;
      
            // Remove the item from the shopping list
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
            
            // Remove the item from the list
            shoppingList.items = shoppingList.items.filter(
                (item) => item.name.toLowerCase() !== itemName.toLowerCase()
            );
            }
    },

    addToHistory(
        state: WritableDraft<AppState>,
        action: PayloadAction<{ item: Item; totalPrice: number; pricePerUnit: number }>
        ) {
        const { item, totalPrice, pricePerUnit } = action.payload;
        
        // Normalize item name for case-insensitive comparison
        const normalizedItemName = item.name.toLowerCase();
        
        // Check if the item already exists in history
        const historyItem = state.history.items.find(
            (h) => h.name.toLowerCase() === normalizedItemName
        );
        
        if (historyItem) {
            // Update the existing item's total price and popularity
            historyItem.totalPrice += totalPrice;
            historyItem.popularity = (historyItem.popularity || 0) + 1;
            historyItem.pricePerUnit = pricePerUnit; // Update price per unit
        } else {
            // Add a new item to history
            state.history.items.push({
            ...item,
            totalPrice,
            pricePerUnit,
            popularity: 1, // New item starts with a popularity of 1
            });
        }
        
        // Update the totalSpent in history
        state.history.totalSpent += totalPrice;
        },

        deleteList(state, action: PayloadAction<string>) {
            const listKey = action.payload;
            
            console.log("Key to delete:", listKey);
            console.log("Before deletion:", state.shoppingLists);
          
            // Update Redux state
            state.shoppingLists = state.shoppingLists.filter((list) => list.key !== listKey);
          
            console.log("After deletion:", state.shoppingLists);
          
            // Persist the change to IndexedDB
            deleteListFromDB(listKey);
          }
          
          

          
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

store.subscribe(() => {
    const state = store.getState();
    console.log("Redux State:", state);
  
    // Save shopping lists to IndexedDB
    state.shoppingLists.forEach((list) => {
      saveListToDB(list.key, list);
    });
  
    // Save history to IndexedDB
    saveHistoryToDB("history", state.history);
  });
  

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
    const shoppingLists: ShoppingList[] = [];
    for (const key of dbKeys) {
    const list = await getListFromDB(key);
    if (list) {
        shoppingLists.push(list);
        }
    }
    const history = await getHistoryFromDB("history");

    store.dispatch(
        loadFromDB({
        shoppingLists,
        history: history || initialState.history,
        })
    );
})();

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
