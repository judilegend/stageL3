import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { toast } from "react-hot-toast";

export const PWAStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Connexion rétablie");
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("Pas de connexion internet");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      {isOnline ? (
        <Wifi className="w-6 h-6 text-green-500" />
      ) : (
        <WifiOff className="w-6 h-6 text-red-500" />
      )}
    </div>
  );
};
