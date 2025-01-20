import { openDB } from "idb";

// create our interaction with indexedDB
const dbPromise = openDB('shoppingListDB', 1, {
    upgrade(db)
    {
        if (!db.objectStoreNames.contains("lists")) {
            db.createObjectStore("lists", { keyPath: "key"})
        }
    },
})

export const saveToDB = async (key: string, value: unknown) => {
    const db = await dbPromise
    await db.put("lists", { key, value })
}

export const getToDB = async (key: string) => {
    const db = await dbPromise
    const result = await db.get("lists", key)
    return result?.value || null
}
