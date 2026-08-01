"use client";

import { motion } from "framer-motion";

export function DeployHeroGraphic({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 400 280"
        fill="none"
        className="w-full h-auto max-w-md"
        aria-hidden
      >
        <defs>
          <linearGradient id="nova-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Orbit rings */}
        <motion.circle
          cx="200"
          cy="140"
          r="90"
          stroke="url(#nova-grad)"
          strokeWidth="1"
          strokeOpacity="0.2"
          fill="none"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "200px 140px" }}
        />
        <motion.circle
          cx="200"
          cy="140"
          r="60"
          stroke="url(#nova-grad)"
          strokeWidth="1"
          strokeOpacity="0.35"
          fill="none"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "200px 140px" }}
        />

        {/* Center hub */}
        <motion.circle
          cx="200"
          cy="140"
          r="28"
          fill="url(#nova-grad)"
          filter="url(#glow)"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="200" cy="140" r="12" fill="white" opacity="0.9" />

        {/* Orbiting nodes */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (i * 90 * Math.PI) / 180;
          const cx = 200 + 90 * Math.cos(angle);
          const cy = 140 + 90 * Math.sin(angle);
          return (
            <motion.g key={i}>
              <motion.circle
                cx={cx}
                cy={cy}
                r="10"
                fill="#38bdf8"
                opacity="0.9"
                animate={{
                  cx: [
                    200 + 90 * Math.cos(angle),
                    200 + 90 * Math.cos(angle + Math.PI / 2),
                    200 + 90 * Math.cos(angle + Math.PI),
                    200 + 90 * Math.cos(angle + (3 * Math.PI) / 2),
                    200 + 90 * Math.cos(angle),
                  ],
                  cy: [
                    140 + 90 * Math.sin(angle),
                    140 + 90 * Math.sin(angle + Math.PI / 2),
                    140 + 90 * Math.sin(angle + Math.PI),
                    140 + 90 * Math.sin(angle + (3 * Math.PI) / 2),
                    140 + 90 * Math.sin(angle),
                  ],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.5,
                }}
              />
            </motion.g>
          );
        })}

        {/* Connection lines pulse */}
        <motion.line
          x1="200"
          y1="140"
          x2="290"
          y2="140"
          stroke="url(#nova-grad)"
          strokeWidth="2"
          strokeOpacity="0.5"
          animate={{ strokeOpacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.line
          x1="200"
          y1="140"
          x2="200"
          y2="50"
          stroke="url(#nova-grad)"
          strokeWidth="2"
          strokeOpacity="0.5"
          animate={{ strokeOpacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </svg>
    </div>
  );
}

export function EmptyStateGraphic() {
  return (
    <div className="relative mx-auto h-32 w-32">
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-4 rounded-full border-2 border-dashed border-cyan-400/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 shadow-lg shadow-cyan-500/30"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
