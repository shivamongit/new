"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function NovaLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim =
    size === "sm" ? "h-8 w-8" : size === "lg" ? "h-14 w-14" : "h-9 w-9";
  const iconDim =
    size === "sm" ? "h-4 w-4" : size === "lg" ? "h-7 w-7" : "h-5 w-5";

  return (
    <div className="relative">
      <motion.div
        className={`absolute inset-0 rounded-xl bg-cyan-400/30 blur-md ${dim}`}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <div
        className={`relative flex ${dim} items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/40`}
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className={`${iconDim} text-white`} />
        </motion.div>
      </div>
    </div>
  );
}
