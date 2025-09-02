"use client";

import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  size?: number;
};

export default function AnimatedLucide({ children }: Props) {
  return (
    <motion.span
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="inline-flex items-center justify-center"
    >
      {children}
    </motion.span>
  );
}



