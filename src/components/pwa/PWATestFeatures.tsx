"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export const PWATestFeatures = () => {
  const [isInstallable, setIsInstallable] = useState(false);

  const testNotification = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      new Notification("Notification de Test", {
        body: "Vos notifications PWA fonctionnent parfaitement!",
        icon: "/icons/icon-192x192.png",
      });
      toast.success("Notification envoyée avec succès!");
    }
  };

  const checkInstallable = () => {
    if ("serviceWorker" in navigator) {
      toast.success("PWA peut être installée!");
      setIsInstallable(true);
    } else {
      toast.error("PWA non disponible");
    }
  };

  return (
    <div className="fixed bottom-4 left-4 space-y-2">
      <Button onClick={testNotification}>Tester les Notifications</Button>
      <Button onClick={checkInstallable}>Vérifier Installation PWA</Button>
      {isInstallable && (
        <div className="text-green-500">✓ PWA prête à être installée</div>
      )}
    </div>
  );
};
