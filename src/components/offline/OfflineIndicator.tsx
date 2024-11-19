import React from "react";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const { isOnline } = useOfflineSync();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 p-2 rounded-full">
      <WifiOff className="w-6 h-6 text-yellow-600" />
    </div>
  );
}
