import { WifiOff } from "lucide-react";
import { motion } from "framer-motion";

export default function Offline() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center p-4"
    >
      <WifiOff className="w-16 h-16 text-gray-400 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Vous êtes hors ligne
      </h1>
      <p className="text-gray-600 text-center">
        Vérifiez votre connexion internet et réessayez
      </p>
    </motion.div>
  );
}
