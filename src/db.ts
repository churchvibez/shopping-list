import { openDB } from "idb";

// interaction with our indexedDB

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
    try {
        await db.put("shoppingLists", { key, value });
    } catch (error) {
        console.error("error saving list:", error);
    }
};

export const getListFromDB = async (key: string) => {
    const db = await dbPromise;
    try {
        if (key) {
            const result = await db.get("shoppingLists", key);
            return result?.value || null;
        } else {
            const keys = await db.getAllKeys("shoppingLists");
            return keys || [];
        }
    } catch (error) {
        console.error("error getting list:", error);
        return null;
    }
};

export const saveHistoryToDB = async (key: string, value: unknown) => {
    const db = await dbPromise;
    try {
        await db.put("history", { key, value });
    } catch (error) {
        console.error("error saving history:", error);
    }
};

export const getHistoryFromDB = async () => {
  const db = await dbPromise;
  try {
    const tx = db.transaction("history", "readonly");
    const store = tx.objectStore("history");

    let latestEntry = null;
    let cursor = await store.openCursor(null, "prev");
    if (cursor) {
      latestEntry = cursor.value.value;
    }
    return latestEntry || null;
  } catch (error) {
    console.error("error getting last history:", error);
    return null;
  }
};

export const deleteListFromDB = async (key: string): Promise<void> => {
    const db = await dbPromise;
    try {
        await db.delete("shoppingLists", key);
    } catch (error) {
        console.error("error deleting list:", error);
    }
};

export const clearAllDBStores = async () => {
    const db = await dbPromise;
    try {
        const txShoppingLists = db.transaction("shoppingLists", "readwrite");
        await txShoppingLists.objectStore("shoppingLists").clear();
        await txShoppingLists.done;

        const txHistory = db.transaction("history", "readwrite");
        await txHistory.objectStore("history").clear();
        await txHistory.done;

    } catch (error) {
        console.error("error clearing all of the DB:", error);
    }
};
