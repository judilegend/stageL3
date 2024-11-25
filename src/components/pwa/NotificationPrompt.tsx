import { useNotifications } from "@/hooks/useNotifications";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export const NotificationPrompt = () => {
  const { isSupported, isSubscribed, subscribe } = useNotifications();

  if (!isSupported || isSubscribed) return null;

  const handleSubscribe = async () => {
    try {
      await subscribe();
      toast.success("Notifications activées avec succès!");
    } catch (error) {
      toast.error("Erreur lors de l'activation des notifications");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-20 right-4 z-50"
    >
      <button
        onClick={handleSubscribe}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
      >
        <Bell className="w-5 h-5" />
        <span>Activer les notifications</span>
      </button>
    </motion.div>
  );
};
