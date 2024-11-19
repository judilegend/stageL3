import { getPendingActions, deletePendingAction } from "./db";

export async function syncPendingActions() {
  const actions = await getPendingActions();

  for (const action of actions) {
    try {
      await fetch("/api/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action),
      });

      await deletePendingAction(action.id);
    } catch (error) {
      console.error("Erreur de synchronisation:", error);
    }
  }
}
