'use client';

import { useState } from 'react';
import { District } from '@/lib/game-types';
import { motion, AnimatePresence } from 'framer-motion';
import { getDistrictItems, RARITY_STYLE } from '@/lib/district-rewards';

interface DistrictModalProps {
  district: District | null;
  isOpen: boolean;
  onClose: () => void;
  onGiveOrder: () => void;
  canGiveOrder: boolean;
  bonuses: Partial<Record<string, any>>;
  progressPercentage: number;
}

const getResourceCost = (progressPercentage: number): Record<string, number> => {
  if (progressPercentage < 25) return { gold: 1, influence: 0 };
  if (progressPercentage < 50) return { gold: 1, influence: 1 };
  if (progressPercentage < 75) return { gold: 2, influence: 1 };
  return { gold: 2, influence: 2 };
};

export const DistrictModal: React.FC<DistrictModalProps> = ({
  district,
  isOpen,
  onClose,
  onGiveOrder,
  canGiveOrder,
  bonuses,
  progressPercentage,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);

  if (!district) return null;

  const cost = getResourceCost(progressPercentage);

  const handleOrderClick = () => {
    if (canGiveOrder) {
      setIsConfirming(true);
    }
  };

  const handleConfirm = () => {
    onGiveOrder();
    setIsConfirming(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-md max-h-[90vh] overflow-y-auto bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-amber-500 rounded-lg shadow-2xl p-6 z-50"
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              <div className="text-center border-b border-amber-500 pb-4">
                <h2 className="text-3xl font-bold text-amber-400 mb-2">{district?.displayName}</h2>
                <p className="text-sm text-gray-400">{district?.description}</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">Захват района:</span>
                  <span className="font-bold text-amber-400">{district?.progress}/14 дней ({Math.floor(progressPercentage)}%)</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="bg-slate-700 bg-opacity-50 border border-amber-600 rounded-md p-3">
                <h3 className="text-sm font-bold text-amber-300 mb-2">📊 Текущие бонусы:</h3>
                <div className="space-y-1 text-sm">
                  {Object.entries(bonuses).map(([key, value]) => {
                    if (value === undefined || value === 0) return null;
                    const icons: Record<string, string> = {
                      gold: '🪙',
                      influence: '👑',
                      recruits: '⚔️',
                      loyalty: '❤️',
                    };
                    const labels: Record<string, string> = {
                      gold: 'Золота',
                      influence: 'Влияния',
                      recruits: 'Рекрутов',
                      loyalty: 'Лояльности',
                    };
                    return (
                      <div key={key} className="text-gray-300">
                        {icons[key] || '•'} +{value} {labels[key] || key}/день
                      </div>
                    );
                  })}
                </div>
              </div>

              {district && getDistrictItems(district.id, district.progress).length > 0 && (
                <div className="bg-slate-700 bg-opacity-50 border border-purple-600 rounded-md p-3">
                  <h3 className="text-sm font-bold text-purple-300 mb-2">🎁 Предметы (за день):</h3>
                  <div className="space-y-1 text-sm">
                    {getDistrictItems(district.id, district.progress).map((it, i) => (
                      <div key={i} className={`${RARITY_STYLE[it.rarity].color}`}>
                        ✦ {it.label} <span className="text-xs opacity-70">[{RARITY_STYLE[it.rarity].label}]</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-slate-700 bg-opacity-50 border border-red-600 rounded-md p-3">
                <h3 className="text-sm font-bold text-red-300 mb-2">⚡ Стоимость приказа:</h3>
                <div className="space-y-1 text-sm">
                  {cost.gold > 0 && <div className="text-gray-300">🪙 {cost.gold} Золото</div>}
                  {cost.influence > 0 && <div className="text-gray-300">👑 {cost.influence} Влияние</div>}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-amber-500">
                {!isConfirming ? (
                  <>
                    <motion.button
                      onClick={handleOrderClick}
                      disabled={!canGiveOrder}
                      className={`flex-1 py-2 px-4 rounded-md font-bold transition-all ${
                        canGiveOrder
                          ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 hover:shadow-lg hover:shadow-amber-500/50'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                      whileHover={canGiveOrder ? { scale: 1.05 } : {}}
                      whileTap={canGiveOrder ? { scale: 0.95 } : {}}
                    >
                      {canGiveOrder ? '⚔️ Отдать приказ' : '⏰ Приказ уже дан'}
                    </motion.button>
                    <motion.button
                      onClick={onClose}
                      className="px-4 py-2 rounded-md font-bold bg-slate-700 text-gray-300 hover:bg-slate-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Отмена
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      onClick={handleConfirm}
                      className="flex-1 py-2 px-4 rounded-md font-bold bg-green-600 text-white hover:bg-green-700"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ✓ Подтвердить
                    </motion.button>
                    <motion.button
                      onClick={() => setIsConfirming(false)}
                      className="px-4 py-2 rounded-md font-bold bg-slate-700 text-gray-300 hover:bg-slate-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ✗ Отмена
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
