import { openDB } from "idb";

const dbPromise = openDB('shoppingListDB', 2, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("shoppingLists")) {
        db.createObjectStore("shoppingLists", { keyPath: "key" });
      }
      if (!db.objectStoreNames.contains("history")) {
        db.createObjectStore("history", { keyPath: "key" });
      }
    },
  });
  
  export const saveListToDB = async (key: string, value: unknown) => {
    const db = await dbPromise;
    await db.put("shoppingLists", { key, value });
  };
  
  export const getListFromDB = async (key: string) => {
    const db = await dbPromise;
    if (key) {
      const result = await db.get("shoppingLists", key);
      return result?.value || null;
    } else {
      const keys = await db.getAllKeys("shoppingLists");
      return keys || [];
    }
  };
  
  export const saveHistoryToDB = async (key: string, value: unknown) => {
    const db = await dbPromise;
    await db.put("history", { key, value });
  };
  
  export const getHistoryFromDB = async (key: string) => {
    const db = await dbPromise;
    const result = await db.get("history", key);
    return result?.value || null;
  };

  export const getAllKeysFromDB = async (storeName: string) => {
    const db = await dbPromise;
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    return await store.getAllKeys();
  };

  export const clearAllDBStores = async () => {
    const db = await dbPromise;
  
    const txShoppingLists = db.transaction("shoppingLists", "readwrite");
    const shoppingListsStore = txShoppingLists.objectStore("shoppingLists");
    await shoppingListsStore.clear();
    await txShoppingLists.done;
  
    const txHistory = db.transaction("history", "readwrite");
    const historyStore = txHistory.objectStore("history");
    await historyStore.clear();
    await txHistory.done;
  };

  export async function deleteListFromDB(key: string): Promise<void> {
    try {
      const db = await openDB("shoppingListDB", 1); // Replace with your DB name/version
      const tx = db.transaction("shoppingLists", "readwrite"); // Replace with your object store name
      await tx.objectStore("shoppingLists").delete(key);
      await tx.done;
      console.log(`List with key "${key}" successfully deleted from IndexedDB.`);
    } catch (error) {
      console.error("Failed to delete list from IndexedDB:", error);
    }
  }
  
  
  