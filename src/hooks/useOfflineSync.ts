import { useState, useEffect } from "react";
import { savePendingAction } from "@/lib/offline/db";
import { syncPendingActions } from "@/lib/offline/sync";
import { toast } from "react-hot-toast";

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingActions();
      toast.success("Connexion rétablie. Synchronisation en cours...");
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast(
        "Vous êtes hors ligne. Les modifications seront synchronisées plus tard.",
        {
          icon: "⚠️",
          style: {
            background: "#fef3c7",
            color: "#92400e",
          },
        }
      );
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const saveOfflineAction = async (action: any) => {
    if (!isOnline) {
      await savePendingAction(action);
      return true;
    }
    return false;
  };

  return { isOnline, saveOfflineAction };
}
