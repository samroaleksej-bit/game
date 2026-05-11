'use client';

import { motion } from 'framer-motion';

interface DayCounterProps {
  currentDay: number;
  totalDays: number;
}

export const DayCounter: React.FC<DayCounterProps> = ({ currentDay, totalDays }) => {
  const progress = (currentDay / totalDays) * 100;
  const isNearEnd = currentDay > totalDays * 0.8;

  return (
    <motion.div
      className="bg-gradient-to-r from-purple-900 to-purple-800 border border-purple-500 rounded-lg p-6 shadow-lg"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-purple-300">Игровой День</h3>
        <span className={`text-2xl font-bold ${isNearEnd ? 'text-red-400 animate-pulse' : 'text-purple-200'}`}>
          День {currentDay} из {totalDays}
        </span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="mt-2 text-sm text-purple-300 text-center">
        {currentDay === totalDays ? (
          <span className="text-red-400 font-bold">Кампания завершена!</span>
        ) : (
          <span>Осталось {totalDays - currentDay} дней</span>
        )}
      </div>
    </motion.div>
  );
};
