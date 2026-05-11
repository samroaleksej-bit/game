'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DistrictId, District } from '@/lib/game-types';
import { motion } from 'framer-motion';

interface InteractiveMapProps {
  districts: Record<DistrictId, District>;
  onDistrictClick: (districtId: DistrictId) => void;
  getProgressPercentage: (districtId: DistrictId) => number;
}

// Позиции под реальные места районов на карте (в % от контейнера 16:9)
const DISTRICTS: Record<DistrictId, { top: string; left: string; name: string; emoji: string }> = {
  jiloy:    { top: '8%',  left: '49%', name: 'Жилой',      emoji: '🏘️' },
  killer:   { top: '17%', left: '31%', name: 'Убийцы',    emoji: '🗡️' },
  asian:    { top: '17%', left: '72%', name: 'Интриги',   emoji: '🎎' },
  gnil:     { top: '38%', left: '25%', name: 'Гниль',       emoji: '💀' },
  znania:   { top: '50%', left: '83%', name: 'Жрецы',      emoji: '📚' },
  horgovzi: { top: '83%', left: '43%', name: 'Торговцы',  emoji: '🏪' },
  siraja:   { top: '74%', left: '68%', name: 'Стража',      emoji: '⚔️' },
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  onDistrictClick,
  getProgressPercentage,
}) => {
  const [hovered, setHovered] = useState<DistrictId | null>(null);
  const ids = Object.keys(DISTRICTS) as DistrictId[];

  return (
    <motion.div
      className="relative w-full rounded-lg overflow-hidden border-4 border-amber-600 shadow-2xl bg-slate-900"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
        <Image
          src="/images/map_without_names.png"
          alt="Карта города"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />

        {ids.map((id) => {
          const pos = DISTRICTS[id];
          const pct = getProgressPercentage(id);
          const isHovered = hovered === id;
          const captured = pct >= 100;

          return (
            <button
              key={id}
              type="button"
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group focus:outline-none"
              style={{ top: pos.top, left: pos.left }}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onDistrictClick(id)}
            >
              {/* Красивая надпись названия района */}
              <motion.div
                className="px-3 py-1 mb-1 rounded-md bg-slate-900/80 backdrop-blur-sm border border-amber-500/70 shadow-lg"
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <span
                  className="font-serif text-sm md:text-base font-bold tracking-wide"
                  style={{
                    color: '#fcd34d',
                    textShadow: '0 0 8px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,1)',
                  }}
                >
                  {pos.emoji} {pos.name}
                </span>
              </motion.div>

              {/* Кружок-прогресс */}
              <motion.div
                className="relative w-12 h-12 md:w-14 md:h-14 cursor-pointer"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(
                      ${captured ? '#22c55e' : '#d97706'} ${pct * 3.6}deg,
                      rgba(51,65,85,0.85) ${pct * 3.6}deg
                    )`,
                  }}
                />
                <div className="absolute inset-[3px] rounded-full bg-slate-900/95 border border-amber-500 flex items-center justify-center">
                  <span className="text-[11px] md:text-xs font-bold text-amber-300">
                    {Math.floor(pct)}%
                  </span>
                </div>
              </motion.div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};
