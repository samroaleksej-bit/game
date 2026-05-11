'use client';

import { motion } from 'framer-motion';

interface GameHeaderProps {
  onCompleteDay: () => void;
  onReset: () => void;
  gameEnded: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ onCompleteDay, onReset, gameEnded }) => {
  return (
    <motion.div
      className="flex justify-between items-center mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          🎰 Горнило Теней
        </h1>
        <p className="text-sm text-gray-400 mt-1">Управляйте городом и развивайте его районы</p>
      </div>

      <div className="flex gap-3">
        <motion.button
          onClick={onCompleteDay}
          disabled={gameEnded}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            gameEnded
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:shadow-lg hover:shadow-green-500/50'
          }`}
          whileHover={!gameEnded ? { scale: 1.05 } : {}}
          whileTap={!gameEnded ? { scale: 0.95 } : {}}
        >
          ▶️ Завершить день
        </motion.button>

        <motion.button
          onClick={onReset}
          className="px-6 py-3 rounded-lg font-bold bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-lg hover:shadow-red-500/50 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔄 Сброс
        </motion.button>
      </div>
    </motion.div>
  );
};
