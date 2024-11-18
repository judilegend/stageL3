import { motion } from "framer-motion";

export const Logo = () => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-2"
    >
      <div className="bg-primary p-2 rounded-lg">
        <span className="text-white font-bold text-xl">DP</span>
      </div>
      <span className="text-2xl font-bold text-gray-800">DepannPC</span>
    </motion.div>
  );
};
