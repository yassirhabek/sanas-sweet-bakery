"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";

function floatAnim(reduced: boolean, y = 10, duration = 4, delay = 0) {
  if (reduced) return {};
  return {
    y: [0, -y, 0],
    transition: {
      duration,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay,
    },
  };
}

function steamAnim(reduced: boolean, delay = 0) {
  if (reduced) return {};
  return {
    y: [0, -18, -36],
    opacity: [0, 0.55, 0],
    transition: {
      duration: 3.5,
      repeat: Infinity,
      ease: "easeOut" as const,
      delay,
    },
  };
}

export function HeroVisual() {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      className="pointer-events-none relative mx-auto flex h-[360px] w-full max-w-xl items-center justify-center sm:h-[420px] md:mx-0 md:h-[min(65vh,580px)] md:max-w-none md:flex-1 lg:h-[min(68vh,620px)]"
      aria-hidden
    >
      {/* Warm oven glow */}
      <div className="absolute h-64 w-64 rounded-full bg-terracotta/15 blur-3xl sm:h-80 sm:w-80 md:h-96 md:w-96" />
      <div className="absolute h-48 w-48 translate-x-8 rounded-full bg-gold/20 blur-2xl md:h-56 md:w-56" />

      <svg
        viewBox="0 0 400 400"
        className="relative z-10 h-full w-full max-h-[620px] drop-shadow-lg"
        fill="none"
      >
        <defs>
          <linearGradient id="crust" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8C49A" />
            <stop offset="45%" stopColor="#D4A064" />
            <stop offset="100%" stopColor="#B87D3A" />
          </linearGradient>
          <linearGradient id="crumb" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F5E6C8" />
            <stop offset="100%" stopColor="#E8D4A8" />
          </linearGradient>
          <linearGradient id="pastryGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F0D090" />
            <stop offset="100%" stopColor="#C9A227" />
          </linearGradient>
          <linearGradient id="board" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C4A574" />
            <stop offset="100%" stopColor="#8B6914" />
          </linearGradient>
          <filter id="bakeryShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="8"
              floodColor="#2C1810"
              floodOpacity="0.18"
            />
          </filter>
        </defs>

        {/* Wooden serving board */}
        <ellipse cx="200" cy="318" rx="130" ry="22" fill="#2C1810" opacity="0.08" />
        <rect
          x="72"
          y="268"
          width="256"
          height="52"
          rx="10"
          fill="url(#board)"
          filter="url(#bakeryShadow)"
        />
        <rect
          x="82"
          y="274"
          width="236"
          height="6"
          rx="3"
          fill="#FBF7F0"
          opacity="0.15"
        />

        {/* Steam wisps */}
        {[0, 0.8, 1.6].map((d, i) => (
          <motion.path
            key={i}
            d={`M${185 + i * 12} 155 Q${175 + i * 14} 125 ${188 + i * 10} 95`}
            stroke="#FBF7F0"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0"
            animate={steamAnim(reduced, d)}
          />
        ))}

        {/* Main Khobz — Moroccan round bread */}
        <motion.g
          filter="url(#bakeryShadow)"
          animate={floatAnim(reduced, 6, 5, 0)}
        >
          <circle cx="200" cy="210" r="78" fill="url(#crust)" />
          <circle cx="200" cy="210" r="62" fill="url(#crumb)" opacity="0.35" />
          {/* Traditional score marks */}
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <line
              key={deg}
              x1="200"
              y1="210"
              x2={200 + 70 * Math.cos((deg * Math.PI) / 180)}
              y2={210 + 70 * Math.sin((deg * Math.PI) / 180)}
              stroke="#B87D3A"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.45"
            />
          ))}
          <circle cx="200" cy="210" r="78" stroke="#C9A227" strokeWidth="1.5" opacity="0.4" />
        </motion.g>

        {/* Croissant — top right */}
        <motion.g
          animate={floatAnim(reduced, 14, 4.5, 0.3)}
          style={{ transformOrigin: "300px 120px" }}
        >
          <g transform="translate(268, 88) rotate(25)">
            <path
              d="M10 55 C10 20 55 5 80 30 C95 45 90 65 70 72 C45 80 10 75 10 55Z"
              fill="url(#pastryGold)"
              stroke="#B87D3A"
              strokeWidth="1.5"
              opacity="0.95"
            />
            <path
              d="M25 50 C40 35 60 32 72 42"
              stroke="#FBF7F0"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.35"
            />
            <path
              d="M30 58 C48 48 65 48 75 55"
              stroke="#B87D3A"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.3"
            />
          </g>
        </motion.g>

        {/* Chebakia — honey flower cookie, bottom left */}
        <motion.g animate={floatAnim(reduced, 12, 5.5, 0.6)}>
          <g transform="translate(58, 248) rotate(-15)">
            <circle cx="36" cy="36" r="34" fill="url(#pastryGold)" opacity="0.95" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <ellipse
                key={deg}
                cx={36 + 22 * Math.cos((deg * Math.PI) / 180)}
                cy={36 + 22 * Math.sin((deg * Math.PI) / 180)}
                rx="10"
                ry="16"
                fill="#C45C3E"
                opacity="0.75"
                transform={`rotate(${deg} ${36 + 22 * Math.cos((deg * Math.PI) / 180)} ${36 + 22 * Math.sin((deg * Math.PI) / 180)})`}
              />
            ))}
            <circle cx="36" cy="36" r="10" fill="#B87D3A" />
            {/* Sesame dots */}
            {[
              [28, 28],
              [44, 30],
              [30, 44],
              [42, 42],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="2" fill="#FBF7F0" opacity="0.8" />
            ))}
          </g>
        </motion.g>

        {/* Msemen — layered flatbread, top left */}
        <motion.g animate={floatAnim(reduced, 10, 4.8, 0.9)}>
          <g transform="translate(72, 72) rotate(-8)">
            <rect
              x="0"
              y="12"
              width="72"
              height="72"
              rx="6"
              fill="#D4A064"
              opacity="0.5"
            />
            <rect
              x="4"
              y="6"
              width="72"
              height="72"
              rx="6"
              fill="url(#pastryGold)"
              stroke="#B87D3A"
              strokeWidth="1.5"
            />
            <rect
              x="8"
              y="0"
              width="72"
              height="72"
              rx="6"
              fill="#F0D090"
              stroke="#C9A227"
              strokeWidth="1"
              opacity="0.9"
            />
            {/* Layer lines */}
            <line x1="12" y1="18" x2="76" y2="18" stroke="#B87D3A" strokeWidth="1" opacity="0.25" />
            <line x1="12" y1="36" x2="76" y2="36" stroke="#B87D3A" strokeWidth="1" opacity="0.25" />
            <line x1="12" y1="54" x2="76" y2="54" stroke="#B87D3A" strokeWidth="1" opacity="0.25" />
          </g>
        </motion.g>

        {/* Briouat — small triangle pastry, right */}
        <motion.g animate={floatAnim(reduced, 11, 5.2, 1.2)}>
          <g transform="translate(300, 230) rotate(12)">
            <path
              d="M0 0 L48 0 L24 42 Z"
              fill="url(#pastryGold)"
              stroke="#B87D3A"
              strokeWidth="1.5"
            />
            <path
              d="M8 6 L40 6 L24 34 Z"
              fill="#C45C3E"
              opacity="0.35"
            />
            <line
              x1="24"
              y1="4"
              x2="24"
              y2="38"
              stroke="#FBF7F0"
              strokeWidth="1"
              opacity="0.3"
            />
          </g>
        </motion.g>

        {/* Flour dust specks */}
        {[
          [120, 180],
          [290, 200],
          [150, 100],
          [310, 160],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" fill="#FBF7F0" opacity="0.5" />
        ))}
      </svg>
    </div>
  );
}
