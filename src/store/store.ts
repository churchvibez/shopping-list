import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { saveToDB, getToDB } from "../db";

// create state interface first
interface ShoppingListState {
    active: string[];
    history: string[];
    lastAdded: string[];
}

// and then define initial states
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
        
        addToActive(state, action: PayloadAction<string>) {
            const product = action.payload;

            // if product exists in active, we skip adding it
            if (state.active.includes(product)) {
                console.warn(`product already there: ${product}`);
                return;
            }
        
            state.active.push(product);
        
            // if product not in history, we add it
            if (!state.history.includes(product)) {
                state.history.push(product);
            }

            // update the array to only track the last 10 products
            state.lastAdded = state.lastAdded.filter((item) => item !== product);

            if (state.lastAdded.length < 10) {
                state.lastAdded = [product, ...state.lastAdded];
            } else {
                state.lastAdded = [product, ...state.lastAdded.slice(0, 9)];
            }
                
        },

        removeFromActive(state, action: PayloadAction<string>) {
            state.active = state.active.filter((product) => product !== action.payload);
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

