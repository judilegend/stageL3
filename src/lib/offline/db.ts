import { openDB } from "idb";

const DB_NAME = "pms-offline-db";
const STORE_NAME = "pending-actions";

export const db = openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME, {
      keyPath: "id",
      autoIncrement: true,
    });
  },
});

export async function savePendingAction(action: any) {
  const database = await db;
  return database.add(STORE_NAME, {
    ...action,
    timestamp: Date.now(),
  });
}

export async function getPendingActions() {
  const database = await db;
  return database.getAll(STORE_NAME);
}

export async function deletePendingAction(id: number) {
  const database = await db;
  return database.delete(STORE_NAME, id);
}
