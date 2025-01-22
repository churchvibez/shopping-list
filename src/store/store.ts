import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { saveToDB, getToDB } from "../db";

export interface Item {
    name: string;
    amount: string;
    indices: string;
}
interface ShoppingListState {
    active: Item[];
    history: Item[];
    lastAdded: Item[];
}

const initialState: ShoppingListState = {
    active: [],
    history: [],
    lastAdded: [],
}

// create our redux slice
const ShoppingListSlice = createSlice({
    name: "shoppingList",
    initialState,
    reducers: {
        
        addToActive(state, action: PayloadAction<Item>) {
            const { name, amount, indices } = action.payload;

            // if product exists in active, we skip adding it
            if (state.active.some((item) => item.name === name)) {
                console.warn(`product already there: ${name}`);
                return;
            }
        
            state.active.push({ name, amount, indices });
        
            // if product not in history, we add it
            if (!state.history.some((item) => item.name === name)) {
                state.history.push({ name, amount, indices });
            }

            // update the array to only track the last 10 products
            state.lastAdded = state.lastAdded.filter((item) => item.name !== name);

            if (state.lastAdded.length < 10) {
                state.lastAdded = [{ name, amount, indices }, ...state.lastAdded];
            } else {
                state.lastAdded = [{ name, amount, indices }, ...state.lastAdded.slice(0, 9)];
            }
                
        },

        removeFromActive(state, action: PayloadAction<string>) {
            state.active = state.active.filter((item) => item.name !== action.payload);
        },

        // initialise any missing properties
        loadFromDB(_state, action: PayloadAction<ShoppingListState>) {
            return {
                ...initialState,
                ...action.payload
            }
        },

        // reducers to clear the lists
        clearActive(state) {
            state.active = [];
        },
        // active cleared as well
        // bc no reason to keep active products that have no reference
        clearHistory(state) {
            state.active = [];
            state.history = [];
        }
    },
})

export const { addToActive, removeFromActive, loadFromDB, clearActive, clearHistory } = ShoppingListSlice.actions;

const store = configureStore({
    reducer: ShoppingListSlice.reducer,
})

// save to indexedDB on state change
store.subscribe(() => {
    const state = store.getState();
    console.log("Redux State:", state);
    saveToDB("shoppingList", state);
});

// load initial state from indexedDB and update redux store with data
(async () => {
  const persistedState = await getToDB("shoppingList");
  if (persistedState) {
    store.dispatch(loadFromDB(persistedState));
  }
})();

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

