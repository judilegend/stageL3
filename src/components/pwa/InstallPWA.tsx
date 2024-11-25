import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export const InstallPWA = () => {
  const { installPrompt, install } = usePWA();
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    setShowInstall(!!installPrompt);
  }, [installPrompt]);

  const handleInstall = async () => {
    try {
      await install();
      toast.success("Application installée avec succès!");
      setShowInstall(false);
    } catch (error) {
      toast.error("Échec de l'installation");
    }
  };

  if (!showInstall) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <button
        onClick={handleInstall}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
      >
        <Download className="w-5 h-5" />
        <span>Installer l'application</span>
      </button>
    </motion.div>
  );
};
