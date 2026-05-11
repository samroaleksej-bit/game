'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/lib/game-store';
import { DistrictId } from '@/lib/game-types';
import { InteractiveMap } from '@/components/game/interactive-map';
import { ResourcePanel } from '@/components/game/resource-panel';
import { DayCounter } from '@/components/game/day-counter';
import { DistrictModal } from '@/components/game/district-modal';
import { GameHeader } from '@/components/game/game-header';
import { DiceRoller } from '@/components/game/dice-roller';
import { motion } from 'framer-motion';

export default function Home() {
  const gameStore = useGameStore();
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictId | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-2xl font-bold text-amber-400">Загрузка игры...</div>
      </div>
    );
  }

  const currentDistrict = selectedDistrict ? gameStore.districts[selectedDistrict] : null;
  const isGameEnded = gameStore.currentDay >= gameStore.totalDays;

  const handleDistrictClick = (districtId: DistrictId) => {
    setSelectedDistrict(districtId);
    setIsModalOpen(true);
  };

  const handleGiveOrder = () => {
    if (selectedDistrict) {
      gameStore.giveOrder(selectedDistrict);
    }
  };

  const handleCompleteDay = () => {
    if (!isGameEnded) {
      gameStore.completeDay();
    }
  };

  const handleReset = () => {
    if (confirm('Вы уверены? Это сбросит всю игру.')) {
      gameStore.resetGame();
      setSelectedDistrict(null);
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDistrict(null);
  };

  const selectedBonus = selectedDistrict ? gameStore.getDistrictBonuses(selectedDistrict) : {};
  const selectedProgress = selectedDistrict ? gameStore.getProgressPercentage(selectedDistrict) : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <GameHeader
          onCompleteDay={handleCompleteDay}
          onReset={handleReset}
          gameEnded={isGameEnded}
        />

        {isGameEnded && (
          <motion.div
            className="mb-6 bg-gradient-to-r from-red-600 to-orange-600 border-2 border-red-400 rounded-lg p-4 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-2xl font-bold text-white">⚔️ Кампания завершена! ⚔️</p>
            <p className="text-gray-100 mt-2">Нажмите "Сброс" чтобы начать новую игру</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1 space-y-4">
            <DayCounter currentDay={gameStore.currentDay} totalDays={gameStore.totalDays} />
            <ResourcePanel
              resources={gameStore.resources}
              onChangeResources={(patch) =>
                gameStore.setResources({
                  ...gameStore.resources,
                  ...patch,
                })
              }
            />
            <DiceRoller />
            {gameStore.log.length > 0 && (
              <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-amber-600 rounded-lg p-4 shadow-xl">
                <h3 className="text-lg font-bold text-amber-400 mb-2">📜 Журнал добычи</h3>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1 text-xs">
                  {gameStore.log.map((entry, i) => (
                    <div key={i} className="text-gray-300 bg-slate-950/50 rounded px-2 py-1">
                      <span className="text-amber-400 font-bold">День {entry.day}:</span> {entry.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <InteractiveMap
              districts={gameStore.districts}
              onDistrictClick={handleDistrictClick}
              getProgressPercentage={gameStore.getProgressPercentage}
            />
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {Object.values(gameStore.districts).map((district) => {
            const progress = gameStore.getProgressPercentage(district.id as DistrictId);
            const percentage = Math.floor(progress);

            return (
              <motion.div
                key={district.id}
                className="bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-600 rounded-lg p-4 cursor-pointer hover:border-amber-400 transition-all"
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(217, 119, 6, 0.3)' }}
                onClick={() => handleDistrictClick(district.id as DistrictId)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-bold text-amber-400 mb-2">{district.displayName}</h3>
                <div className="mb-2">
                  <div className="text-xs text-gray-400 mb-1">Захват: {percentage}%</div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  {Object.entries(gameStore.getDistrictBonuses(district.id as DistrictId)).map(([key, value]) => {
                    if (value === undefined || value === 0) return null;
                    const icons: Record<string, string> = {
                      gold: '🪙',
                      influence: '👑',
                      recruits: '⚔️',
                      loyalty: '❤️',
                    };
                    return (
                      <div key={key}>
                        {icons[key]} +{value}/день
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <DistrictModal
        district={currentDistrict}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onGiveOrder={handleGiveOrder}
        canGiveOrder={!gameStore.ordersUsedToday && !isGameEnded}
        bonuses={selectedBonus}
        progressPercentage={selectedProgress}
      />
    </main>
  );
}
